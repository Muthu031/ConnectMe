const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Message = require('../models/Message.model');

/**
 * @route GET /api/messages/:conversationId
 * @desc Get messages for a conversation
 * @access Private
 */
router.get('/:conversationId', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await Message.find({
      conversation: req.params.conversationId,
      deletedFor: { $ne: req.user._id }
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('sender', 'username profilePicture');

    res.status(200).json({
      status: 'success',
      data: { messages: messages.reverse() }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;
