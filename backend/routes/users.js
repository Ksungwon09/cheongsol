const express = require('express');
const { pool } = require('../db');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// All routes in this file are protected and require admin privileges
router.use(verifyToken, isAdmin);

// GET /api/users - Fetch all users
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, username, email, isAdmin, created_at, last_login FROM users ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error('[Admin/Users] Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users.' });
  }
});

// DELETE /api/users/:id - Delete a user
router.delete('/:id', async (req, res) => {
  const userId = req.params.id;
  // Prevent admin from deleting themselves
  if (req.user.userId == userId) {
    return res.status(400).json({ message: 'You cannot delete your own account.' });
  }
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [userId]);
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error(`[Admin/Users] Error deleting user ${userId}:`, error);
    res.status(500).json({ message: 'Error deleting user.' });
  }
});

// PUT /api/users/:id/make-admin - Grant admin privileges
router.put('/:id/make-admin', async (req, res) => {
  const userId = req.params.id;
  try {
    await pool.query('UPDATE users SET isAdmin = 1 WHERE id = ?', [userId]);
    res.status(200).json({ message: 'Admin privileges granted successfully.' });
  } catch (error) {
    console.error(`[Admin/Users] Error granting admin to user ${userId}:`, error);
    res.status(500).json({ message: 'Error granting admin privileges.' });
  }
});

// GET /api/users/stats - Get user statistics
router.get('/stats', async (req, res) => {
  try {
    // Today's new sign-ups
    const [todayResult] = await pool.query("SELECT COUNT(*) as count FROM users WHERE DATE(created_at) = CURDATE()");
    const today_connections = todayResult[0].count;

    // Active users (logged in within the last hour)
    const [activeResult] = await pool.query("SELECT COUNT(*) as count FROM users WHERE last_login > DATE_SUB(NOW(), INTERVAL 1 HOUR)");
    const current_connections = activeResult[0].count;

    res.json({
      today_connections,
      current_connections
    });
  } catch (error) {
    console.error('[Admin/Users] Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching user statistics.' });
  }
});

module.exports = router;
