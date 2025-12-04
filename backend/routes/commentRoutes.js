const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Vote = require('../models/Vote');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// @route   GET /api/comments/post/:postId
// @desc    Get all comments for a post
// @access  Public
router.get('/post/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/comments
// @desc    Create a new comment
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { content, postId, parentCommentId } = req.body;

    const comment = new Comment({
      content,
      post: postId,
      author: req.user._id,
      parentComment: parentCommentId || null
    });

    await comment.save();
    await comment.populate('author', 'username');

    // Update post comment count
    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });
    
    // Increment user's comment count
    await User.findByIdAndUpdate(req.user._id, { $inc: { commentCount: 1 } });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/comments/:id/vote
// @desc    Vote on a comment (deprecated - use /api/votes instead)
// @access  Private
router.put('/:id/vote', authMiddleware, async (req, res) => {
  try {
    const { voteType } = req.body;
    
    // Convert to new vote system format
    const voteValue = voteType === 'upvote' ? 1 : voteType === 'downvote' ? -1 : 0;
    
    if (voteValue === 0) {
      return res.status(400).json({ message: 'Invalid vote type' });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Find existing vote
    const existingVote = await Vote.findOne({
      userId: req.user._id,
      targetId: req.params.id,
      targetType: 'Comment'
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
        targetType: 'Comment',
        voteType: voteValue
      });
    }

    // Update vote counts
    if (oldVoteType === 1) comment.upvoteCount -= 1;
    if (oldVoteType === -1) comment.downvoteCount -= 1;
    if (newVoteType === 1) comment.upvoteCount += 1;
    if (newVoteType === -1) comment.downvoteCount += 1;
    
    comment.score = comment.upvoteCount - comment.downvoteCount;
    await comment.save();

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/comments/:id
// @desc    Delete a comment
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    // Update post comment count
    await Post.findByIdAndUpdate(comment.post, { $inc: { commentCount: -1 } });
    
    // Delete all votes for this comment
    await Vote.deleteMany({ targetId: req.params.id, targetType: 'Comment' });
    
    // Decrement user's comment count
    await User.findByIdAndUpdate(req.user._id, { $inc: { commentCount: -1 } });

    await comment.deleteOne();
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
