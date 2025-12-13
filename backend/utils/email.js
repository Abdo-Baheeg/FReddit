const { Resend } = require('resend');

// Initialize Resend lazily to ensure environment variables are loaded
let resend = null;

function getResendClient() {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not defined in environment variables');
    }
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

/**
 * Send an email using Resend
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML content of the email
 * @returns {Promise<Object>} - Resend API response
 */
async function sendEmail(to, subject, html) {
  try {
    const client = getResendClient();
    const { data, error } = await client.emails.send({
      from: 'onboarding@resend.dev', // Default Resend sender (works without custom domain)
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('❌ Resend error:', error);
      throw new Error(error.message || 'Failed to send email');
    }

    console.log('✅ Email sent successfully:', data);
    return data;
  } catch (err) {
    console.error('❌ Email sending failed:', err);
    throw err;
  }
}

module.exports = { getResendClient, sendEmail };
