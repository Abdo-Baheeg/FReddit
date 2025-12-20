const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Community = require('../models/Community');
const authMiddleware = require('../middleware/auth');

// @route   GET /api/search
// @desc    Search across posts, users, and communities
// @access  Public (but shows more data if authenticated)
router.get('/', async (req, res) => {
  try {
    const { q, type = 'all', page = 1, limit = 20, sort = 'relevant' } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    const skip = (page - 1) * limit;
    const searchRegex = { $regex: q, $options: 'i' };
    const results = {};

    // Search Posts
    if (type === 'all' || type === 'posts') {
      const postQuery = {
        $or: [
          { title: searchRegex },
          { content: searchRegex }
        ]
      };

      let postSort = {};
      switch (sort) {
        case 'new':
          postSort = { createdAt: -1 };
          break;
        case 'top':
          postSort = { upvotes: -1, createdAt: -1 };
          break;
        case 'comments':
          postSort = { commentCount: -1, createdAt: -1 };
          break;
        default:
          postSort = { upvotes: -1, createdAt: -1 };
      }

      const posts = await Post.find(postQuery)
        .populate('author', 'username avatar')
        .populate('community', 'name icon_url')
        .sort(postSort)
        .skip(type === 'posts' ? skip : 0)
        .limit(type === 'posts' ? parseInt(limit) : 10);

      const postsTotal = await Post.countDocuments(postQuery);

      results.posts = {
        items: posts,
        total: postsTotal,
        page: type === 'posts' ? parseInt(page) : 1,
        pages: type === 'posts' ? Math.ceil(postsTotal / limit) : Math.ceil(postsTotal / 10)
      };
    }

    // Search Communities
    if (type === 'all' || type === 'communities') {
      const communityQuery = {
        $or: [
          { name: searchRegex },
          { description: searchRegex }
        ]
      };

      const communities = await Community.find(communityQuery)
        .sort({ memberCount: -1, createdAt: -1 })
        .skip(type === 'communities' ? skip : 0)
        .limit(type === 'communities' ? parseInt(limit) : 10);

      const communitiesTotal = await Community.countDocuments(communityQuery);

      results.communities = {
        items: communities,
        total: communitiesTotal,
        page: type === 'communities' ? parseInt(page) : 1,
        pages: type === 'communities' ? Math.ceil(communitiesTotal / limit) : Math.ceil(communitiesTotal / 10)
      };
    }

    // Search Users
    if (type === 'all' || type === 'users') {
      const userQuery = {
        username: searchRegex
      };

      const users = await User.find(userQuery)
        .select('username avatar email createdAt')
        .sort({ createdAt: -1 })
        .skip(type === 'users' ? skip : 0)
        .limit(type === 'users' ? parseInt(limit) : 10);

      const usersTotal = await User.countDocuments(userQuery);

      results.users = {
        items: users,
        total: usersTotal,
        page: type === 'users' ? parseInt(page) : 1,
        pages: type === 'users' ? Math.ceil(usersTotal / limit) : Math.ceil(usersTotal / 10)
      };
    }

    res.json({
      query: q,
      type,
      sort,
      results
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
