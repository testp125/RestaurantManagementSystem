import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PaymentGatewaySelection = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [selectedGateway, setSelectedGateway] = useState('razorpay');

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      toast.error('Cart is empty');
      navigate('/customer/cart');
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleProceed = () => {
    const totalAmount = calculateTotal();

    if (selectedGateway === 'razorpay') {
      navigate('/customer/razorpay-checkout', {
        state: { cart, totalAmount },
      });
    } else if (selectedGateway === 'stripe') {
      navigate('/customer/stripe-checkout', {
        state: { cart, totalAmount },
      });
    } else if (selectedGateway === 'cod') {
      handleCOD();
    }
  };

  const handleCOD = async () => {
    try {
      const { orders } = await import('../../api/api');
      
      const orderData = {
        items: cart.map((item) => ({
          fid: item.fid,
          quantity: item.quantity,
        })),
        total_amount: calculateTotal(),
      };

      await orders.create(orderData);
      localStorage.removeItem('cart');
      toast.success('Order placed! Pay on delivery.');
      navigate('/customer/orders');
    } catch (error) {
      toast.error('Failed to place order');
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
        <div className="cart-container">
          <h2>Select Payment Method</h2>

          <div style={{ marginBottom: '2rem' }}>
            <h3>Order Summary</h3>
            {cart.map((item) => (
              <div key={item.fid} className="cart-item">
                <div>
                  <h4>{item.name}</h4>
                  <p>₹{item.price} × {item.quantity}</p>
                </div>
                <div style={{ fontWeight: 'bold' }}>
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
            <div className="cart-total" style={{ marginTop: '1rem' }}>
              Total: ₹{calculateTotal()}
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3>Choose Payment Gateway</h3>
            
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                marginTop: '1rem',
              }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem',
                  border: selectedGateway === 'razorpay' ? '2px solid #667eea' : '1px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: selectedGateway === 'razorpay' ? '#f0f4ff' : 'white',
                }}
              >
                <input
                  type="radio"
                  name="gateway"
                  value="razorpay"
                  checked={selectedGateway === 'razorpay'}
                  onChange={(e) => setSelectedGateway(e.target.value)}
                  style={{ marginRight: '1rem' }}
                />
                <div>
                  <strong>Razorpay</strong>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                    UPI, Cards, Netbanking, Wallets (Recommended for India)
                  </p>
                </div>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem',
                  border: selectedGateway === 'stripe' ? '2px solid #667eea' : '1px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: selectedGateway === 'stripe' ? '#f0f4ff' : 'white',
                }}
              >
                <input
                  type="radio"
                  name="gateway"
                  value="cod"
                  checked={selectedGateway === 'cod'}
                  onChange={(e) => setSelectedGateway(e.target.value)}
                  style={{ marginRight: '1rem' }}
                />
                <div>
                  <strong>Cash on Delivery</strong>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                    Pay when you receive your order
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              className="btn-primary"
              onClick={handleProceed}
              style={{ flex: 1 }}
            >
              Proceed to Payment
            </button>
            <button
              className="btn btn-warning"
              onClick={() => navigate('/customer/cart')}
              style={{ flex: 1 }}
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGatewaySelection;
