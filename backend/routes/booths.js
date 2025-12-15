const express = require('express');
const { pool } = require('../db');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// GET all booths (public)
router.get('/', async (req, res) => {
  try {
    const sql = 'SELECT * FROM booths ORDER BY name ASC';
    const [rows] = await pool.query(sql);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching booths.' });
  }
});

// POST a new booth (admin only)
router.post('/', [verifyToken, isAdmin], async (req, res) => {
  const { name, category, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Booth name is required.' });
  }

  try {
    const sql = 'INSERT INTO booths (name, category, description) VALUES (?, ?, ?)';
    const [result] = await pool.query(sql, [name, category, description]);
    res.status(201).json({ message: 'Booth created', boothId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating booth.' });
  }
});

// DELETE a booth (admin only)
router.delete('/:id', [verifyToken, isAdmin], async (req, res) => {
  const { id } = req.params;
  try {
    const sql = 'DELETE FROM booths WHERE id = ?';
    const [result] = await pool.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booth not found.' });
    }

    res.json({ message: 'Booth deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting booth.' });
  }
});

module.exports = router;
