const express = require('express');
const { verifyToken } = require('../middleware/auth');
const { dbGet, dbAll, dbRun } = require('../database');

const router = express.Router();

// Like a user
router.post('/like', verifyToken, async (req, res) => {
  try {
    const { likedUserId } = req.body;

    // Record the like
    await dbRun(
      `INSERT OR IGNORE INTO matches (user_id, liked_user_id) VALUES (?, ?)`,
      [req.userId, likedUserId]
    );

    // Mark as seen
    await dbRun(
      `INSERT OR IGNORE INTO seen_users (user_id, seen_user_id, action) VALUES (?, ?, ?)`,
      [req.userId, likedUserId, 'like']
    );

    // Check if mutual match
    const mutualMatch = await dbGet(
      `SELECT id FROM matches WHERE user_id = ? AND liked_user_id = ?`,
      [likedUserId, req.userId]
    );

    res.json({ 
      success: true, 
      isMatch: !!mutualMatch 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Skip a user
router.post('/skip', verifyToken, async (req, res) => {
  try {
    const { skippedUserId } = req.body;

    await dbRun(
      `INSERT OR IGNORE INTO seen_users (user_id, seen_user_id, action) VALUES (?, ?, ?)`,
      [req.userId, skippedUserId, 'skip']
    );

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get matches
router.get('/list', verifyToken, async (req, res) => {
  try {
    const matches = await dbAll(
      `SELECT DISTINCT u.id, u.username, u.gender, u.bio, u.city, p.image1
       FROM matches m
       JOIN matches m2 ON m.user_id = m2.liked_user_id AND m.liked_user_id = m2.user_id
       JOIN users u ON (
         (m.user_id = ? AND u.id = m.liked_user_id) OR
         (m.liked_user_id = ? AND u.id = m.user_id)
       )
       LEFT JOIN profiles p ON u.id = p.user_id`,
      [req.userId, req.userId]
    );

    res.json({ matches });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get match details
router.get('/:matchId', verifyToken, async (req, res) => {
  try {
    const user = await dbGet(
      `SELECT id, username, gender, bio, city FROM users WHERE id = ?`,
      [req.params.matchId]
    );

    const profile = await dbGet(
      `SELECT image1, image2, image3, image4, image5 FROM profiles WHERE user_id = ?`,
      [req.params.matchId]
    );

    res.json({ user, profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Unmatch
router.post('/unmatch', verifyToken, async (req, res) => {
  try {
    const { matchId } = req.body;

    await dbRun(
      `DELETE FROM matches WHERE (user_id = ? AND liked_user_id = ?) OR (user_id = ? AND liked_user_id = ?)`,
      [req.userId, matchId, matchId, req.userId]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;