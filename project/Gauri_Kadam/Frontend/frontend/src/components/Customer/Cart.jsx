import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orders } from '../../api/api';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const updateQuantity = (fid, change) => {
    const newCart = cart
      .map((item) =>
        item.fid === fid
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeItem = (fid) => {
    const newCart = cart.filter((item) => item.fid !== fid);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    toast.success('Item removed from cart');
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    // Navigate to payment gateway selection
    navigate('/customer/checkout-payment');
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
        <div className="cart-container">
          <h2>Food Cart</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.fid} className="cart-item">
                  <div>
                    <h3>{item.name}</h3>
                    <p>₹{item.price} each</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                      className="btn btn-warning"
                      onClick={() => updateQuantity(item.fid, -1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="btn btn-success"
                      onClick={() => updateQuantity(item.fid, 1)}
                    >
                      +
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => removeItem(item.fid)}
                    >
                      Remove
                    </button>
                    <span style={{ fontWeight: 'bold' }}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
              <div className="cart-total">Total: ₹{calculateTotal()}</div>
              <button
                className="btn-primary"
                onClick={handleCheckout}
                style={{ marginTop: '1rem' }}
              >
                Proceed to Payment
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;