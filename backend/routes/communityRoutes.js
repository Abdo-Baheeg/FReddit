const express = require('express');
const router = express.Router();
const Community = require('../models/Community');
const authMiddleware = require('../middleware/auth');

// @route   POST /api/communities
// @desc    Create a new community
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;
    // Check if community exists
    let community = await Community.findOne({ name });
    if (community) {
      return res.status(400).json({ message: 'Community already exists' });
    }
    // Create new community
    community = new Community({
      name,
        description,
        creator: req.user._id
    });
    await community.save();
    res.status(201).json(community);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/communities
// @desc    Get all communities
// @access  Public
router.get('/api/communities', async (req, res) => {
  try {
    const communities = await Community.find().sort({ createdAt: -1 });
    res.json(communities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/communities/:id
// @desc    Get community by ID
router.get('/:id', async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }
    res.json(community);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/communities/:id/join
// @desc    Join a community
// @access  Private
router.post('/:id/join', authMiddleware, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    const userId = req.user._id;
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }
    // Add user to members if not already a member
    if (!community.members.includes(userId)) {
      community.members.push(userId);
      await community.save();
    }
    // add community from user's joinedCommunities if already present
    if (!req.user.joinedCommunities.includes(community._id)) {
        req.user.joinedCommunities.push(community._id);
        await req.user.save();
    }
    res.json({ message: 'Joined community successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/communities/:id/leave
// @desc    Leave a community
// @access  Private
router.post('/:id/leave', authMiddleware, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }
    // Remove user from members if a member
    community.members = community.members.filter(
      memberId => !memberId.equals(req.user._id)
    );
    await community.save();
    // remove community from user's joinedCommunities
    req.user.joinedCommunities = req.user.joinedCommunities.filter(
      communityId => !communityId.equals(community._id)
    );
    await req.user.save();
    res.json({ message: 'Left community successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;