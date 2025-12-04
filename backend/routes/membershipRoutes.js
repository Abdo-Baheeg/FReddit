const express = require('express');
const router = express.Router();
const Membership = require('../models/Membership');
const Community = require('../models/Community');
const authMiddleware = require('../middleware/auth');

// @route   POST /api/memberships
// @desc    Join a community
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { communityId } = req.body;

    if (!communityId) {
      return res.status(400).json({ message: 'Community ID is required' });
    }

    // Check if community exists
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Check if already a member
    const existingMembership = await Membership.findOne({
      userId: req.user._id,
      communityId
    });

    if (existingMembership) {
      return res.status(400).json({ message: 'Already a member of this community' });
    }

    // Create membership
    const membership = await Membership.create({
      userId: req.user._id,
      communityId,
      role: 'member'
    });

    // Increment community member count
    community.memberCount += 1;
    await community.save();

    res.status(201).json({
      message: 'Joined community successfully',
      membership
    });
  } catch (error) {
    console.error('Join community error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/memberships/:communityId
// @desc    Leave a community
// @access  Private
router.delete('/:communityId', authMiddleware, async (req, res) => {
  try {
    const { communityId } = req.params;

    const membership = await Membership.findOneAndDelete({
      userId: req.user._id,
      communityId
    });

    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    // Decrement community member count
    const community = await Community.findById(communityId);
    if (community) {
      community.memberCount = Math.max(0, community.memberCount - 1);
      await community.save();
    }

    res.json({ message: 'Left community successfully' });
  } catch (error) {
    console.error('Leave community error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/memberships/user
// @desc    Get all communities a user is member of
// @access  Private
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const memberships = await Membership.find({ userId: req.user._id })
      .populate('communityId', 'name description memberCount')
      .sort({ joinedAt: -1 });

    res.json(memberships);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/memberships/community/:communityId
// @desc    Get all members of a community
// @access  Public
router.get('/community/:communityId', async (req, res) => {
  try {
    const { communityId } = req.params;
    const { role, page = 1, limit = 50 } = req.query;

    const query = { communityId };
    if (role) query.role = role;

    const memberships = await Membership.find(query)
      .populate('userId', 'username avatar_url karma')
      .sort({ joinedAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Membership.countDocuments(query);

    res.json({
      memberships,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/memberships/:communityId/role
// @desc    Update member role (moderator only)
// @access  Private
router.put('/:communityId/role', authMiddleware, async (req, res) => {
  try {
    const { communityId } = req.params;
    const { userId, role } = req.body;

    if (!['member', 'moderator'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Check if requester is moderator
    const requesterMembership = await Membership.findOne({
      userId: req.user._id,
      communityId,
      role: 'moderator'
    });

    if (!requesterMembership) {
      return res.status(403).json({ message: 'Only moderators can change roles' });
    }

    // Update target user's role
    const membership = await Membership.findOneAndUpdate(
      { userId, communityId },
      { role },
      { new: true }
    ).populate('userId', 'username avatar_url');

    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    res.json({ message: 'Role updated successfully', membership });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/memberships/check/:communityId
// @desc    Check if user is member of community
// @access  Private
router.get('/check/:communityId', authMiddleware, async (req, res) => {
  try {
    const { communityId } = req.params;

    const membership = await Membership.findOne({
      userId: req.user._id,
      communityId
    });

    res.json({
      isMember: !!membership,
      role: membership ? membership.role : null
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
