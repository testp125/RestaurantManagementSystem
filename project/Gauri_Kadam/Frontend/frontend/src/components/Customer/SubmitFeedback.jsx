import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { feedback } from '../../api/api';

const SubmitFeedback = () => {
  const navigate = useNavigate();
  const [feedbackList, setFeedbackList] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await feedback.getCustomerFeedback();
      setFeedbackList(response.data);
    } catch (error) {
      toast.error('Failed to fetch feedback');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await feedback.create({ message });
      toast.success('Feedback submitted successfully');
      setMessage('');
      fetchFeedback();
    } catch (error) {
      toast.error('Failed to submit feedback');
    }
  };

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

      <div className="container">
        <div className="table-container">
          <h2>Submit Feedback</h2>
          <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
            <div className="form-group">
              <label>Your Feedback</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="5"
                placeholder="Share your experience with us..."
                required
              />
            </div>
            <button type="submit" className="btn-primary">
              Submit Feedback
            </button>
          </form>

          <h3>My Previous Feedback</h3>
          {feedbackList.length === 0 ? (
            <p>No feedback submitted yet</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {feedbackList.map((fb) => (
                  <tr key={fb.Feedback_ID}>
                    <td>{new Date(fb.Date).toLocaleDateString()}</td>
                    <td>{fb.Message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmitFeedback;