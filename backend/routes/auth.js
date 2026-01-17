const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { dbRun, dbGet } = require('../database');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password, phone, email, birthday } = req.body;

    // CHECK IF ALL FIELDS ARE FILLED
    if (!username || !password || !phone || !email || !birthday) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // CHECK IF USER ALREADY EXISTS
    const existingUser = await dbGet(
      `SELECT id FROM users WHERE username = ? OR email = ?`,
      [username, email]
    );

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // CALCULATE AGE FROM BIRTHDAY
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // CHECK IF THEY'RE 18+
    if (age < 18) {
      return res.status(400).json({ error: 'You must be 18 or older to register' });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // GET CURRENT DATE/TIME FOR SIGNUP
    const signupDate = new Date().toISOString();

    // INSERT USER WITH EMAIL, BIRTHDAY, AGE, AND SIGNUP DATE
    await dbRun(
      `INSERT INTO users (username, password, phone, email, birthday, age, gender, interested_in, signupDate)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [username, hashedPassword, phone, email, birthday, age, 'Male', 'Female', signupDate]
    );

    // CREATE EMPTY PROFILE
    const user = await dbGet(`SELECT id FROM users WHERE username = ?`, [username]);
    await dbRun(
      `INSERT INTO profiles (user_id) VALUES (?)`,
      [user.id]
    );

    // CREATE JWT TOKEN
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

    // UPDATE LAST LOGIN TIME
    const lastLogin = new Date().toISOString();
    await dbRun(
      `UPDATE users SET lastLogin = ? WHERE id = ?`,
      [lastLogin, user.id]
    );

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