const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { adminAuthMiddleware } = require('../middleware/auth');

// Get all customers (Admin only)
router.get('/', adminAuthMiddleware, async (req, res) => {
  try {
    const [customers] = await db.query('SELECT customer_id, name, email, phone FROM customers');
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get customer by ID (Admin only)
router.get('/:id', adminAuthMiddleware, async (req, res) => {
  try {
    const [customers] = await db.query(
      'SELECT customer_id, name, email, phone FROM customers WHERE customer_id = ?',
      [req.params.id]
    );

    if (customers.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customers[0]);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete customer (Admin only)
router.delete('/:id', adminAuthMiddleware, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM customers WHERE customer_id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
