const Post = require('../models/Post');
const Community = require('../models/Community');
const Membership = require('../models/Membership');
const { getCache, setCache } = require('../config/redis');

// Calculate trending score based on engagement velocity
const calculateTrendingScore = (post) => {
  const now = Date.now();
  const postAge = (now - post.createdAt.getTime()) / (1000 * 60 * 60); // Age in hours
  
  if (postAge === 0) return 0;
  
  // Engagement velocity: (upvotes + comments) / age in hours
  const engagement = post.upvoteCount + post.comments.length;
  const velocity = engagement / Math.max(postAge, 0.5); // Prevent division by very small numbers
  
  // Weighted score: velocity * gravity factor
  // Gravity factor decreases with age to give newer posts a chance
  const gravity = 1 / Math.pow(postAge + 2, 1.5);
  
  return velocity * gravity * 1000; // Multiply by 1000 for better score range
};

// Get trending posts (last 24 hours, sorted by engagement velocity)
const getTrendingPosts = async (page = 1, limit = 20) => {
  const cacheKey = `trending:${page}:${limit}`;
  
  // Try cache first (10 min TTL for trending)
  const cached = await getCache(cacheKey);
  if (cached) {
    return cached;
  }
  
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    // Fetch recent posts with good engagement
    const posts = await Post.find({
      createdAt: { $gte: oneDayAgo }
    })
      .populate('author', 'username profilePicture')
      .populate('community', 'name picture')
      .lean()
      .limit(limit * 5); // Get more posts to calculate scores
    
    // Calculate trending scores
    const postsWithScores = posts.map(post => ({
      ...post,
      trendingScore: calculateTrendingScore(post)
    }));
    
    // Sort by trending score and paginate
    const sortedPosts = postsWithScores
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice((page - 1) * limit, page * limit);
    
    const result = {
      posts: sortedPosts,
      page,
      limit,
      hasMore: sortedPosts.length === limit
    };
    
    // Cache for 10 minutes
    await setCache(cacheKey, result, 600);
    
    return result;
  } catch (error) {
    console.error('Error fetching trending posts:', error);
    throw error;
  }
};

// Get personalized home feed (70% from joined communities, 30% discovery)
const getHomeFeed = async (userId, page = 1, limit = 20) => {
  const cacheKey = `home:${userId}:${page}:${limit}`;
  
  // Try cache first (5 min TTL for personalized feed)
  const cached = await getCache(cacheKey);
  if (cached) {
    return cached;
  }
  
  try {
    // Get user's joined communities
    const memberships = await Membership.find({ userId })
      .select('communityId')
      .lean();
    
    const joinedCommunityIds = memberships.map(m => m.communityId);
    
    // Calculate split: 70% relevant, 30% discovery
    const relevantCount = Math.ceil(limit * 0.7);
    const discoveryCount = limit - relevantCount;
    
    let allPosts = [];
    
    // Fetch relevant posts from joined communities
    if (joinedCommunityIds.length > 0) {
      const relevantPosts = await Post.find({
        community: { $in: joinedCommunityIds }
      })
        .sort({ score: -1, createdAt: -1 })
        .populate('author', 'username profilePicture')
        .populate('community', 'name picture')
        .limit(relevantCount * 2) // Get more to account for duplicates
        .lean();
      
      allPosts = allPosts.concat(relevantPosts);
    }
    
    // Fetch discovery posts from non-joined communities
    const discoveryPosts = await Post.find({
      community: { $nin: joinedCommunityIds }
    })
      .sort({ score: -1, createdAt: -1 })
      .populate('author', 'username profilePicture')
      .populate('community', 'name picture')
      .limit(discoveryCount * 2)
      .lean();
    
    allPosts = allPosts.concat(discoveryPosts);
    
    // Shuffle and paginate
    const shuffled = allPosts
      .sort(() => Math.random() - 0.5)
      .slice((page - 1) * limit, page * limit);
    
    const result = {
      posts: shuffled,
      page,
      limit,
      hasMore: shuffled.length === limit
    };
    
    // Cache for 5 minutes
    await setCache(cacheKey, result, 300);
    
    return result;
  } catch (error) {
    console.error('Error fetching home feed:', error);
    throw error;
  }
};

// Get suggested feed (discovery from non-joined communities)
const getSuggestedFeed = async (userId, page = 1, limit = 20) => {
  const cacheKey = `suggested:${userId}:${page}:${limit}`;
  
  // Try cache first (10 min TTL)
  const cached = await getCache(cacheKey);
  if (cached) {
    return cached;
  }
  
  try {
    // Get user's joined communities
    const memberships = await Membership.find({ userId })
      .select('communityId')
      .lean();
    
    const joinedCommunityIds = memberships.map(m => m.communityId);
    
    // Fetch posts from communities user hasn't joined
    const posts = await Post.find({
      community: { $nin: joinedCommunityIds }
    })
      .sort({ score: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', 'username profilePicture')
      .populate('community', 'name picture')
      .lean();
    
    const result = {
      posts,
      page,
      limit,
      hasMore: posts.length === limit
    };
    
    // Cache for 10 minutes
    await setCache(cacheKey, result, 600);
    
    return result;
  } catch (error) {
    console.error('Error fetching suggested feed:', error);
    throw error;
  }
};

module.exports = {
  getTrendingPosts,
  getHomeFeed,
  getSuggestedFeed
};
