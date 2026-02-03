import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { bookings } from '../../api/api';

const ManageBookings = () => {
  const navigate = useNavigate();
  const [bookingsList, setBookingsList] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookings.getAllForAdmin();
      setBookingsList(response.data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await bookings.updateStatus(bookingId, newStatus);
      toast.success('Booking status updated');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await bookings.delete(bookingId);
        toast.success('Booking deleted');
        fetchBookings();
      } catch (error) {
        toast.error('Failed to delete booking');
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
          <h2>Manage Bookings</h2>
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Time</th>
                <th>People</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookingsList.map((booking) => (
                <tr key={booking.Booking_ID}>
                  <td>{booking.Booking_ID}</td>
                  <td>{booking.customer_name}</td>
                  <td>{booking.email}</td>
                  <td>{booking.phone}</td>
                  <td>{new Date(booking.Date).toLocaleDateString()}</td>
                  <td>{booking.Time}</td>
                  <td>{booking.No_Of_People}</td>
                  <td>
                    <span className={`status-badge status-${booking.status?.toLowerCase()}`}>
                      {booking.status || 'PENDING'}
                    </span>
                  </td>
                  <td>
                    <select
                      value={booking.status || 'PENDING'}
                      onChange={(e) => handleStatusChange(booking.Booking_ID, e.target.value)}
                      style={{ padding: '0.5rem', borderRadius: '5px', marginRight: '0.5rem' }}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(booking.Booking_ID)}
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

export default ManageBookings;