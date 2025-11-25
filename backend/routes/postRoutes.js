const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth');

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
      upvotes: [],
      downvotes: [],
      score: 0, 
      community: subreddit
    });

    await post.save();
    await post.populate('author', 'username');

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/posts/:id/vote
// @desc    Vote on a post
// @access  Private
router.put('/:id/vote', authMiddleware, async (req, res) => {
  try {
    const { voteType } = req.body; // 'upvote' or 'downvote'
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user._id;

    // Remove existing votes
    post.upvotes = post.upvotes.filter(id => !id.equals(userId));
    post.downvotes = post.downvotes.filter(id => !id.equals(userId));

    // Add new vote
    if (voteType === 'upvote') {
      post.upvotes.push(userId);
    } else if (voteType === 'downvote') {
      post.downvotes.push(userId);
    }

    post.score = post.upvotes.length - post.downvotes.length;
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

    // Gemini API endpoint
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Please provide a concise summary (2-3 sentences) of the following post:\n\nTitle: ${post.title}\n\nContent: ${post.content}`
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ 
        message: 'Failed to generate summary', 
        error: errorData 
      });
    }

    const data = await response.json();
    
    // Extract the generated summary from Gemini's response
    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Summary could not be generated';
    
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
