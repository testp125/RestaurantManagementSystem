const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware, adminAuthMiddleware } = require('../middleware/auth');

// Get all bookings (Admin only)
router.get('/admin/all', adminAuthMiddleware, async (req, res) => {
  try {
    const [bookings] = await db.query(`
      SELECT b.*, c.name as customer_name, c.email, c.phone 
      FROM booking b 
      JOIN customers c ON b.Customer_ID = c.customer_id 
      ORDER BY b.Date DESC, b.Time DESC
    `);

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get customer bookings
router.get('/customer', authMiddleware, async (req, res) => {
  try {
    const [bookings] = await db.query(
      'SELECT * FROM booking WHERE Customer_ID = ? ORDER BY Date DESC, Time DESC',
      [req.user.id]
    );

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new booking
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { date, time, no_of_people } = req.body;
    const customer_id = req.user.id;

    const [result] = await db.query(
      'INSERT INTO booking (Date, Time, No_Of_People, Customer_ID, status) VALUES (?, ?, ?, ?, ?)',
      [date, time, no_of_people, customer_id, 'PENDING']
    );

    res.status(201).json({
      message: 'Booking created successfully',
      bookingId: result.insertId
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking status (Admin only)
router.put('/:id/status', adminAuthMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const [result] = await db.query(
      'UPDATE booking SET status = ? WHERE Booking_ID = ?',
      [status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking status updated successfully' });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel booking
router.put('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const [result] = await db.query(
      'UPDATE booking SET status = ? WHERE Booking_ID = ? AND Customer_ID = ?',
      ['CANCELLED', req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete booking (Admin only)
router.delete('/:id', adminAuthMiddleware, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM booking WHERE Booking_ID = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
