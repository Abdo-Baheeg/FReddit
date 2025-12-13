const dotenv = require('dotenv');
const { sendEmail } = require('./utils/email');
const { generateEmailToken, verifyEmailToken } = require('./utils/tokens');

// Load environment variables
dotenv.config();

/**
 * Test script for email verification and password reset system
 * Run with: node test-email.js
 */

async function testEmailSystem() {
  console.log('🧪 Testing Email System...\n');

  // Test 1: Token Generation
  console.log('1️⃣ Testing Token Generation...');
  const testUserId = '507f1f77bcf86cd799439011';
  const token = generateEmailToken(testUserId, '1h');
  console.log('✅ Token generated:', token.substring(0, 50) + '...\n');

  // Test 2: Token Verification
  console.log('2️⃣ Testing Token Verification...');
  try {
    const decoded = verifyEmailToken(token);
    console.log('✅ Token verified successfully');
    console.log('   User ID:', decoded.userId);
    console.log('   Expires:', new Date(decoded.exp * 1000).toISOString(), '\n');
  } catch (error) {
    console.error('❌ Token verification failed:', error.message, '\n');
  }

  // Test 3: Send Verification Email
  console.log('3️⃣ Testing Email Sending...');
  const testEmail = process.argv[2] || 'test@example.com';
  
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not found in environment variables');
    console.log('   Please add RESEND_API_KEY to your .env file\n');
    return;
  }

  if (!process.env.EMAIL_SECRET) {
    console.error('❌ EMAIL_SECRET not found in environment variables');
    console.log('   Please add EMAIL_SECRET to your .env file\n');
    return;
  }

  if (!process.env.CLIENT_URL) {
    console.error('❌ CLIENT_URL not found in environment variables');
    console.log('   Please add CLIENT_URL to your .env file\n');
    return;
  }

  try {
    const verificationToken = generateEmailToken(testUserId, '30m');
    const verificationUrl = `${process.env.CLIENT_URL}/verify?token=${verificationToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Email Verification Test</h2>
        <p style="color: #666; font-size: 16px;">
          This is a test email from your FReddit backend.
        </p>
        <div style="margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #0079D3; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p style="color: #999; font-size: 14px;">
          Verification URL:<br>
          <a href="${verificationUrl}" style="color: #0079D3;">${verificationUrl}</a>
        </p>
      </div>
    `;

    console.log(`   Sending test email to: ${testEmail}`);
    const result = await sendEmail(testEmail, 'FReddit Email Test', html);
    console.log('✅ Email sent successfully!');
    console.log('   Email ID:', result.id || result);
    console.log('\n📧 Check your inbox at:', testEmail);
    console.log('🔗 Verification URL:', verificationUrl);
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    
    if (error.message.includes('API key')) {
      console.log('\n💡 Tips:');
      console.log('   - Verify your RESEND_API_KEY is correct');
      console.log('   - Get your API key from: https://resend.com/api-keys');
      console.log('   - Make sure the key has sending permissions');
    }
  }

  console.log('\n✨ Test complete!');
}

// Run tests
testEmailSystem().catch(error => {
  console.error('💥 Test failed:', error);
  process.exit(1);
});
