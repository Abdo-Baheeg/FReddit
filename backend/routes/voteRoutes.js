const express = require('express');
const router = express.Router();
const Vote = require('../models/Vote');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const authMiddleware = require('../middleware/auth');

// @route   POST /api/votes
// @desc    Create or update a vote
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { targetId, targetType, voteType } = req.body;

    // Validate input
    if (!targetId || !targetType || !voteType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!['Post', 'Comment'].includes(targetType)) {
      return res.status(400).json({ message: 'Invalid target type' });
    }

    if (![1, -1].includes(voteType)) {
      return res.status(400).json({ message: 'Vote type must be 1 or -1' });
    }

    // Verify target exists
    const Model = targetType === 'Post' ? Post : Comment;
    const target = await Model.findById(targetId);
    if (!target) {
      return res.status(404).json({ message: `${targetType} not found` });
    }

    // Find existing vote
    const existingVote = await Vote.findOne({
      userId: req.user._id,
      targetId,
      targetType
    });

    let oldVoteType = existingVote ? existingVote.voteType : 0;
    let newVoteType = voteType;

    // If clicking same vote, remove it
    if (existingVote && existingVote.voteType === voteType) {
      await Vote.deleteOne({ _id: existingVote._id });
      newVoteType = 0;
    } else if (existingVote) {
      // Update existing vote
      existingVote.voteType = voteType;
      await existingVote.save();
    } else {
      // Create new vote
      await Vote.create({
        userId: req.user._id,
        targetId,
        targetType,
        voteType
      });
    }

    // Update vote counts on target
    if (oldVoteType === 1) target.upvoteCount -= 1;
    if (oldVoteType === -1) target.downvoteCount -= 1;
    if (newVoteType === 1) target.upvoteCount += 1;
    if (newVoteType === -1) target.downvoteCount += 1;
    
    target.score = target.upvoteCount - target.downvoteCount;
    await target.save();

    res.json({
      message: 'Vote updated',
      score: target.score,
      upvoteCount: target.upvoteCount,
      downvoteCount: target.downvoteCount,
      userVote: newVoteType
    });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/votes/user/:targetId/:targetType
// @desc    Get user's vote on a target
// @access  Private
router.get('/user/:targetId/:targetType', authMiddleware, async (req, res) => {
  try {
    const { targetId, targetType } = req.params;

    const vote = await Vote.findOne({
      userId: req.user._id,
      targetId,
      targetType
    });

    res.json({ voteType: vote ? vote.voteType : 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/votes/:targetId/:targetType
// @desc    Get vote counts for a target
// @access  Public
router.get('/:targetId/:targetType', async (req, res) => {
  try {
    const { targetId, targetType } = req.params;

    const upvotes = await Vote.countDocuments({ targetId, targetType, voteType: 1 });
    const downvotes = await Vote.countDocuments({ targetId, targetType, voteType: -1 });

    res.json({
      upvoteCount: upvotes,
      downvoteCount: downvotes,
      score: upvotes - downvotes
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
