const { dbRun, dbAll } = require('./database');

const initializeDatabase = async () => {
  try {
    // Users table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT UNIQUE NOT NULL,
        gender TEXT,
        interested_in TEXT,
        bio TEXT DEFAULT '',
        city TEXT DEFAULT '',
        latitude REAL,
        longitude REAL,
        max_distance INTEGER DEFAULT 100,
        allow_anyone BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Profiles table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE NOT NULL,
        image1 TEXT,
        image2 TEXT,
        image3 TEXT,
        image4 TEXT,
        image5 TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `);

    // Matches table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS matches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        liked_user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, liked_user_id),
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(liked_user_id) REFERENCES users(id)
      )
    `);

    // Messages table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_id INTEGER NOT NULL,
        receiver_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(sender_id) REFERENCES users(id),
        FOREIGN KEY(receiver_id) REFERENCES users(id)
      )
    `);

    // Seen users table (to track who user has swiped on)
    await dbRun(`
      CREATE TABLE IF NOT EXISTS seen_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        seen_user_id INTEGER NOT NULL,
        action TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, seen_user_id),
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(seen_user_id) REFERENCES users(id)
      )
    `);

    console.log('Database initialized successfully');
    
    // Check if seed data exists
    const existingUsers = await dbAll(`SELECT COUNT(*) as count FROM users`);
    if (existingUsers[0].count === 0) {
      await seedDatabase();
    }
  } catch (err) {
    console.error('Database initialization error:', err);
  }
};

const seedDatabase = async () => {
  const bcrypt = require('bcryptjs');
  
  const fakeProfiles = [
    { username: 'sarah_23', gender: 'Female', name: 'Sarah', bio: 'Love hiking and coffee ☕' },
    { username: 'emma_25', gender: 'Female', name: 'Emma', bio: 'Yoga enthusiast & dog lover 🐕' },
    { username: 'jessica_22', gender: 'Female', name: 'Jessica', bio: 'Travel addict ✈️' },
    { username: 'lisa_26', gender: 'Female', name: 'Lisa', bio: 'Artist and book nerd 📚' },
    { username: 'sophia_24', gender: 'Female', name: 'Sophia', bio: 'Foodie exploring the world' },
    { username: 'james_26', gender: 'Male', name: 'James', bio: 'Software engineer who loves gaming 🎮' },
    { username: 'michael_28', gender: 'Male', name: 'Michael', bio: 'Gym rat and photography lover 📸' },
    { username: 'david_25', gender: 'Male', name: 'David', bio: 'Musician and coffee addict' },
    { username: 'chris_27', gender: 'Male', name: 'Chris', bio: 'Startup founder interested in tech' },
    { username: 'alex_24', gender: 'Male', name: 'Alex', bio: 'Adventure seeker & rock climber🧗' }
  ];

  const hashedPassword = await bcrypt.hash('password123', 10);

  for (let i = 0; i < fakeProfiles.length; i++) {
    const profile = fakeProfiles[i];
    try {
      await dbRun(
        `INSERT INTO users (username, password, phone, gender, interested_in, bio, city, max_distance, allow_anyone)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          profile.username,
          hashedPassword,
          `555000${i}`,
          profile.gender,
          profile.gender === 'Male' ? 'Female' : 'Male',
          profile.bio,
          'New York',
          100,
          0
        ]
      );
    } catch (err) {
      console.log(`User ${profile.username} already exists`);
    }
  }

  console.log('Database seeded with fake profiles');
};

module.exports = { initializeDatabase };