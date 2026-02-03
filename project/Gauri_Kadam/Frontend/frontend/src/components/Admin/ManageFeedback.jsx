import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { feedback } from '../../api/api';

const ManageFeedback = () => {
  const navigate = useNavigate();
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await feedback.getAllForAdmin();
      setFeedbackList(response.data);
    } catch (error) {
      toast.error('Failed to fetch feedback');
    }
  };

  const handleDelete = async (feedbackId) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await feedback.delete(feedbackId);
        toast.success('Feedback deleted');
        fetchFeedback();
      } catch (error) {
        toast.error('Failed to delete feedback');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
    toast.success('Logged out successfully');
  };

  return (
    <div>
      <nav className="navbar">
        <h2>Restaurant Admin Panel</h2>
        <div className="nav-links">
          <a href="/admin/dashboard">Dashboard</a>
          <a href="/admin/fooditems">Food Items</a>
          <a href="/admin/orders">Orders</a>
          <a href="/admin/bookings">Bookings</a>
          <a href="/admin/customers">Customers</a>
          <a href="/admin/feedback">Feedback</a>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      <div className="container">
        <div className="table-container">
          <h2>Customer Feedback</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Message</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbackList.map((fb) => (
                <tr key={fb.Feedback_ID}>
                  <td>{fb.Feedback_ID}</td>
                  <td>{fb.customer_name}</td>
                  <td>{fb.email}</td>
                  <td>{fb.Message}</td>
                  <td>{new Date(fb.Date).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(fb.Feedback_ID)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageFeedback;
