import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Admin Auth APIs
export const adminAuth = {
  login: (data) => api.post('/admin/auth/login', data),
  register: (data) => api.post('/admin/auth/register', data),
};

// Customer Auth APIs
export const customerAuth = {
  login: (data) => api.post('/customer/auth/login', data),
  register: (data) => api.post('/customer/auth/register', data),
};

// Food Items APIs
export const foodItems = {
  getAll: () => api.get('/fooditems'),
  getById: (id) => api.get(`/fooditems/${id}`),
  create: (data) => api.post('/fooditems', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, data) => api.put(`/fooditems/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/fooditems/${id}`),
};

// Orders APIs
export const orders = {
  getAllForAdmin: () => api.get('/orders/admin/all'),
  getCustomerOrders: () => api.get('/orders/customer'),
  create: (data) => api.post('/orders', data),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
};

// Bookings APIs
export const bookings = {
  getAllForAdmin: () => api.get('/bookings/admin/all'),
  getCustomerBookings: () => api.get('/bookings/customer'),
  create: (data) => api.post('/bookings', data),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  delete: (id) => api.delete(`/bookings/${id}`),
};

// Feedback APIs
export const feedback = {
  getAllForAdmin: () => api.get('/feedback/admin/all'),
  getCustomerFeedback: () => api.get('/feedback/customer'),
  create: (data) => api.post('/feedback', data),
  delete: (id) => api.delete(`/feedback/${id}`),
};

// Customers APIs
export const customers = {
  getAll: () => api.get('/customers'),
  getById: (id) => api.get(`/customers/${id}`),
  delete: (id) => api.delete(`/customers/${id}`),
};

export default api;