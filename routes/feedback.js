const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware, adminAuthMiddleware } = require('../middleware/auth');

// Get all feedback (Admin only)
router.get('/admin/all', adminAuthMiddleware, async (req, res) => {
  try {
    const [feedback] = await db.query(`
      SELECT f.*, c.name as customer_name, c.email 
      FROM feedback f 
      JOIN customers c ON f.Customer_ID = c.customer_id 
      ORDER BY f.Date DESC
    `);

    res.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get customer feedback
router.get('/customer', authMiddleware, async (req, res) => {
  try {
    const [feedback] = await db.query(
      'SELECT * FROM feedback WHERE Customer_ID = ? ORDER BY Date DESC',
      [req.user.id]
    );

    res.json(feedback);
  } catch (error) {
    console.error('Error fetching customer feedback:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit feedback
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const customer_id = req.user.id;
    const date = new Date().toISOString().split('T')[0];

    const [result] = await db.query(
      'INSERT INTO feedback (Message, Date, Customer_ID) VALUES (?, ?, ?)',
      [message, date, customer_id]
    );

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedbackId: result.insertId
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete feedback (Admin only)
router.delete('/:id', adminAuthMiddleware, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM feedback WHERE Feedback_ID = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
