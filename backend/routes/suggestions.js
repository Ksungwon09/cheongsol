const express = require('express');
const { pool } = require('../db');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// GET all suggestions (admin only)
router.get('/', [verifyToken, isAdmin], async (req, res) => {
  try {
    const sql = 'SELECT * FROM suggestions ORDER BY createdAt DESC';
    const [rows] = await pool.query(sql);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching suggestions.' });
  }
});

// POST a new suggestion (public, but requires user to be logged in)
// We add an 'author' field to know who sent it.
router.post('/', [verifyToken], async (req, res) => {
  const { title, content } = req.body;
  const author = req.user.email; // Get user email from verified token

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }

  try {
    const sql = 'INSERT INTO suggestions (title, content, author) VALUES (?, ?, ?)';
    const [result] = await pool.query(sql, [title, content, author]);
    res.status(201).json({ message: 'Suggestion submitted', suggestionId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting suggestion.' });
  }
});

// PATCH to update suggestion status (admin only)
router.patch('/:id/status', [verifyToken, isAdmin], async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['received', 'in_progress', 'completed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status provided.' });
  }

  try {
    const sql = 'UPDATE suggestions SET status = ? WHERE id = ?';
    const [result] = await pool.query(sql, [status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Suggestion not found.' });
    }

    res.json({ message: `Suggestion status updated to ${status}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating suggestion status.' });
  }
});

// GET suggestions by the logged-in user
router.get('/my-suggestions', verifyToken, async (req, res) => {
  const userEmail = req.user.email; // Get user email from verified token
  try {
    const sql = 'SELECT id, title, content, status, createdAt FROM suggestions WHERE author = ? ORDER BY createdAt DESC';
    const [rows] = await pool.query(sql, [userEmail]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user suggestions.' });
  }
});

module.exports = router;
