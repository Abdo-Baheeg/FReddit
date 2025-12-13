const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Vote = require('../models/Vote');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const { GoogleGenAI } = require('@google/genai');

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/posts/user/:userId
// @desc    Get posts by user ID with pagination and sorting
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, sort = 'new' } = req.query;

    // Determine sort order
    let sortQuery = {};
    switch (sort) {
      case 'new':
        sortQuery = { createdAt: -1 };
        break;
      case 'top':
        sortQuery = { score: -1, createdAt: -1 };
        break;
      case 'old':
        sortQuery = { createdAt: 1 };
        break;
      default:
        sortQuery = { createdAt: -1 };
    }

    const posts = await Post.find({ author: userId })
      .populate('author', 'username imgURL karma')
      .sort(sortQuery)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalPosts = await Post.countDocuments({ author: userId });

    res.json({
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalPosts / parseInt(limit)),
        totalPosts,
        hasMore: totalPosts > parseInt(page) * parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/posts/create
// @desc    Create a new post
// @access  Private
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { title, content, subreddit } = req.body;

    const post = new Post({
      title,
      content,
      author: req.user._id,
      score: 0,
      upvoteCount: 0,
      downvoteCount: 0,
      community: subreddit
    });

    await post.save();
    await post.populate('author', 'username');

    // Increment user's post count
    await User.findByIdAndUpdate(req.user._id, { $inc: { postCount: 1 } });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/posts/:id/vote
// @desc    Vote on a post (deprecated - use /api/votes instead)
// @access  Private
router.put('/:id/vote', authMiddleware, async (req, res) => {
  try {
    const { voteType } = req.body; // 'upvote' or 'downvote'
    
    // Convert to new vote system format
    const voteValue = voteType === 'upvote' ? 1 : voteType === 'downvote' ? -1 : 0;
    
    if (voteValue === 0) {
      return res.status(400).json({ message: 'Invalid vote type' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Find existing vote
    const existingVote = await Vote.findOne({
      userId: req.user._id,
      targetId: req.params.id,
      targetType: 'Post'
    });

    let oldVoteType = existingVote ? existingVote.voteType : 0;
    let newVoteType = voteValue;

    // If clicking same vote, remove it
    if (existingVote && existingVote.voteType === voteValue) {
      await Vote.deleteOne({ _id: existingVote._id });
      newVoteType = 0;
    } else if (existingVote) {
      existingVote.voteType = voteValue;
      await existingVote.save();
    } else {
      await Vote.create({
        userId: req.user._id,
        targetId: req.params.id,
        targetType: 'Post',
        voteType: voteValue
      });
    }

    // Update vote counts
    if (oldVoteType === 1) post.upvoteCount -= 1;
    if (oldVoteType === -1) post.downvoteCount -= 1;
    if (newVoteType === 1) post.upvoteCount += 1;
    if (newVoteType === -1) post.downvoteCount += 1;
    
    post.score = post.upvoteCount - post.downvoteCount;
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    
    // Delete all votes for this post
    await Vote.deleteMany({ targetId: req.params.id, targetType: 'Post' });
    
    // Decrement user's post count
    await User.findByIdAndUpdate(req.user._id, { $inc: { postCount: -1 } });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/posts/:id/summary
// @desc    Generate summary for a post using Gemini API
// @access  Private
router.put('/:id/summary', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ message: 'Gemini API key not configured' });
    }

    // Initialize GoogleGenAI client
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Please provide a concise summary (2-3 sentences) of the following post:\n\nTitle: ${post.title}\n\nContent: ${post.content}`
    });
    
    const summary = response.text || 'Summary could not be generated';
    
    post.summary = summary;
    await post.save();
    
    res.json({ 
      summary: post.summary,
      postId: post._id,
      title: post.title
    });
  } catch (error) {
    console.error('Summary generation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
