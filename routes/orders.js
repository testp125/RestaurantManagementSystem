const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware, adminAuthMiddleware } = require('../middleware/auth');

// Get all orders (Admin only)
router.get('/admin/all', adminAuthMiddleware, async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT o.*, c.name as customer_name, c.email, c.phone 
      FROM orders o 
      JOIN customers c ON o.customer_id = c.customer_id 
      ORDER BY o.odate DESC
    `);

    for (let order of orders) {
      const [details] = await db.query(`
        SELECT od.*, f.name, f.price 
        FROM orderdetails od 
        JOIN foodItems f ON od.fid = f.fid 
        WHERE od.oid = ?
      `, [order.oid]);
      order.items = details;
    }

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get customer orders
router.get('/customer', authMiddleware, async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT * FROM orders WHERE customer_id = ? ORDER BY odate DESC
    `, [req.user.id]);

    for (let order of orders) {
      const [details] = await db.query(`
        SELECT od.*, f.name, f.price, f.image 
        FROM orderdetails od 
        JOIN foodItems f ON od.fid = f.fid 
        WHERE od.oid = ?
      `, [order.oid]);
      order.items = details;
    }

    res.json(orders);
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new order
router.post('/', authMiddleware, async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const { items, total_amount } = req.body;
    const customer_id = req.user.id;

    // Insert order
    const [orderResult] = await connection.query(
      'INSERT INTO orders (customer_id, total_amount, status) VALUES (?, ?, ?)',
      [customer_id, total_amount, 'PENDING']
    );

    const orderId = orderResult.insertId;

    // Insert order details
    for (let item of items) {
      await connection.query(
        'INSERT INTO orderdetails (oid, fid, quantity) VALUES (?, ?, ?)',
        [orderId, item.fid, item.quantity]
      );
    }

    await connection.commit();

    res.status(201).json({
      message: 'Order placed successfully',
      orderId: orderId
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
});

// Update order status (Admin only)
router.put('/:id/status', adminAuthMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const [result] = await db.query(
      'UPDATE orders SET status = ? WHERE oid = ?',
      [status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel order
router.put('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const [result] = await db.query(
      'UPDATE orders SET status = ? WHERE oid = ? AND customer_id = ? AND status = ?',
      ['CANCELLED', req.params.id, req.user.id, 'PENDING']
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found or cannot be cancelled' });
    }

    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
