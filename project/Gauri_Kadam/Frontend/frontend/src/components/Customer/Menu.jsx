import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { foodItems } from '../../api/api';

const Menu = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchFoodItems();
    loadCart();
  }, []);

  const fetchFoodItems = async () => {
    try {
      const response = await foodItems.getAll();
      setItems(response.data);
    } catch (error) {
      toast.error('Failed to fetch menu items');
    }
  };

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.fid === item.fid);
    let newCart;

    if (existingItem) {
      newCart = cart.map((cartItem) =>
        cartItem.fid === item.fid
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      newCart = [...cart, { ...item, quantity: 1 }];
    }

    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    toast.success('Added to cart!');
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
          <a href="/customer/cart">
            🛒 Cart {cart.length > 0 && `(${cart.length})`}
          </a>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      <div className="container">
        <h1 style={{ color: 'white', marginBottom: '2rem' }}>Our Menu</h1>
        <div className="menu-grid">
          {items.map((item) => (
            <div key={item.fid} className="menu-item">
              {item.image && (
                <img
                  src={`http://localhost:5000/uploads/${item.image}`}
                  alt={item.name}
                />
              )}
              <div className="menu-item-content">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                {item.category && (
                  <p style={{ fontSize: '0.9rem', color: '#999' }}>
                    Category: {item.category}
                  </p>
                )}
                <div className="price">₹{item.price}</div>
                <button
                  className="btn btn-success"
                  onClick={() => addToCart(item)}
                  style={{ width: '100%' }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
