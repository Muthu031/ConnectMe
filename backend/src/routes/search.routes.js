const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/auth');
const User = require('../models/User.model');
const Post = require('../models/Post.model');

/**
 * @route GET /api/search/users
 * @desc Search for users
 * @access Public
 */
router.get('/users', optionalAuth, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query is required'
      });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { fullName: { $regex: q, $options: 'i' } }
      ]
    })
      .select('username fullName profilePicture bio isVerified followersCount')
      .limit(20);

    res.status(200).json({
      status: 'success',
      data: { users }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * @route GET /api/search/posts
 * @desc Search for posts by hashtags
 * @access Public
 */
router.get('/posts', optionalAuth, async (req, res) => {
  try {
    const { q } = req.query;

    const posts = await Post.find({
      hashtags: { $regex: q, $options: 'i' },
      visibility: 'public'
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('user', 'username profilePicture isVerified');

    res.status(200).json({
      status: 'success',
      data: { posts }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;
