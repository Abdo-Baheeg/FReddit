const express = require('express');

const router = express.Router();
const { body } = require('express-validator');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Vote = require('../models/Vote');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');
const { emailVerificationLimiter, passwordResetLimiter } = require('../middleware/rateLimiter');
const { sendVerificationEmail, sendPasswordResetEmail, sendPasswordResetConfirmation } = require('../services/emailService');

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({ username, email, password });
    await user.save();

    // Generate email verification token
    const verificationToken = user.generateEmailVerificationToken();
    await user.save();

    // Send verification email (don't block registration if email fails)
    try {
      await sendVerificationEmail(email, username, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Continue with registration even if email fails
    }

    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        karma: user.karma,
        isEmailVerified: user.isEmailVerified
      },
      message: 'Registration successful. Please check your email to verify your account.'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/users/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        karma: user.karma,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/users/me
// @desc    Get current user
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
  try {
    res.json({
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      imgURL: req.user.imgURL,
      karma: req.user.karma
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/users/resend-verification
// @desc    Resend email verification
// @access  Private
router.post('/resend-verification', authMiddleware, emailVerificationLimiter, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate new verification token
    const verificationToken = user.generateEmailVerificationToken();
    await user.save();

    // Send verification email
    await sendVerificationEmail(user.email, user.username, verificationToken);

    res.json({ message: 'Verification email sent successfully' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ message: 'Failed to send verification email', error: error.message });
  }
});

// @route   GET /api/users/verify-email/:token
// @desc    Verify email with token
// @access  Public
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // Find user with valid token
    const users = await User.find({
      emailVerificationToken: { $ne: null },
      emailVerificationTokenExpires: { $gt: Date.now() }
    });

    let user = null;
    for (const u of users) {
      if (u.verifyEmailToken(token)) {
        user = u;
        break;
      }
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    // Mark email as verified
    user.clearEmailVerificationToken();
    await user.save();

    res.json({ 
      message: 'Email verified successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Email verification failed', error: error.message });
  }
});

// @route   POST /api/users/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', passwordResetLimiter, [
  body('email').isEmail().withMessage('Please enter a valid email')
], async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Don't reveal if user exists or not for security
    if (!user) {
      return res.json({ message: 'If an account exists with that email, a password reset link has been sent.' });
    }

    // Check reset attempts
    if (user.passwordResetAttempts >= 5) {
      const oneHour = 60 * 60 * 1000;
      if (user.passwordResetAttemptsResetAt && Date.now() - user.passwordResetAttemptsResetAt < oneHour) {
        return res.status(429).json({ message: 'Too many reset attempts. Please try again later.' });
      }
      // Reset counter if it's been more than an hour
      user.passwordResetAttempts = 0;
    }

    // Generate password reset token
    const resetToken = user.generatePasswordResetToken();
    user.passwordResetAttempts += 1;
    user.passwordResetAttemptsResetAt = Date.now();
    await user.save();

    // Send password reset email
    await sendPasswordResetEmail(user.email, user.username, resetToken);

    res.json({ message: 'If an account exists with that email, a password reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Failed to process password reset request', error: error.message });
  }
});

// @route   POST /api/users/reset-password/:token
// @desc    Reset password with token
// @access  Public
router.post('/reset-password/:token', [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find user with valid token
    const users = await User.find({
      passwordResetToken: { $ne: null },
      passwordResetTokenExpires: { $gt: Date.now() }
    });

    let user = null;
    for (const u of users) {
      if (u.verifyPasswordResetToken(token)) {
        user = u;
        break;
      }
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password
    user.password = password;
    user.clearPasswordResetToken();
    await user.save();

    // Send confirmation email
    try {
      await sendPasswordResetConfirmation(user.email, user.username);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the password reset if confirmation email fails
    }

    res.json({ message: 'Password reset successful. You can now log in with your new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Failed to reset password', error: error.message });
  }
});

// ==================== USER ACTIVITY ROUTES ====================

