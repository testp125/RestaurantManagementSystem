import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orders } from '../../api/api';

const ManageOrders = () => {
  const navigate = useNavigate();
  const [ordersList, setOrdersList] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orders.getAllForAdmin();
      setOrdersList(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orders.updateStatus(orderId, newStatus);
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
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
          <h2>Manage Orders</h2>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Order Date</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Items</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ordersList.map((order) => (
                <tr key={order.oid}>
                  <td>{order.oid}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.email}</td>
                  <td>{order.phone}</td>
                  <td>{new Date(order.odate).toLocaleString()}</td>
                  <td>₹{order.total_amount}</td>
                  <td>
                    <span className={`status-badge status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    {order.items?.map((item, index) => (
                      <div key={index}>
                        {item.name} x {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.oid, e.target.value)}
                      style={{ padding: '0.5rem', borderRadius: '5px' }}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
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

export default ManageOrders;