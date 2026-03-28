const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Conversation = require('../models/Conversation.model');

/**
 * @route GET /api/chats
 * @desc Get all conversations for current user
 * @access Private
 */
router.get('/', protect, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
      archivedBy: { $ne: req.user._id }
    })
      .sort({ lastMessageAt: -1 })
      .populate('participants', 'username fullName profilePicture isOnline lastSeen')
      .populate('lastMessage');

    res.status(200).json({
      status: 'success',
      data: { conversations }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * @route POST /api/chats
 * @desc Create new conversation
 * @access Private
 */
router.post('/', protect, async (req, res) => {
  try {
    const { participantId, isCouple } = req.body;

    // Check if conversation already exists
    const existing = await Conversation.findOne({
      participants: { $all: [req.user._id, participantId] }
    });

    if (existing) {
      return res.status(200).json({
        status: 'success',
        data: { conversation: existing }
      });
    }

    // Create new conversation
    const conversation = await Conversation.create({
      participants: [req.user._id, participantId],
      isCouple: isCouple || false
    });

    await conversation.populate('participants', 'username fullName profilePicture');

    res.status(201).json({
      status: 'success',
      data: { conversation }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;
