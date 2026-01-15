const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { dbRun, dbGet } = require('../database');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password, phone } = req.body;

    if (!username || !password || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await dbRun(
      `INSERT INTO users (username, password, phone, gender, interested_in)
       VALUES (?, ?, ?, ?, ?)`,
      [username, hashedPassword, phone, 'Male', 'Female']
    );

    // Create empty profile
    const user = await dbGet(`SELECT id FROM users WHERE username = ?`, [username]);
    await dbRun(
      `INSERT INTO profiles (user_id) VALUES (?)`,
      [user.id]
    );

    const token = jwt.sign({ userId: user.id }, 'secret_key', { expiresIn: '7d' });

    res.json({ 
      success: true, 
      token, 
      user: { id: user.id, username } 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Missing credentials' });
    }

    const user = await dbGet(`SELECT * FROM users WHERE username = ?`, [username]);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, 'secret_key', { expiresIn: '7d' });

    res.json({ 
      success: true, 
      token, 
      user: { 
        id: user.id, 
        username: user.username,
        gender: user.gender,
        bio: user.bio,
        city: user.city
      } 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;