import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orders, bookings, customers, foodItems, feedback } from '../../api/api';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalBookings: 0,
    totalCustomers: 0,
    totalFoodItems: 0,
    totalFeedback: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        ordersRes,
        bookingsRes,
        customersRes,
        foodItemsRes,
        feedbackRes
      ] = await Promise.all([
        orders.getAllForAdmin(),
        bookings.getAllForAdmin(),
        customers.getAll(),
        foodItems.getAll(),
        feedback.getAllForAdmin(),
      ]);

      setStats({
        totalOrders: ordersRes.data.length,
        totalBookings: bookingsRes.data.length,
        totalCustomers: customersRes.data.length,
        totalFoodItems: foodItemsRes.data.length,
        totalFeedback: feedbackRes.data.length,
      });
    } catch (error) {
      toast.error('Failed to fetch statistics');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div>
      <nav className="navbar">
        <h2>Restaurant Admin Panel</h2>

        <div className="nav-links">
          <button onClick={() => navigate('/admin/dashboard')}>Dashboard</button>
          <button onClick={() => navigate('/admin/fooditems')}>Food Items</button>
          <button onClick={() => navigate('/admin/orders')}>Orders</button>
          <button onClick={() => navigate('/admin/bookings')}>Bookings</button>
          <button onClick={() => navigate('/admin/customers')}>Customers</button>
          <button onClick={() => navigate('/admin/feedback')}>Feedback</button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="dashboard">
        <h1>Welcome, {user?.name || 'Admin'} 👋</h1>

        <div className="dashboard-cards">
          <div className="dashboard-card" onClick={() => navigate('/admin/orders')}>
            <h3>Total Orders</h3>
            <p>{stats.totalOrders}</p>
          </div>

          <div className="dashboard-card" onClick={() => navigate('/admin/bookings')}>
            <h3>Total Bookings</h3>
            <p>{stats.totalBookings}</p>
          </div>

          <div className="dashboard-card" onClick={() => navigate('/admin/customers')}>
            <h3>Total Customers</h3>
            <p>{stats.totalCustomers}</p>
          </div>

          <div className="dashboard-card" onClick={() => navigate('/admin/fooditems')}>
            <h3>Food Items</h3>
            <p>{stats.totalFoodItems}</p>
          </div>

          <div className="dashboard-card" onClick={() => navigate('/admin/feedback')}>
            <h3>Feedback</h3>
            <p>{stats.totalFeedback}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
