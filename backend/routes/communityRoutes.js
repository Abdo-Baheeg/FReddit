const express = require('express');
const router = express.Router();
const Community = require('../models/Community');
const Membership = require('../models/Membership');
const authMiddleware = require('../middleware/auth');

// @route   POST /api/communities
// @desc    Create a new community
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { 
      name, 
      description, 
      rules = [], 
      isPublic = true, 
      ageVerified = false, 
      bannerUrl = '', 
      avatarUrl = '' 
    } = req.body;
    
    // Validate required fields
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Community name is required' });
    }
    
    // Check if community exists
    let community = await Community.findOne({ name });
    if (community) {
      return res.status(400).json({ message: 'Community already exists' });
    }
    
    // Create new community
    community = new Community({
      name: name.trim(),
      description: description || '',
      rules: Array.isArray(rules) ? rules : [],
      isPublic,
      ageVerified,
      bannerUrl,
      avatarUrl,
      memberCount: 1,
      moderators: [req.user._id]
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
router.get('/', async (req, res) => {
  try {
    const communities = await Community.find().sort({ createdAt: -1 });
    res.json(communities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/communities/search
// @desc    Search communities
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const communities = await Community.find({
      name: { $regex: q, $options: 'i' }
    })
      .sort({ memberCount: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Community.countDocuments({
      name: { $regex: q, $options: 'i' }
    });

    res.json({
      communities,
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

// @route   GET /api/communities/:id/posts
// @desc    Get all posts from a community
// @access  Public
router.get('/:id/posts', async (req, res) => {
  try {
    const Post = require('../models/Post');
    const { page = 1, limit = 20, sort = 'new' } = req.query;
    const skip = (page - 1) * limit;

    // Verify community exists
    const community = await Community.findById(req.params.id);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Determine sort order
    let sortOption = {};
    switch (sort) {
      case 'hot':
      case 'top':
        sortOption = { score: -1, createdAt: -1 };
        break;
      case 'new':
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    // Get posts
    const posts = await Post.find({ community: req.params.id })
      .populate('author', 'username')
      .populate('community', 'name')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Post.countDocuments({ community: req.params.id });

    res.json({
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
        hasMore: skip + posts.length < total
      }
    });
  } catch (error) {
    console.error('Error fetching community posts:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;