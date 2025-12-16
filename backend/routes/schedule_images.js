
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { pool } = require('../db');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// GET all schedule images
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM schedule_images ORDER BY createdAt ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching schedule images:', error);
    res.status(500).json({ message: 'Error fetching images' });
  }
});

// POST a new schedule image (admin only)
router.post('/', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const imageUrl = `/uploads/${req.file.filename}`;

  try {
    const [result] = await pool.query('INSERT INTO schedule_images (image_url) VALUES (?)', [imageUrl]);
    res.status(201).json({ id: result.insertId, image_url: imageUrl });
  } catch (error) {
    console.error('Error saving image URL to database:', error);
    res.status(500).json({ message: 'Error saving image information' });
  }
});

// DELETE a schedule image (admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM schedule_images WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Image not found' });
    }
    // Note: This doesn't delete the file from the server, just the DB record.
    // For a full implementation, you'd add fs.unlink here.
    await pool.query('DELETE FROM schedule_images WHERE id = ?', [id]);
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image from database:', error);
    res.status(500).json({ message: 'Error deleting image' });
  }
});

module.exports = router;
