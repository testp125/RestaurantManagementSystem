import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customerAuth } from '../../api/api';

const CustomerLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await customerAuth.login(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({ ...response.data.customer, role: 'customer' }));
      toast.success('Login successful!');
      navigate('/customer/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Customer Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>
        <div className="auth-link">
          <p>
            Don't have an account? <a href="/register">Register here</a>
          </p>
          <p>
            Admin? <a href="/admin/login">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;