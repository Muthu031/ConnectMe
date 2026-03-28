const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User.model');
const { uploadSingle } = require('../middleware/upload');
const { uploadImage } = require('../config/cloudinary');

/**
 * @route GET /api/users/:id
 * @desc Get user profile
 * @access Public
 */
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -refreshToken -otp -deviceTokens');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * @route PUT /api/users/:id
 * @desc Update user profile
 * @access Private
 */
router.put('/:id', protect, uploadSingle, async (req, res) => {
  try {
    // Check if user is updating their own profile
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this profile'
      });
    }

    const updates = { ...req.body };
    delete updates.password; // Prevent password update through this route
    delete updates.username; // Prevent username change

    // Handle file upload
    if (req.file) {
      const result = await uploadImage(req.file.path, 'connectme/profiles');
      updates.profilePicture = result.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * @route POST /api/users/:id/follow
 * @desc Follow user
 * @access Private
 */
router.post('/:id/follow', protect, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Check if already following
    if (currentUser.following.includes(userToFollow._id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Already following this user'
      });
    }

    // Add to following/followers
    currentUser.following.push(userToFollow._id);
    currentUser.followingCount += 1;
    userToFollow.followers.push(currentUser._id);
    userToFollow.followersCount += 1;

    await currentUser.save();
    await userToFollow.save();

    // TODO: Create notification

    res.status(200).json({
      status: 'success',
      message: 'User followed successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * @route DELETE /api/users/:id/unfollow
 * @desc Unfollow user
 * @access Private
 */
router.delete('/:id/unfollow', protect, async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToUnfollow) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Remove from following/followers
    currentUser.following = currentUser.following.filter(
      id => id.toString() !== userToUnfollow._id.toString()
    );
    currentUser.followingCount = Math.max(0, currentUser.followingCount - 1);
    
    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => id.toString() !== currentUser._id.toString()
    );
    userToUnfollow.followersCount = Math.max(0, userToUnfollow.followersCount - 1);

    await currentUser.save();
    await userToUnfollow.save();

    res.status(200).json({
      status: 'success',
      message: 'User unfollowed successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * @route GET /api/users/:id/followers
 * @desc Get user followers
 * @access Public
 */
router.get('/:id/followers', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('followers', 'username fullName profilePicture isVerified');

    res.status(200).json({
      status: 'success',
      data: { followers: user.followers }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * @route GET /api/users/:id/following
 * @desc Get user following
 * @access Public
 */
router.get('/:id/following', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('following', 'username fullName profilePicture isVerified');

    res.status(200).json({
      status: 'success',
      data: { following: user.following }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;
