import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <div>
      <nav className="navbar">
        <h2>🍽️ Restaurant</h2>
        <div className="nav-links">
          <a href="/customer/dashboard">Dashboard</a>
          <a href="/customer/menu">Menu</a>
          <a href="/customer/orders">My Orders</a>
          <a href="/customer/bookings">My Bookings</a>
          <a href="/customer/feedback">Feedback</a>
          <a href="/customer/cart">🛒 Cart</a>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard">
        <h1>Welcome, {user.name}!</h1>
        <div className="dashboard-cards">
          <div className="dashboard-card" onClick={() => navigate('/customer/menu')}>
            <h3>Browse Menu</h3>
            <p>🍔</p>
          </div>
          <div className="dashboard-card" onClick={() => navigate('/customer/orders')}>
            <h3>My Orders</h3>
            <p>📋</p>
          </div>
          <div className="dashboard-card" onClick={() => navigate('/customer/bookings')}>
            <h3>My Bookings</h3>
            <p>📅</p>
          </div>
          <div className="dashboard-card" onClick={() => navigate('/customer/feedback')}>
            <h3>Give Feedback</h3>
            <p>💬</p>
          </div>
          <div className="dashboard-card" onClick={() => navigate('/customer/cart')}>
            <h3>Cart</h3>
            <p>🛒</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
