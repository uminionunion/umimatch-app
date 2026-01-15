const express = require('express');
const { verifyToken } = require('../middleware/auth');
const { dbGet, dbAll, dbRun } = require('../database');

const router = express.Router();

router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await dbGet(
      `SELECT id, username, gender, interested_in, bio, city, max_distance, allow_anyone 
       FROM users WHERE id = ?`,
      [req.userId]
    );
    
    const profile = await dbGet(
      `SELECT * FROM profiles WHERE user_id = ?`,
      [req.userId]
    );

    res.json({ user, profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { gender, interested_in, bio, city, max_distance, allow_anyone } = req.body;

    await dbRun(
      `UPDATE users SET gender = ?, interested_in = ?, bio = ?, city = ?, max_distance = ?, allow_anyone = ?
       WHERE id = ?`,
      [gender, interested_in, bio, city, max_distance, allow_anyone ? 1 : 0, req.userId]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/profile-images', verifyToken, async (req, res) => {
  try {
    const { image1, image2, image3, image4, image5 } = req.body;

    // Check if profile exists
    const existingProfile = await dbGet(
      `SELECT id FROM profiles WHERE user_id = ?`,
      [req.userId]
    );

    if (existingProfile) {
      await dbRun(
        `UPDATE profiles SET image1 = ?, image2 = ?, image3 = ?, image4 = ?, image5 = ?
         WHERE user_id = ?`,
        [image1, image2, image3, image4, image5, req.userId]
      );
    } else {
      await dbRun(
        `INSERT INTO profiles (user_id, image1, image2, image3, image4, image5)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [req.userId, image1, image2, image3, image4, image5]
      );
    }

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/discover', verifyToken, async (req, res) => {
  try {
    const currentUser = await dbGet(
      `SELECT id, gender, interested_in, max_distance, allow_anyone FROM users WHERE id = ?`,
      [req.userId]
    );

    // Get users the current user has already seen
    const seenUsers = await dbAll(
      `SELECT seen_user_id FROM seen_users WHERE user_id = ?`,
      [req.userId]
    );

    const seenIds = seenUsers.map(s => s.seen_user_id);
    const excludeIds = [req.userId, ...seenIds].join(',');

    // Build gender filter
    let genderFilter = '';
    if (currentUser.interested_in && currentUser.interested_in !== 'Everyone') {
      genderFilter = `AND u.gender = '${currentUser.interested_in}'`;
    }

    const query = `
      SELECT u.id, u.username, u.gender, u.bio, u.city, p.image1, p.image2, p.image3, p.image4, p.image5
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id NOT IN (${excludeIds})
      AND u.id != ?
      ${genderFilter}
      LIMIT 20
    `;

    const users = await dbAll(query, [req.userId]);

    res.json({ users });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;