// @route   GET /api/users/:userId/posts
// @desc    Get all posts by a specific user
// @access  Public
router.get('/:userId/posts', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, sort = 'new' } = req.query;

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Determine sort order
    let sortQuery = {};
    switch (sort) {
      case 'new':
        sortQuery = { createdAt: -1 };
        break;
      case 'top':
        sortQuery = { score: -1, createdAt: -1 };
        break;
      case 'old':
        sortQuery = { createdAt: 1 };
        break;
      default:
        sortQuery = { createdAt: -1 };
    }

    // Get posts with pagination
    const posts = await Post.find({ author: userId })
      .populate('author', 'username imgURL karma')
      .sort(sortQuery)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Get total count for pagination
    const totalPosts = await Post.countDocuments({ author: userId });

    res.json({
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalPosts / parseInt(limit)),
        totalPosts,
        hasMore: totalPosts > parseInt(page) * parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/users/:userId/comments
// @desc    Get all comments by a specific user
// @access  Public
router.get('/:userId/comments', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, sort = 'new' } = req.query;

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Determine sort order
    let sortQuery = {};
    switch (sort) {
      case 'new':
        sortQuery = { createdAt: -1 };
        break;
      case 'top':
        sortQuery = { score: -1, createdAt: -1 };
        break;
      case 'old':
        sortQuery = { createdAt: 1 };
        break;
      default:
        sortQuery = { createdAt: -1 };
    }

    // Get comments with pagination
    const comments = await Comment.find({ author: userId })
      .populate('author', 'username imgURL karma')
      .populate('post', 'title')
      .sort(sortQuery)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Get total count for pagination
    const totalComments = await Comment.countDocuments({ author: userId });

    res.json({
      comments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalComments / parseInt(limit)),
        totalComments,
        hasMore: totalComments > parseInt(page) * parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get user comments error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/users/:userId/upvoted
// @desc    Get all posts and comments upvoted by a user
// @access  Public (or Private if you want only user to see their own)
router.get('/:userId/upvoted', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, type = 'all' } = req.query; // type: 'all', 'posts', 'comments'

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Build query based on type filter
    let voteQuery = { 
      userId: userId, 
      voteType: 1 // 1 = upvote
    };

    if (type === 'posts') {
      voteQuery.targetType = 'Post';
    } else if (type === 'comments') {
      voteQuery.targetType = 'Comment';
    }

    // Get upvoted items
    const votes = await Vote.find(voteQuery)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Get total count
    const totalVotes = await Vote.countDocuments(voteQuery);

    // Separate post IDs and comment IDs
    const postIds = votes.filter(v => v.targetType === 'Post').map(v => v.targetId);
    const commentIds = votes.filter(v => v.targetType === 'Comment').map(v => v.targetId);

    // Fetch actual posts and comments
    const posts = await Post.find({ _id: { $in: postIds } })
      .populate('author', 'username imgURL karma');
    
    const comments = await Comment.find({ _id: { $in: commentIds } })
      .populate('author', 'username imgURL karma')
      .populate('post', 'title');

    // Create a map for quick lookup
    const postsMap = posts.reduce((acc, post) => {
      acc[post._id.toString()] = post;
      return acc;
    }, {});

    const commentsMap = comments.reduce((acc, comment) => {
      acc[comment._id.toString()] = comment;
      return acc;
    }, {});

    // Build ordered results matching vote order
    const upvotedItems = votes.map(vote => {
      if (vote.targetType === 'Post') {
        return {
          type: 'post',
          votedAt: vote.createdAt,
          item: postsMap[vote.targetId.toString()] || null
        };
      } else {
        return {
          type: 'comment',
          votedAt: vote.createdAt,
          item: commentsMap[vote.targetId.toString()] || null
        };
      }
    }).filter(item => item.item !== null); // Remove any deleted items

    res.json({
      upvotedItems,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalVotes / parseInt(limit)),
        totalItems: totalVotes,
        hasMore: totalVotes > parseInt(page) * parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get user upvoted error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/users/:userId/downvoted
// @desc    Get all posts and comments downvoted by a user
// @access  Public (or Private if you want only user to see their own)
router.get('/:userId/downvoted', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, type = 'all' } = req.query; // type: 'all', 'posts', 'comments'

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Build query based on type filter
    let voteQuery = { 
      userId: userId, 
      voteType: -1 // -1 = downvote
    };

    if (type === 'posts') {
      voteQuery.targetType = 'Post';
    } else if (type === 'comments') {
      voteQuery.targetType = 'Comment';
    }

    // Get downvoted items
    const votes = await Vote.find(voteQuery)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Get total count
    const totalVotes = await Vote.countDocuments(voteQuery);

    // Separate post IDs and comment IDs
    const postIds = votes.filter(v => v.targetType === 'Post').map(v => v.targetId);
    const commentIds = votes.filter(v => v.targetType === 'Comment').map(v => v.targetId);

    // Fetch actual posts and comments
    const posts = await Post.find({ _id: { $in: postIds } })
      .populate('author', 'username imgURL karma');
    
    const comments = await Comment.find({ _id: { $in: commentIds } })
      .populate('author', 'username imgURL karma')
      .populate('post', 'title');

    // Create a map for quick lookup
    const postsMap = posts.reduce((acc, post) => {
      acc[post._id.toString()] = post;
      return acc;
    }, {});

    const commentsMap = comments.reduce((acc, comment) => {
      acc[comment._id.toString()] = comment;
      return acc;
    }, {});

    // Build ordered results matching vote order
    const downvotedItems = votes.map(vote => {
      if (vote.targetType === 'Post') {
        return {
          type: 'post',
          votedAt: vote.createdAt,
          item: postsMap[vote.targetId.toString()] || null
        };
      } else {
        return {
          type: 'comment',
          votedAt: vote.createdAt,
          item: commentsMap[vote.targetId.toString()] || null
        };
      }
    }).filter(item => item.item !== null); // Remove any deleted items

    res.json({
      downvotedItems,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalVotes / parseInt(limit)),
        totalItems: totalVotes,
        hasMore: totalVotes > parseInt(page) * parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get user downvoted error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/users/:userId/overview
// @desc    Get user overview (posts and comments combined)
// @access  Public
router.get('/:userId/overview', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, sort = 'new' } = req.query;

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get posts
    const posts = await Post.find({ author: userId })
      .populate('author', 'username imgURL karma')
      .lean();

    // Get comments
    const comments = await Comment.find({ author: userId })
      .populate('author', 'username imgURL karma')
      .populate('post', 'title')
      .lean();

    // Combine and add type identifier
    const allItems = [
      ...posts.map(post => ({ ...post, type: 'post' })),
      ...comments.map(comment => ({ ...comment, type: 'comment' }))
    ];

    // Sort based on query
    allItems.sort((a, b) => {
      if (sort === 'new') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sort === 'top') {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sort === 'old') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // Paginate
    const startIdx = (parseInt(page) - 1) * parseInt(limit);
    const endIdx = startIdx + parseInt(limit);
    const paginatedItems = allItems.slice(startIdx, endIdx);

    res.json({
      items: paginatedItems,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(allItems.length / parseInt(limit)),
        totalItems: allItems.length,
        hasMore: allItems.length > endIdx
      }
    });
  } catch (error) {
    console.error('Get user overview error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/users/:userId/stats
// @desc    Get user statistics
// @access  Public
router.get('/:userId/stats', async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get counts
    const postCount = await Post.countDocuments({ author: userId });
    const commentCount = await Comment.countDocuments({ author: userId });
    const upvotesGiven = await Vote.countDocuments({ userId, voteType: 1 });
    const downvotesGiven = await Vote.countDocuments({ userId, voteType: -1 });

    // Get upvotes/downvotes received on user's posts
    const userPosts = await Post.find({ author: userId }).select('_id');
    const postIds = userPosts.map(p => p._id);
    
    const upvotesReceivedOnPosts = await Vote.countDocuments({ 
      targetId: { $in: postIds }, 
      targetType: 'Post', 
      voteType: 1 
    });
    
    const downvotesReceivedOnPosts = await Vote.countDocuments({ 
      targetId: { $in: postIds }, 
      targetType: 'Post', 
      voteType: -1 
    });

    // Get upvotes/downvotes received on user's comments
    const userComments = await Comment.find({ author: userId }).select('_id');
    const commentIds = userComments.map(c => c._id);
    
    const upvotesReceivedOnComments = await Vote.countDocuments({ 
      targetId: { $in: commentIds }, 
      targetType: 'Comment', 
      voteType: 1 
    });
    
    const downvotesReceivedOnComments = await Vote.countDocuments({ 
      targetId: { $in: commentIds }, 
      targetType: 'Comment', 
      voteType: -1 
    });

    res.json({
      user: {
        id: user._id,
        username: user.username,
        karma: user.karma,
        createdAt: user.createdAt
      },
      stats: {
        posts: postCount,
        comments: commentCount,
        upvotesGiven,
        downvotesGiven,
        upvotesReceived: upvotesReceivedOnPosts + upvotesReceivedOnComments,
        downvotesReceived: downvotesReceivedOnPosts + downvotesReceivedOnComments,
        totalKarma: (upvotesReceivedOnPosts + upvotesReceivedOnComments) - (downvotesReceivedOnPosts + downvotesReceivedOnComments)
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
