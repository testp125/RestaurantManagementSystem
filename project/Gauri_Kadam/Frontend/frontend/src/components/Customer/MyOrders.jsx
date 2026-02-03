import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orders } from '../../api/api';

const MyOrders = () => {
  const navigate = useNavigate();
  const [ordersList, setOrdersList] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orders.getCustomerOrders();
      setOrdersList(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    }
  };

  const handleCancel = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orders.cancel(orderId);
        toast.success('Order cancelled');
        fetchOrders();
      } catch (error) {
        toast.error('Failed to cancel order');
      }
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
          <h2>My Orders</h2>
          {ordersList.length === 0 ? (
            <p>No orders yet</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ordersList.map((order) => (
                  <tr key={order.oid}>
                    <td>{order.oid}</td>
                    <td>{new Date(order.odate).toLocaleDateString()}</td>
                    <td>
                      {order.items?.map((item, index) => (
                        <div key={index}>
                          {item.name} x {item.quantity}
                        </div>
                      ))}
                    </td>
                    <td>₹{order.total_amount}</td>
                    <td>
                      <span className={`status-badge status-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      {order.status === 'PENDING' && (
                        <button
                          className="btn btn-danger"
                          onClick={() => handleCancel(order.oid)}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
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

export default MyOrders;