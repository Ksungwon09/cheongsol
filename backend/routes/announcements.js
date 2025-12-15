const express = require('express');
const { pool } = require('../db');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// GET all announcements (public)
router.get('/', async (req, res) => {
  try {
    const sql = 'SELECT * FROM announcements ORDER BY date DESC';
    const [rows] = await pool.query(sql);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching announcements.' });
  }
});

// POST a new announcement (admin only)
router.post('/', [verifyToken, isAdmin], async (req, res) => {
  const { title, content, isPopup } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }

  try {
    const sql = 'INSERT INTO announcements (title, content, isPopup) VALUES (?, ?, ?)';
    const [result] = await pool.query(sql, [title, content, isPopup || false]);
    res.status(201).json({ message: 'Announcement created', announcementId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating announcement.' });
  }
});

// DELETE an announcement (admin only)
router.delete('/:id', [verifyToken, isAdmin], async (req, res) => {
  const { id } = req.params;
  try {
    const sql = 'DELETE FROM announcements WHERE id = ?';
    const [result] = await pool.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Announcement not found.' });
    }

    res.json({ message: 'Announcement deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting announcement.' });
  }
});

module.exports = router;
