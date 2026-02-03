const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');


// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [admins] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);

    if (admins.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const admin = admins[0];
    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.admin_id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin.admin_id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const [existingAdmin] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);

    if (existingAdmin.length > 0) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    res.status(201).json({
      message: 'Admin registered successfully',
      adminId: result.insertId
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;