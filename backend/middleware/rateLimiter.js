// Simple in-memory rate limiter
// For production, use Redis-based solution like express-rate-limit with Redis store

const rateLimitStore = new Map();

/**
 * Clean up expired entries periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (data.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

/**
 * Rate limiter middleware factory
 * @param {number} maxRequests - Maximum requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @param {string} message - Error message when limit exceeded
 */
const createRateLimiter = (maxRequests, windowMs, message) => {
  return (req, res, next) => {
    // Use IP address or user ID as identifier
    const identifier = req.user?.id || req.ip;
    const key = `${req.path}:${identifier}`;
    const now = Date.now();

    let limitData = rateLimitStore.get(key);

    if (!limitData || limitData.resetTime < now) {
      // Initialize or reset the limit data
      limitData = {
        count: 1,
        resetTime: now + windowMs,
      };
      rateLimitStore.set(key, limitData);
      return next();
    }

    if (limitData.count < maxRequests) {
      limitData.count++;
      return next();
    }

    // Rate limit exceeded
    const retryAfter = Math.ceil((limitData.resetTime - now) / 1000);
    res.set('Retry-After', retryAfter);
    return res.status(429).json({
      message: message || 'Too many requests, please try again later.',
      retryAfter: retryAfter,
    });
  };
};

/**
 * Email verification rate limiter
 * Limit: 3 requests per hour per user/IP
 */
const emailVerificationLimiter = createRateLimiter(
  3,
  60 * 60 * 1000, // 1 hour
  'Too many verification email requests. Please try again later.'
);

/**
 * Password reset rate limiter
 * Limit: 5 requests per hour per user/IP
 */
const passwordResetLimiter = createRateLimiter(
  5,
  60 * 60 * 1000, // 1 hour
  'Too many password reset requests. Please try again later.'
);

/**
 * General auth rate limiter for login/register
 * Limit: 10 requests per 15 minutes per IP
 */
const authLimiter = createRateLimiter(
  10,
  15 * 60 * 1000, // 15 minutes
  'Too many authentication attempts. Please try again later.'
);

module.exports = {
  emailVerificationLimiter,
  passwordResetLimiter,
  authLimiter,
  createRateLimiter,
};
