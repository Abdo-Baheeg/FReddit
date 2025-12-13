const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token for email verification
 * @param {string} userId - User ID to encode in the token
 * @param {string} expires - Token expiration time (default: 15m)
 * @returns {string} - Signed JWT token
 */
function generateEmailToken(userId, expires = '15m') {
  if (!process.env.EMAIL_SECRET) {
    throw new Error('EMAIL_SECRET is not defined in environment variables');
  }

  return jwt.sign(
    { userId },
    process.env.EMAIL_SECRET,
    { expiresIn: expires }
  );
}

/**
 * Verify and decode an email token
 * @param {string} token - JWT token to verify
 * @returns {Object} - Decoded token payload
 * @throws {Error} - If token is invalid or expired
 */
function verifyEmailToken(token) {
  if (!process.env.EMAIL_SECRET) {
    throw new Error('EMAIL_SECRET is not defined in environment variables');
  }

  try {
    return jwt.verify(token, process.env.EMAIL_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw error;
  }
}

module.exports = { generateEmailToken, verifyEmailToken };
