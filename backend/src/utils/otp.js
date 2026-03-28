const User = require('../models/User.model');
const crypto = require('crypto');

/**
 * Generate random OTP code
 */
const generateOTPCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP to user
 * @param {string} userId - User ID
 * @param {string} contact - Email or phone number
 * @param {string} type - 'email' or 'phone'
 */
exports.sendOTP = async (userId, contact, type = 'email') => {
  try {
    const otpCode = generateOTPCode();
    const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES) || 10;
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    // Save OTP to user document
    await User.findByIdAndUpdate(userId, {
      otp: {
        code: otpCode,
        expiresAt
      }
    });

    if (type === 'email') {
      // Send email OTP (implement with SendGrid or similar)
      await sendEmailOTP(contact, otpCode);
    } else {
      // Send SMS OTP (implement with Twilio or similar)
      await sendSMSOTP(contact, otpCode);
    }

    console.log(`OTP sent to ${contact}: ${otpCode}`); // For development
    return true;
  } catch (error) {
    console.error('Send OTP error:', error);
    throw error;
  }
};

/**
 * Verify OTP code
 * @param {string} userId - User ID
 * @param {string} code - OTP code
 */
exports.verifyOTP = async (userId, code) => {
  try {
    const user = await User.findById(userId);

    if (!user || !user.otp) {
      return false;
    }

    // Check if OTP expired
    if (new Date() > user.otp.expiresAt) {
      return false;
    }

    // Check if OTP matches
    if (user.otp.code !== code) {
      return false;
    }

    // Clear OTP after successful verification
    user.otp = undefined;
    await user.save();

    return true;
  } catch (error) {
    console.error('Verify OTP error:', error);
    return false;
  }
};

/**
 * Send OTP via email
 * @param {string} email - Recipient email
 * @param {string} code - OTP code
 */
const sendEmailOTP = async (email, code) => {
  // TODO: Implement with SendGrid or your email service
  // Example:
  // const sgMail = require('@sendgrid/mail');
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  // const msg = {
  //   to: email,
  //   from: process.env.FROM_EMAIL,
  //   subject: 'Your ConnectMe Verification Code',
  //   text: `Your verification code is: ${code}`,
  //   html: `<strong>Your verification code is: ${code}</strong>`
  // };
  // await sgMail.send(msg);
  
  console.log(`Email OTP sent to ${email}: ${code}`);
};

/**
 * Send OTP via SMS
 * @param {string} phone - Recipient phone number
 * @param {string} code - OTP code
 */
const sendSMSOTP = async (phone, code) => {
  // TODO: Implement with Twilio or your SMS service
  // Example:
  // const twilio = require('twilio');
  // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  // await client.messages.create({
  //   body: `Your ConnectMe verification code is: ${code}`,
  //   from: process.env.TWILIO_PHONE_NUMBER,
  //   to: phone
  // });
  
  console.log(`SMS OTP sent to ${phone}: ${code}`);
};
