const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const adminRoutes = require('./routes/adminRoutes');
const adminAuthRoutes = require('./routes/adminAuth');
const customerAuthRoutes = require('./routes/customerAuth');
const foodItemsRoutes = require('./routes/foodItems');
const ordersRoutes = require('./routes/orders');
const bookingsRoutes = require('./routes/bookings');
const feedbackRoutes = require('./routes/feedback');
const customersRoutes = require('./routes/customers');
const paymentRoutes = require('./routes/payment');

// API routes
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/customer/auth', customerAuthRoutes);
app.use('/api/fooditems', foodItemsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);


// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});

module.exports = app;