const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Placeholder routes
router.get('/', protect, (req, res) => {
  res.json({ status: 'success', message: 'Reels endpoint', data: [] });
});

module.exports = router;
