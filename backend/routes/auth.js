const express = require('express');
const { sendEmail } = require('../utils/email');
const { generateEmailToken, verifyEmailToken } = require('../utils/tokens');

const router = express.Router();

/**
 * POST /auth/send-verification
 * Send email verification link
 */
router.post('/send-verification', async (req, res) => {
  try {
    const { email, userId } = req.body;

    // Validation
    if (!email || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Email and userId are required'
      });
    }

    // Generate token valid for 30 minutes
    const token = generateEmailToken(userId, '30m');

    // Create verification URL
    const verificationUrl = `${process.env.CLIENT_URL}/verify?token=${token}`;

    // Email HTML content
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Email Verification</h2>
        <p style="color: #666; font-size: 16px;">
          Thank you for registering! Please verify your email address by clicking the button below.
        </p>
        <div style="margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #0079D3; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p style="color: #999; font-size: 14px;">
          Or copy and paste this link into your browser:<br>
          <a href="${verificationUrl}" style="color: #0079D3;">${verificationUrl}</a>
        </p>
        <p style="color: #999; font-size: 14px;">
          This link will expire in 30 minutes.
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 40px;">
          If you didn't request this, please ignore this email.
        </p>
      </div>
    `;

    // Send email
    await sendEmail(email, 'Verify Your Email Address', html);

    // TODO: Update user verification status in database
    // Example: await User.findByIdAndUpdate(userId, { emailVerificationSent: true });

    res.json({
      success: true,
      message: 'Verification email sent successfully'
    });
  } catch (error) {
    console.error('Send verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send verification email',
      error: error.message
    });
  }
});

/**
 * POST /auth/send-reset
 * Send password reset link
 */
router.post('/send-reset', async (req, res) => {
  try {
    const { email, userId } = req.body;

    // Validation
    if (!email || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Email and userId are required'
      });
    }

    // TODO: Verify user exists in database
    // Example: const user = await User.findById(userId);
    // if (!user || user.email !== email) {
    //   return res.status(404).json({ success: false, message: 'User not found' });
    // }

    // Generate token valid for 15 minutes
    const token = generateEmailToken(userId, '15m');

    // Create password reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    // Email HTML content
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset</h2>
        <p style="color: #666; font-size: 16px;">
          You requested to reset your password. Click the button below to create a new password.
        </p>
        <div style="margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #FF4500; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #999; font-size: 14px;">
          Or copy and paste this link into your browser:<br>
          <a href="${resetUrl}" style="color: #FF4500;">${resetUrl}</a>
        </p>
        <p style="color: #999; font-size: 14px;">
          This link will expire in 15 minutes.
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 40px;">
          If you didn't request this, please ignore this email and your password will remain unchanged.
        </p>
      </div>
    `;

    // Send email
    await sendEmail(email, 'Reset Your Password', html);

    // TODO: Store password reset token hash in database for additional security
    // Example: await User.findByIdAndUpdate(userId, { 
    //   passwordResetToken: hashToken(token),
    //   passwordResetExpires: Date.now() + 15 * 60 * 1000 
    // });

    res.json({
      success: true,
      message: 'Password reset email sent successfully'
    });
  } catch (error) {
    console.error('Send reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send password reset email',
      error: error.message
    });
  }
});

/**
 * GET /auth/verify-email
 * Verify email token
 */
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }

    // Verify and decode token
    const decoded = verifyEmailToken(token);

    // TODO: Update user verification status in database
    // Example: await User.findByIdAndUpdate(decoded.userId, { 
    //   isEmailVerified: true,
    //   emailVerifiedAt: new Date()
    // });

    res.json({
      success: true,
      userId: decoded.userId,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Verify email error:', error);
    
    // Handle specific token errors
    if (error.message === 'Token has expired') {
      return res.status(401).json({
        success: false,
        message: 'Verification link has expired. Please request a new one.'
      });
    }
    
    if (error.message === 'Invalid token') {
      return res.status(401).json({
        success: false,
        message: 'Invalid verification link.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Email verification failed',
      error: error.message
    });
  }
});

/**
 * POST /auth/reset-password
 * Reset password with token
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Validation
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Verify token
    const decoded = verifyEmailToken(token);

    // TODO: Update user password in database
    // Example: 
    // const user = await User.findById(decoded.userId);
    // if (!user) {
    //   return res.status(404).json({ success: false, message: 'User not found' });
    // }
    // 
    // // Verify token hash matches (if storing token hash)
    // if (!user.passwordResetToken || user.passwordResetExpires < Date.now()) {
    //   return res.status(401).json({ success: false, message: 'Invalid or expired reset token' });
    // }
    //
    // // Hash new password
    // const hashedPassword = await bcrypt.hash(newPassword, 10);
    //
    // // Update password and clear reset token
    // await User.findByIdAndUpdate(decoded.userId, {
    //   password: hashedPassword,
    //   passwordResetToken: null,
    //   passwordResetExpires: null,
    //   passwordChangedAt: new Date()
    // });

    res.json({
      success: true,
      userId: decoded.userId,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    
    // Handle specific token errors
    if (error.message === 'Token has expired') {
      return res.status(401).json({
        success: false,
        message: 'Reset link has expired. Please request a new one.'
      });
    }
    
    if (error.message === 'Invalid token') {
      return res.status(401).json({
        success: false,
        message: 'Invalid reset link.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Password reset failed',
      error: error.message
    });
  }
});

module.exports = router;
