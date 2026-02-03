import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customers } from '../../api/api';

const ManageCustomers = () => {
  const navigate = useNavigate();
  const [customersList, setCustomersList] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await customers.getAll();
      setCustomersList(response.data);
    } catch (error) {
      toast.error('Failed to fetch customers');
    }
  };

  const handleDelete = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customers.delete(customerId);
        toast.success('Customer deleted');
        fetchCustomers();
      } catch (error) {
        toast.error('Failed to delete customer');
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
          <h2>Manage Customers</h2>
          <table>
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customersList.map((customer) => (
                <tr key={customer.customer_id}>
                  <td>{customer.customer_id}</td>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(customer.customer_id)}
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

export default ManageCustomers;
