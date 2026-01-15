const express = require('express');
const { verifyToken } = require('../middleware/auth');
const { dbGet, dbAll, dbRun } = require('../database');

const router = express.Router();

// Send message
router.post('/send', verifyToken, async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    await dbRun(
      `INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)`,
      [req.userId, receiverId, content]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get messages with a user
router.get('/:userId', verifyToken, async (req, res) => {
  try {
    const messages = await dbAll(
      `SELECT sender_id, receiver_id, content, created_at FROM messages
       WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
       ORDER BY created_at ASC`,
      [req.userId, req.params.userId, req.params.userId, req.userId]
    );

    res.json({ messages });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;