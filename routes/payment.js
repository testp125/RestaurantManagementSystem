const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
require('dotenv').config();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
router.post('/razorpay/create-order', authMiddleware, async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;

    const options = {
      amount: amount * 100, // Amount in paise (smallest currency unit)
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1, // Auto capture payment
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
    });
  }
});

// Verify Razorpay Payment
router.post('/razorpay/verify', authMiddleware, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

    // Generate signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    // Verify signature
    if (razorpay_signature === expectedSign) {
      // Update order payment status in database
      await db.query(
        'UPDATE orders SET payment_status = ?, payment_id = ?, payment_method = ? WHERE oid = ?',
        ['PAID', razorpay_payment_id, 'RAZORPAY', order_id]
      );

      res.json({
        success: true,
        message: 'Payment verified successfully',
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
    });
  }
});

// Create Razorpay Order for Booking
router.post('/razorpay/booking-payment', authMiddleware, async (req, res) => {
  try {
    const { amount, booking_id } = req.body;

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `booking_${booking_id}_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay booking payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking payment',
    });
  }
});

// Verify Booking Payment
router.post('/razorpay/verify-booking', authMiddleware, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, booking_id } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      await db.query(
        'UPDATE booking SET payment_status = ?, payment_id = ?, payment_method = ? WHERE Booking_ID = ?',
        ['PAID', razorpay_payment_id, 'RAZORPAY', booking_id]
      );

      res.json({
        success: true,
        message: 'Booking payment verified successfully',
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
    }
  } catch (error) {
    console.error('Booking payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Booking payment verification failed',
    });
  }
});

// Get Payment Details
router.get('/payment/:payment_id', authMiddleware, async (req, res) => {
  try {
    const payment = await razorpay.payments.fetch(req.params.payment_id);
    res.json({
      success: true,
      payment: payment,
    });
  } catch (error) {
    console.error('Fetch payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment details',
    });
  }
});

// Refund Payment
router.post('/refund', authMiddleware, async (req, res) => {
  try {
    const { payment_id, amount } = req.body;

    const refund = await razorpay.payments.refund(payment_id, {
      amount: amount * 100, // Amount in paise
    });

    res.json({
      success: true,
      refund: refund,
      message: 'Refund initiated successfully',
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Refund failed',
    });
  }
});



module.exports = router;
