import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { adminAuth } from '../../api/api';

const AdminLogin = () => {
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
      const response = await adminAuth.login(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({ ...response.data.admin, role: 'admin' }));
      toast.success('Login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Admin Login</h2>
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
            Customer? <a href="/login">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;