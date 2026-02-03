import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { razorpayPayment } from '../../api/payment';
import { orders } from '../../api/api';

const RazorpayCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, totalAmount } = location.state || {};
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!cart || cart.length === 0) {
      toast.error('Cart is empty');
      navigate('/customer/cart');
      return;
    }

    setProcessing(true);

    try {
      // Step 1: Create order in database
      const orderData = {
        items: cart.map((item) => ({
          fid: item.fid,
          quantity: item.quantity,
        })),
        total_amount: totalAmount,
      };

      const orderResponse = await orders.create(orderData);
      const orderId = orderResponse.data.orderId;

      // Step 2: Create Razorpay order
      const paymentResponse = await razorpayPayment.createOrder({
        amount: totalAmount,
        currency: 'INR',
      });

      // Step 3: Open Razorpay checkout
      const options = {
        key: paymentResponse.data.key_id,
        amount: paymentResponse.data.amount,
        currency: paymentResponse.data.currency,
        name: 'Restaurant Name',
        description: 'Order Payment',
        order_id: paymentResponse.data.order_id,
        handler: async function (response) {
          try {
            // Step 4: Verify payment
            const verifyResponse = await razorpayPayment.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: orderId,
            });

            if (verifyResponse.data.success) {
              localStorage.removeItem('cart');
              toast.success('Payment successful! Order placed.');
              navigate('/customer/orders');
            }
          } catch (error) {
            toast.error('Payment verification failed');
            console.error(error);
          }
        },
        prefill: {
          name: JSON.parse(localStorage.getItem('user') || '{}').name,
          email: JSON.parse(localStorage.getItem('user') || '{}').email,
        },
        theme: {
          color: '#667eea',
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
            toast.info('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  const handleCOD = async () => {
    if (!cart || cart.length === 0) {
      toast.error('Cart is empty');
      navigate('/customer/cart');
      return;
    }

    setProcessing(true);

    try {
      const orderData = {
        items: cart.map((item) => ({
          fid: item.fid,
          quantity: item.quantity,
        })),
        total_amount: totalAmount,
      };

      await orders.create(orderData);
      localStorage.removeItem('cart');
      toast.success('Order placed! Pay on delivery.');
      navigate('/customer/orders');
    } catch (error) {
      toast.error('Failed to place order');
      setProcessing(false);
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
          <h2>Checkout</h2>
          
          {cart && cart.length > 0 ? (
            <>
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
                  Total: ₹{totalAmount}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                <button
                  className="btn-primary"
                  onClick={handlePayment}
                  disabled={processing}
                  style={{ padding: '1rem' }}
                >
                  {processing ? 'Processing...' : 'Pay with Razorpay'}
                </button>
                
                <button
                  className="btn btn-success"
                  onClick={handleCOD}
                  disabled={processing}
                  style={{ padding: '1rem', width: '100%' }}
                >
                  Cash on Delivery
                </button>

                <button
                  className="btn btn-warning"
                  onClick={() => navigate('/customer/cart')}
                  style={{ padding: '1rem', width: '100%' }}
                >
                  Back to Cart
                </button>
              </div>
            </>
          ) : (
            <div>
              <p>No items to checkout</p>
              <button
                className="btn-primary"
                onClick={() => navigate('/customer/menu')}
                style={{ marginTop: '1rem' }}
              >
                Browse Menu
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RazorpayCheckout;