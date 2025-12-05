const redis = require('redis');

let redisClient = null;
let isRedisConnected = false;

const connectRedis = async () => {
  try {
    // Railway Redis uses REDIS_PRIVATE_URL or REDIS_URL
    const redisUrl = process.env.REDIS_PRIVATE_URL || process.env.REDIS_URL ;
    
    console.log('Attempting to connect to Redis...');
    console.log('Redis URL configured:', redisUrl.replace(/:\/\/.*@/, '://***@')); // Hide credentials in logs
    
    redisClient = redis.createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 5) {
            console.log('Redis: Too many reconnection attempts, stopping...');
            return new Error('Too many retries');
          }
          return retries * 1000; // Exponential backoff
        },
        connectTimeout: 10000 // 10 seconds timeout
      }
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err.message);
      isRedisConnected = false;
    });

    redisClient.on('connect', () => {
      console.log('Redis: Connecting...');
    });

    redisClient.on('ready', () => {
      console.log('Redis: Connected and ready');
      isRedisConnected = true;
    });

    redisClient.on('end', () => {
      console.log('Redis: Connection closed');
      isRedisConnected = false;
    });

    await redisClient.connect();
  } catch (error) {
    console.error('Redis connection failed:', error.message);
    console.log('Application will continue without Redis caching');
    isRedisConnected = false;
  }
};

// Get cached data
const getCache = async (key) => {
  if (!isRedisConnected || !redisClient) {
    return null;
  }
  
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Redis GET error:', error.message);
    return null;
  }
};

// Set cache with TTL (in seconds)
const setCache = async (key, value, ttl = 300) => {
  if (!isRedisConnected || !redisClient) {
    return false;
  }
  
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Redis SET error:', error.message);
    return false;
  }
};

// Delete cache
const delCache = async (key) => {
  if (!isRedisConnected || !redisClient) {
    return false;
  }
  
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error('Redis DEL error:', error.message);
    return false;
  }
};

// Clear cache by pattern
const clearPattern = async (pattern) => {
  if (!isRedisConnected || !redisClient) {
    return false;
  }
  
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    return true;
  } catch (error) {
    console.error('Redis CLEAR PATTERN error:', error.message);
    return false;
  }
};

module.exports = {
  connectRedis,
  getCache,
  setCache,
  delCache,
  clearPattern
};
