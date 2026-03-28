const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Post = require('../models/Post.model');
const User = require('../models/User.model');
const { uploadMultiple } = require('../middleware/upload');
const { uploadImage, uploadVideo } = require('../config/cloudinary');

/**
 * @route GET /api/posts
 * @desc Get feed posts (paginated)
 * @access Private
 */
router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Get posts from following users and own posts
    const following = req.user.following;
    following.push(req.user._id);

    const posts = await Post.find({
      user: { $in: following },
      isArchived: false
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'username fullName profilePicture isVerified')
      .populate('comments.user', 'username profilePicture');

    const total = await Post.countDocuments({
      user: { $in: following },
      isArchived: false
    });

    res.status(200).json({
      status: 'success',
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * @route POST /api/posts
 * @desc Create new post
 * @access Private
 */
router.post('/', protect, uploadMultiple, async (req, res) => {
  try {
    const { caption, visibility, location, hashtags } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'At least one media file is required'
      });
    }

    // Upload media files
    const media = [];
    for (const file of req.files) {
      let result;
      if (file.mimetype.startsWith('image')) {
        result = await uploadImage(file.path, 'connectme/posts');
        media.push({
          type: 'image',
          url: result.secure_url,
          publicId: result.public_id
        });
      } else if (file.mimetype.startsWith('video')) {
        result = await uploadVideo(file.path, 'connectme/posts');
        media.push({
          type: 'video',
          url: result.secure_url,
          thumbnail: result.thumbnail_url,
          publicId: result.public_id,
          duration: result.duration
        });
      }
    }

    // Create post
    const post = await Post.create({
      user: req.user._id,
      caption,
      media,
      visibility: visibility || 'public',
      location: location ? JSON.parse(location) : undefined,
      hashtags: hashtags ? JSON.parse(hashtags) : []
    });

    // Update user's post count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { postsCount: 1 }
    });

    await post.populate('user', 'username fullName profilePicture isVerified');

    res.status(201).json({
      status: 'success',
      message: 'Post created successfully',
      data: { post }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * @route POST /api/posts/:id/like
 * @desc Like a post
 * @access Private
 */
router.post('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    // Check if already liked
    if (post.likes.includes(req.user._id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Post already liked'
      });
    }

    post.likes.push(req.user._id);
    await post.save();

    // TODO: Create notification

    res.status(200).json({
      status: 'success',
      message: 'Post liked successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * @route DELETE /api/posts/:id/unlike
 * @desc Unlike a post
 * @access Private
 */
router.delete('/:id/unlike', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    await post.save();

    res.status(200).json({
      status: 'success',
      message: 'Post unliked successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * @route POST /api/posts/:id/comment
 * @desc Add comment to post
 * @access Private
 */
router.post('/:id/comment', protect, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        status: 'error',
        message: 'Comment text is required'
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    post.comments.push({
      user: req.user._id,
      text
    });

    await post.save();
    await post.populate('comments.user', 'username profilePicture');

    // TODO: Create notification

    res.status(201).json({
      status: 'success',
      message: 'Comment added successfully',
      data: { comment: post.comments[post.comments.length - 1] }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;
