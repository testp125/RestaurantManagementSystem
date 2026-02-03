const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { adminAuthMiddleware } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get all food items
router.get('/', async (req, res) => {
  try {
    const [items] = await db.query('SELECT * FROM foodItems ORDER BY fid DESC');
    res.json(items);
  } catch (error) {
    console.error('Error fetching food items:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get food item by ID
router.get('/:id', async (req, res) => {
  try {
    const [items] = await db.query('SELECT * FROM foodItems WHERE fid = ?', [req.params.id]);
    
    if (items.length === 0) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    
    res.json(items[0]);
  } catch (error) {
    console.error('Error fetching food item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new food item (Admin only)
router.post('/', adminAuthMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    const image = req.file ? req.file.filename : null;

    const [result] = await db.query(
      'INSERT INTO foodItems (name, price, description, image, category) VALUES (?, ?, ?, ?, ?)',
      [name, price, description, image, category]
    );

    res.status(201).json({
      message: 'Food item added successfully',
      foodItemId: result.insertId
    });
  } catch (error) {
    console.error('Error adding food item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update food item (Admin only)
router.put('/:id', adminAuthMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    const image = req.file ? req.file.filename : req.body.existingImage;

    const [result] = await db.query(
      'UPDATE foodItems SET name = ?, price = ?, description = ?, image = ?, category = ? WHERE fid = ?',
      [name, price, description, image, category, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.json({ message: 'Food item updated successfully' });
  } catch (error) {
    console.error('Error updating food item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete food item (Admin only)
router.delete('/:id', adminAuthMiddleware, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM foodItems WHERE fid = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.json({ message: 'Food item deleted successfully' });
  } catch (error) {
    console.error('Error deleting food item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;