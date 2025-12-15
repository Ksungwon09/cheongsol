const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();
const saltRounds = 10;

// Signup Route
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  console.log('[Signup] Received data for username:', username);

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required.' });
  }

  try {
    // EMERGENCY FIX: Check for and create the column right before insert.
    try {
        const dbName = process.env.DB_NAME || 'cheongsol_db';
        const checkColumnSql = `SELECT COUNT(*) AS count FROM information_schema.columns WHERE table_schema = ? AND table_name = 'users' AND column_name = 'username'`;
        const [rows] = await pool.query(checkColumnSql, [dbName]);
        if (rows[0].count === 0) {
            console.log("EMERGENCY FIX: 'username' column not found. Altering table...");
            const alterTableSql = `ALTER TABLE users ADD COLUMN username VARCHAR(255) NOT NULL UNIQUE AFTER id`;
            await pool.query(alterTableSql);
            console.log("EMERGENCY FIX: Table 'users' altered successfully.");
            // Try to drop unique index on email, but don't fail if it doesn't exist.
            try { await pool.query(`ALTER TABLE users DROP INDEX email`); } catch (e) { /* ignore */ }
        }
    } catch (alterError) {
         console.error("EMERGENCY FIX: Failed to alter table:", alterError);
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('[Signup] Hashed password created for user:', username);

    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    const [result] = await pool.query(sql, [username, email, hashedPassword]);
    
    console.log('[Signup] User inserted successfully with ID:', result.insertId);
    res.status(201).json({ message: 'User created successfully', userId: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Username or email already exists.' });
    }
    console.error('[Signup] Error:', error);
    res.status(500).json({ message: 'Error creating user.' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('[Login] Attempting login for username:', username);

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const sql = 'SELECT * FROM users WHERE username = ?';
    const [rows] = await pool.query(sql, [username]);

    if (rows.length === 0) {
      console.log('[Login] User not found in database.');
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log('[Login] Password does not match.');
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    console.log('[Login] Login successful. Generating token.');
    const tokenPayload = {
      userId: user.id,
      username: user.username,
      email: user.email, // Add email to the payload
      isAdmin: user.isAdmin
    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: tokenPayload });

  } catch (error) {
    console.error('[Login] Error:', error);
    res.status(500).json({ message: 'Error logging in.' });
  }
});

// Delete Account Route
router.delete('/delete-account', verifyToken, async (req, res) => {
  const userId = req.user.userId;
  console.log(`[Delete Account] Attempting to delete account for userId: ${userId}`);

  try {
    const sql = 'DELETE FROM users WHERE id = ?';
    const [result] = await pool.query(sql, [userId]);

    if (result.affectedRows === 0) {
      console.log(`[Delete Account] No account found for userId: ${userId}`);
      return res.status(404).json({ message: 'Account not found.' });
    }

    console.log(`[Delete Account] Account for userId: ${userId} deleted successfully.`);
    res.status(200).json({ message: 'Account deleted successfully.' });
  } catch (error) {
    console.error('[Delete Account] Error:', error);
    res.status(500).json({ message: 'Error deleting account.' });
  }
});

module.exports = router;