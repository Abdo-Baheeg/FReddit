const express = require('express');
const router = express.Router();
const Community = require('../models/Community');
const Membership = require('../models/Membership');
const authMiddleware = require('../middleware/auth');

// @route   POST /api/communities
// @desc    Create a new community
// @access  Private
router.post('/create', authMiddleware, async (req, res) => {
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
      memberCount: 1
    });
    await community.save();
    
    // Add creator as moderator
    await Membership.create({
      userId: req.user._id,
      communityId: community._id,
      role: 'moderator'
    });
    
    res.status(201).json(community);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/communities
// @desc    Get all communities
// @access  Public
router.get('/communities', async (req, res) => {
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
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Check if already a member
    const existingMembership = await Membership.findOne({
      userId: req.user._id,
      communityId: req.params.id
    });

    if (existingMembership) {
      return res.status(400).json({ message: 'Already a member of this community' });
    }

    // Create membership
    await Membership.create({
      userId: req.user._id,
      communityId: req.params.id,
      role: 'member'
    });

    // Increment member count
    community.memberCount += 1;
    await community.save();

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

    // Delete membership
    const membership = await Membership.findOneAndDelete({
      userId: req.user._id,
      communityId: req.params.id
    });

    if (!membership) {
      return res.status(404).json({ message: 'Not a member of this community' });
    }

    // Decrement member count
    community.memberCount = Math.max(0, community.memberCount - 1);
    await community.save();

    res.json({ message: 'Left community successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;