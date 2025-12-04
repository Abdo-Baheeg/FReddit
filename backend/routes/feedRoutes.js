const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getTrendingPosts, getHomeFeed, getSuggestedFeed } = require('../services/feedService');

// Get trending posts (public)
router.get('/trending', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({ error: 'Invalid pagination parameters' });
    }
    
    const result = await getTrendingPosts(page, limit);
    res.json(result);
  } catch (error) {
    console.error('Error in GET /trending:', error);
    res.status(500).json({ error: 'Failed to fetch trending posts' });
  }
});

// Get personalized home feed (requires authentication)
router.get('/home', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({ error: 'Invalid pagination parameters' });
    }
    
    const result = await getHomeFeed(req.userId, page, limit);
    res.json(result);
  } catch (error) {
    console.error('Error in GET /home:', error);
    res.status(500).json({ error: 'Failed to fetch home feed' });
  }
});

// Get suggested feed (requires authentication)
router.get('/suggested', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({ error: 'Invalid pagination parameters' });
    }
    
    const result = await getSuggestedFeed(req.userId, page, limit);
    res.json(result);
  } catch (error) {
    console.error('Error in GET /suggested:', error);
    res.status(500).json({ error: 'Failed to fetch suggested feed' });
  }
});

module.exports = router;
