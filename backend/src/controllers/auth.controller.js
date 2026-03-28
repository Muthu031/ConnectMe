const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { sendOTP, verifyOTP } = require('../utils/otp');

/**
 * Generate JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

/**
 * Generate refresh token
 */
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
  });
};

/**
 * @desc Register new user
 * @route POST /api/auth/register
 * @access Public
 */
exports.register = async (req, res) => {
  try {
    const { username, email, phone, password, fullName } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Username and password are required'
      });
    }

    if (!email && !phone) {
      return res.status(400).json({
        status: 'error',
        message: 'Email or phone number is required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { username },
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : [])
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists with this username, email, or phone'
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      phone,
      password,
      fullName
    });

    // Send OTP if email or phone provided
    if (email || phone) {
      await sendOTP(user._id, email || phone, email ? 'email' : 'phone');
    }

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully. Please verify your OTP.',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          fullName: user.fullName,
          profilePicture: user.profilePicture
        },
        token,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Registration failed'
    });
  }
};

/**
 * @desc Login user
 * @route POST /api/auth/login
 * @access Public
 */
exports.login = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    // Validation
    if (!password) {
      return res.status(400).json({
        status: 'error',
        message: 'Password is required'
      });
    }

    if (!username && !email && !phone) {
      return res.status(400).json({
        status: 'error',
        message: 'Username, email, or phone is required'
      });
    }

    // Find user
    const user = await User.findOne({
      $or: [
        ...(username ? [{ username }] : []),
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : [])
      ]
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Update online status
    user.isOnline = true;
    user.lastSeen = new Date();
    await user.save();

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          fullName: user.fullName,
          profilePicture: user.profilePicture,
          bio: user.bio,
          isVerified: user.isVerified,
          followersCount: user.followersCount,
          followingCount: user.followingCount,
          postsCount: user.postsCount
        },
        token,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Login failed'
    });
  }
};

/**
 * @desc Verify OTP
 * @route POST /api/auth/verify-otp
 * @access Private
 */
exports.verifyOTP = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user._id;

    if (!code) {
      return res.status(400).json({
        status: 'error',
        message: 'OTP code is required'
      });
    }

    const isValid = await verifyOTP(userId, code);

    if (!isValid) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired OTP'
      });
    }

    // Update verification status
    const user = await User.findById(userId);
    if (user.email) user.isEmailVerified = true;
    if (user.phone) user.isPhoneVerified = true;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'OTP verified successfully',
      data: { verified: true }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      status: 'error',
      message: 'OTP verification failed'
    });
  }
};

/**
 * @desc Get current user
 * @route GET /api/auth/me
 * @access Private
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get user'
    });
  }
};

/**
 * @desc Refresh access token
 * @route POST /api/auth/refresh-token
 * @access Public
 */
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        status: 'error',
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const newToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Save new refresh token
    user.refreshToken = newRefreshToken;
    await user.save();

    res.status(200).json({
      status: 'success',
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({
      status: 'error',
      message: 'Invalid or expired refresh token'
    });
  }
};

/**
 * @desc Logout user
 * @route POST /api/auth/logout
 * @access Private
 */
exports.logout = async (req, res) => {
  try {
    // Update user status
    await User.findByIdAndUpdate(req.user._id, {
      isOnline: false,
      lastSeen: new Date(),
      refreshToken: null
    });

    res.status(200).json({
      status: 'success',
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Logout failed'
    });
  }
};
