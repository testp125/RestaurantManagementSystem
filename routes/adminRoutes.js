const express = require("express");
const router = express.Router();
const db = require("../config/database");
const { authMiddleware, adminAuthMiddleware } = require('../middleware/auth');

/* ------------------ DUMMY DATA (TEMP) ------------------ */

const cartItems = [
  { id: 1, name: "Pizza", price: 250 },
  { id: 2, name: "Burger", price: 200 },
];

const bookings = [
  { id: 1, customer: "Rahul", date: "2026-02-02", time: "7 PM" },
];

const orders = [
  { id: 101, total: 450, status: "Paid", date: "2025-01-20" },
];

const customers = [
  {
    id: "1",
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    phone: "9876543210",
  },
];

/* ------------------ DB ROUTES ------------------ */

// Customer activity
router.get("/customers/:id/activity", adminAuthMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT activity_type, description, created_at
       FROM customer_activity
       WHERE customer_id = ?
       ORDER BY created_at DESC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch activity" });
  }
});

// Customer payments
router.get("/customers/:id/payments", adminAuthMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT payment_id, gateway, amount, status, created_at
       FROM payments
       WHERE customer_id = ?`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch payments" });
  }
});

/* ------------------ SIMPLE ROUTES ------------------ */

router.get("/cart", (req, res) => res.json(cartItems));
router.get("/bookings", (req, res) => res.json(bookings));
router.get("/orders", (req, res) => res.json(orders));

router.get("/customers/:id", (req, res) => {
  const customer = customers.find(c => c.id === req.params.id);
  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }
  res.json(customer);
});

module.exports = router;
