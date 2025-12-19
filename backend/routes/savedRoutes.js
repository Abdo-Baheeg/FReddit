const express = require('express');
const router = express.Router();
const Saved = require('../models/Saved');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const authMiddleware = require('../middleware/auth');

// @route   POST /api/saved
// @desc    Save or unsave a post/comment
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { targetId, targetType } = req.body;

    // Validate input
    if (!targetId || !targetType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!['Post', 'Comment'].includes(targetType)) {
      return res.status(400).json({ message: 'Invalid target type' });
    }

    // Verify target exists
    const Model = targetType === 'Post' ? Post : Comment;
    const target = await Model.findById(targetId);
    if (!target) {
      return res.status(404).json({ message: `${targetType} not found` });
    }

    // Check if already saved
    const existingSave = await Saved.findOne({
      userId: req.user._id,
      targetId,
      targetType
    });

    if (existingSave) {
      // Unsave
      await Saved.deleteOne({ _id: existingSave._id });
      return res.json({ 
        message: `${targetType} unsaved`,
        saved: false 
      });
    } else {
      // Save
      await Saved.create({
        userId: req.user._id,
        targetId,
        targetType
      });
      return res.json({ 
        message: `${targetType} saved`,
        saved: true 
      });
    }
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/saved
// @desc    Get all saved items for current user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const query = { userId: req.user._id };
    if (type && ['Post', 'Comment'].includes(type)) {
      query.targetType = type;
    }

    // Get saved items with pagination
    const savedItems = await Saved.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Saved.countDocuments(query);

    // Populate the actual posts/comments
    const populatedItems = await Promise.all(
      savedItems.map(async (item) => {
        const Model = item.targetType === 'Post' ? Post : Comment;
        const target = await Model.findById(item.targetId)
          .populate('author', 'username avatar_url')
          .populate(item.targetType === 'Post' ? 'community' : 'post');

        if (!target) {
          // Target was deleted, remove the save
          await Saved.deleteOne({ _id: item._id });
          return null;
        }

        return {
          _id: item._id,
          targetType: item.targetType,
          savedAt: item.createdAt,
          target
        };
      })
    );

    // Filter out null items (deleted targets)
    const validItems = populatedItems.filter(item => item !== null);

    res.json({
      savedItems: validItems,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get saved items error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/saved/check/:targetId/:targetType
// @desc    Check if user has saved a specific post/comment
// @access  Private
router.get('/check/:targetId/:targetType', authMiddleware, async (req, res) => {
  try {
    const { targetId, targetType } = req.params;

    const saved = await Saved.findOne({
      userId: req.user._id,
      targetId,
      targetType
    });

    res.json({ saved: !!saved });
  } catch (error) {
    console.error('Check saved error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/saved/:targetId/:targetType
// @desc    Remove a saved item
// @access  Private
router.delete('/:targetId/:targetType', authMiddleware, async (req, res) => {
  try {
    const { targetId, targetType } = req.params;

    const result = await Saved.deleteOne({
      userId: req.user._id,
      targetId,
      targetType
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Save not found' });
    }

    res.json({ message: 'Item unsaved', saved: false });
  } catch (error) {
    console.error('Delete saved error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/saved/posts
// @desc    Get all saved posts for current user
// @access  Private
router.get('/posts', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const savedPosts = await Saved.find({
      userId: req.user._id,
      targetType: 'Post'
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Saved.countDocuments({
      userId: req.user._id,
      targetType: 'Post'
    });

    const posts = await Promise.all(
      savedPosts.map(async (item) => {
        const post = await Post.findById(item.targetId)
          .populate('author', 'username avatar_url')
          .populate('community', 'name');

        if (!post) {
          await Saved.deleteOne({ _id: item._id });
          return null;
        }

        return {
          ...post.toObject(),
          savedAt: item.createdAt
        };
      })
    );

    res.json({
      posts: posts.filter(p => p !== null),
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get saved posts error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/saved/comments
// @desc    Get all saved comments for current user
// @access  Private
router.get('/comments', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const savedComments = await Saved.find({
      userId: req.user._id,
      targetType: 'Comment'
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Saved.countDocuments({
      userId: req.user._id,
      targetType: 'Comment'
    });

    const comments = await Promise.all(
      savedComments.map(async (item) => {
        const comment = await Comment.findById(item.targetId)
          .populate('author', 'username avatar_url')
          .populate('post', 'title community');

        if (!comment) {
          await Saved.deleteOne({ _id: item._id });
          return null;
        }

        return {
          ...comment.toObject(),
          savedAt: item.createdAt
        };
      })
    );

    res.json({
      comments: comments.filter(c => c !== null),
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get saved comments error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
