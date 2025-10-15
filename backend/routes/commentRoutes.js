const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
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

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/comments/:id/vote
// @desc    Vote on a comment
// @access  Private
router.put('/:id/vote', authMiddleware, async (req, res) => {
  try {
    const { voteType } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const userId = req.user._id;

    // Remove existing votes
    comment.upvotes = comment.upvotes.filter(id => !id.equals(userId));
    comment.downvotes = comment.downvotes.filter(id => !id.equals(userId));

    // Add new vote
    if (voteType === 'upvote') {
      comment.upvotes.push(userId);
    } else if (voteType === 'downvote') {
      comment.downvotes.push(userId);
    }

    comment.score = comment.upvotes.length - comment.downvotes.length;
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

    await comment.deleteOne();
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
