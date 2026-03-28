const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Story = require('../models/Story.model');

/**
 * @route GET /api/stories
 * @desc Get active stories from following users
 * @access Private
 */
router.get('/', protect, async (req, res) => {
  try {
    const following = [...req.user.following, req.user._id];

    const stories = await Story.find({
      user: { $in: following },
      isActive: true,
      expiresAt: { $gt: new Date() }
    })
      .sort({ createdAt: -1 })
      .populate('user', 'username fullName profilePicture')
      .populate('views.user', 'username profilePicture');

    // Group stories by user
    const groupedStories = stories.reduce((acc, story) => {
      const userId = story.user._id.toString();
      if (!acc[userId]) {
        acc[userId] = {
          user: story.user,
          stories: []
        };
      }
      acc[userId].stories.push(story);
      return acc;
    }, {});

    res.status(200).json({
      status: 'success',
      data: { stories: Object.values(groupedStories) }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * @route POST /api/stories
 * @desc Create new story
 * @access Private
 */
router.post('/', protect, async (req, res) => {
  try {
    // Implementation similar to posts
    res.status(501).json({
      status: 'error',
      message: 'Not implemented yet'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;
