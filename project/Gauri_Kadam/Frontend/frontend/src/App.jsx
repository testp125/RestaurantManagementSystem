import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Admin Components
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';
import ManageFoodItems from './components/Admin/ManageFoodItems';
import ManageOrders from './components/Admin/ManageOrders';
import ManageBookings from './components/Admin/ManageBookings';
import ManageFeedback from './components/Admin/ManageFeedback';

// 🔥 NEW Admin Customer Activity Components
import CustomersList from './components/Admin/customers/CustomersList';
import CustomerProfile from './components/Admin/customers/CustomerProfile';
import CustomerOrders from './components/Admin/customers/CustomerOrders';
import CustomerBookings from './components/Admin/customers/CustomerBookings';
import CustomerCart from './components/Admin/customers/CustomerCart';
import CustomerActivity from './components/Admin/customers/CustomerActivity';
import CustomerPayment from './components/Admin/customers/CustomerPayment';

// Customer Components
import CustomerLogin from './components/Customer/CustomerLogin';
import CustomerRegister from './components/Customer/CustomerRegister';
import CustomerDashboard from './components/Customer/CustomerDashboard';
import Menu from './components/Customer/Menu';
import MyOrders from './components/Customer/MyOrders';
import MyBookings from './components/Customer/MyBookings';
import SubmitFeedback from './components/Customer/SubmitFeedback';
import Cart from './components/Customer/Cart';
import PaymentGatewaySelection from './components/Customer/PaymentGatewaySelection';
import RazorpayCheckout from './components/Customer/RazorpayCheckout';


import './App.css';

// Protected Route
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    return <Navigate to={role === 'admin' ? '/admin/login' : '/login'} />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer position="top-right" autoClose={3000} />

        <Routes>
          {/* Public */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Customer Routes */}
          <Route path="/login" element={<CustomerLogin />} />
          <Route path="/register" element={<CustomerRegister />} />

          <Route
            path="/customer/dashboard"
            element={<ProtectedRoute role="customer"><CustomerDashboard /></ProtectedRoute>}
          />
          <Route
            path="/customer/menu"
            element={<ProtectedRoute role="customer"><Menu /></ProtectedRoute>}
          />
          <Route
            path="/customer/orders"
            element={<ProtectedRoute role="customer"><MyOrders /></ProtectedRoute>}
          />
          <Route
            path="/customer/bookings"
            element={<ProtectedRoute role="customer"><MyBookings /></ProtectedRoute>}
          />
          <Route
            path="/customer/feedback"
            element={<ProtectedRoute role="customer"><SubmitFeedback /></ProtectedRoute>}
          />
          <Route
            path="/customer/cart"
            element={<ProtectedRoute role="customer"><Cart /></ProtectedRoute>}
          />
          <Route
            path="/customer/checkout-payment"
            element={<ProtectedRoute role="customer"><PaymentGatewaySelection /></ProtectedRoute>}
          />
          <Route
            path="/customer/razorpay-checkout"
            element={<ProtectedRoute role="customer"><RazorpayCheckout /></ProtectedRoute>}
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin/dashboard"
            element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>}
          />
          <Route
            path="/admin/fooditems"
            element={<ProtectedRoute role="admin"><ManageFoodItems /></ProtectedRoute>}
          />
          <Route
            path="/admin/orders"
            element={<ProtectedRoute role="admin"><ManageOrders /></ProtectedRoute>}
          />
          <Route
            path="/admin/bookings"
            element={<ProtectedRoute role="admin"><ManageBookings /></ProtectedRoute>}
          />
          <Route
            path="/admin/feedback"
            element={<ProtectedRoute role="admin"><ManageFeedback /></ProtectedRoute>}
          />

          {/* 🔥 Admin → Customers Activity */}
          <Route
            path="/admin/customers"
            element={<ProtectedRoute role="admin"><CustomersList /></ProtectedRoute>}
          />
          <Route
            path="/admin/customers/:id"
            element={<ProtectedRoute role="admin"><CustomerProfile /></ProtectedRoute>}
          />
          <Route
            path="/admin/customers/:id/orders"
            element={<ProtectedRoute role="admin"><CustomerOrders /></ProtectedRoute>}
          />
          <Route
            path="/admin/customers/:id/bookings"
            element={<ProtectedRoute role="admin"><CustomerBookings /></ProtectedRoute>}
          />
          <Route
            path="/admin/customers/:id/payment"
            element={<ProtectedRoute role="admin"><CustomerPayment /></ProtectedRoute>}
          />
          <Route
            path="/admin/customers/:id/cart"
            element={<ProtectedRoute role="admin"><CustomerCart /></ProtectedRoute>}
          />
          <Route
            path="/admin/customers/:id/activity"
            element={<ProtectedRoute role="admin"><CustomerActivity /></ProtectedRoute>}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
