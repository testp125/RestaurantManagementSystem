import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { foodItems } from '../../api/api';

const ManageFoodItems = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    image: null,
  });

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      const response = await foodItems.getAll();
      setItems(response.data);
    } catch (error) {
      toast.error('Failed to fetch food items');
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('description', formData.description);
    data.append('category', formData.category);
    if (formData.image) {
      data.append('image', formData.image);
    }
    if (editMode && currentItem) {
      data.append('existingImage', currentItem.image);
    }

    try {
      if (editMode) {
        await foodItems.update(currentItem.fid, data);
        toast.success('Food item updated successfully');
      } else {
        await foodItems.create(data);
        toast.success('Food item added successfully');
      }
      setShowModal(false);
      resetForm();
      fetchFoodItems();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setFormData({
      name: item.name,
      price: item.price,
      description: item.description,
      category: item.category,
      image: null,
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await foodItems.delete(id);
        toast.success('Food item deleted successfully');
        fetchFoodItems();
      } catch (error) {
        toast.error('Failed to delete food item');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      category: '',
      image: null,
    });
    setEditMode(false);
    setCurrentItem(null);
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Manage Food Items</h2>
            <button
              className="btn btn-success"
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
            >
              Add New Item
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.fid}>
                  <td>{item.fid}</td>
                  <td>
                    {item.image && (
                      <img
                        src={`http://localhost:5000/uploads/${item.image}`}
                        alt={item.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    )}
                  </td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>₹{item.price}</td>
                  <td>{item.description}</td>
                  <td>
                    <button className="btn btn-info" onClick={() => handleEdit(item)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(item.fid)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editMode ? 'Edit Food Item' : 'Add Food Item'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Image</label>
                <input type="file" name="image" onChange={handleChange} accept="image/*" />
              </div>
              <button type="submit" className="btn-primary">
                {editMode ? 'Update' : 'Add'} Item
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFoodItems;
