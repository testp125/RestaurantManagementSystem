const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Customer Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [customers] = await db.query('SELECT * FROM customers WHERE email = ?', [email]);

    if (customers.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const customer = customers[0];
    const isValidPassword = await bcrypt.compare(password, customer.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: customer.customer_id, email: customer.email, role: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      customer: {
        id: customer.customer_id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone
      }
    });
  } catch (error) {
    console.error('Customer login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Customer Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const [existingCustomer] = await db.query('SELECT * FROM customers WHERE email = ?', [email]);

    if (existingCustomer.length > 0) {
      return res.status(400).json({ message: 'Customer already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO customers (name, email, password, phone) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, phone]
    );

    res.status(201).json({
      message: 'Registration successful',
      customerId: result.insertId
    });
  } catch (error) {
    console.error('Customer registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;