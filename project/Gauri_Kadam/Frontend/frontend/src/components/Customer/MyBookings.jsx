import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { bookings } from '../../api/api';

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookingsList, setBookingsList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    no_of_people: '',
  });
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    paymentMethod: 'card',
  });
  const [bookingAmount, setBookingAmount] = useState(0);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookings.getCustomerBookings();
      setBookingsList(response.data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaymentChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateBookingAmount = (numPeople) => {
    // $20 per person booking fee
    return numPeople * 20;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Calculate booking amount
    const amount = calculateBookingAmount(parseInt(formData.no_of_people));
    setBookingAmount(amount);
    
    // Show payment modal
    setShowModal(false);
    setShowPaymentModal(true);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    try {
      // Validate card details only if payment method is card
      if (paymentData.paymentMethod === 'card') {
        if (paymentData.cardNumber.length !== 16) {
          toast.error('Invalid card number');
          return;
        }
        if (paymentData.cvv.length !== 3) {
          toast.error('Invalid CVV');
          return;
        }
      }

      // Create booking with payment info
      const bookingPayload = {
        ...formData,
        payment_method: paymentData.paymentMethod,
        payment_amount: bookingAmount,
        payment_status: paymentData.paymentMethod === 'cash' ? 'PENDING' : 'PAID',
      };

      await bookings.create(bookingPayload);
      
      if (paymentData.paymentMethod === 'cash') {
        toast.success('Booking created successfully! Please pay cash at the restaurant.');
      } else {
        toast.success('Booking created and payment processed successfully');
      }
      
      // Reset forms and close modals
      setShowPaymentModal(false);
      setFormData({ date: '', time: '', no_of_people: '' });
      setPaymentData({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        paymentMethod: 'card',
      });
      
      fetchBookings();
    } catch (error) {
      toast.error('Failed to process payment and create booking');
    }
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking? Refund will be processed within 5-7 business days.')) {
      try {
        await bookings.cancel(bookingId);
        toast.success('Booking cancelled. Refund will be processed soon.');
        fetchBookings();
      } catch (error) {
        toast.error('Failed to cancel booking');
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

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>My Bookings</h2>
            <button className="btn btn-success" onClick={() => setShowModal(true)}>
              New Booking
            </button>
          </div>

          {bookingsList.length === 0 ? (
            <p>No bookings yet</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>People</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Payment Status</th>
                  <th>Booking Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookingsList.map((booking) => (
                  <tr key={booking.Booking_ID}>
                    <td>{booking.Booking_ID}</td>
                    <td>{new Date(booking.Date).toLocaleDateString()}</td>
                    <td>{booking.Time}</td>
                    <td>{booking.No_Of_People}</td>
                    <td>${booking.payment_amount || (booking.No_Of_People * 20)}</td>
                    <td>
                      <span className="payment-method">
                        {booking.payment_method?.toUpperCase() || 'CARD'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-${booking.payment_status?.toLowerCase()}`}>
                        {booking.payment_status || 'PAID'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-${booking.status?.toLowerCase()}`}>
                        {booking.status || 'PENDING'}
                      </span>
                    </td>
                    <td>
                      {(booking.status === 'PENDING' || !booking.status) && (
                        <button
                          className="btn btn-danger"
                          onClick={() => handleCancel(booking.Booking_ID)}
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

      {/* Booking Details Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>New Booking</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Number of People</label>
                <input
                  type="number"
                  name="no_of_people"
                  value={formData.no_of_people}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
              <div className="booking-price-info">
                <p>Booking Fee: $20 per person</p>
                {formData.no_of_people && (
                  <p><strong>Total Amount: ${calculateBookingAmount(parseInt(formData.no_of_people))}</strong></p>
                )}
              </div>
              <button type="submit" className="btn-primary">
                Proceed to Payment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal-content payment-modal">
            <div className="modal-header">
              <h2>Payment Details</h2>
              <button 
                className="modal-close" 
                onClick={() => {
                  setShowPaymentModal(false);
                  setShowModal(true);
                }}
              >
                ×
              </button>
            </div>
            
            <div className="payment-summary">
              <h3>Booking Summary</h3>
              <p>Date: {new Date(formData.date).toLocaleDateString()}</p>
              <p>Time: {formData.time}</p>
              <p>Number of People: {formData.no_of_people}</p>
              <p className="total-amount">Total Amount: ${bookingAmount}</p>
            </div>

            <form onSubmit={handlePayment}>
              <div className="form-group">
                <label>Payment Method</label>
                <select
                  name="paymentMethod"
                  value={paymentData.paymentMethod}
                  onChange={handlePaymentChange}
                  required
                >
                  <option value="card">Credit/Debit Card</option>
                  <option value="upi">UPI</option>
                  <option value="cash">Cash (Pay at Restaurant)</option>
                </select>
              </div>

              {paymentData.paymentMethod === 'card' && (
                <>
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formatCardNumber(paymentData.cardNumber)}
                      onChange={(e) => {
                        const formatted = e.target.value.replace(/\s/g, '');
                        if (formatted.length <= 16) {
                          setPaymentData({
                            ...paymentData,
                            cardNumber: formatted,
                          });
                        }
                      }}
                      maxLength="19"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
                      name="cardName"
                      placeholder="John Doe"
                      value={paymentData.cardName}
                      onChange={handlePaymentChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={paymentData.expiryDate}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + '/' + value.slice(2, 4);
                          }
                          setPaymentData({
                            ...paymentData,
                            expiryDate: value,
                          });
                        }}
                        maxLength="5"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="password"
                        name="cvv"
                        placeholder="123"
                        value={paymentData.cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 3) {
                            setPaymentData({
                              ...paymentData,
                              cvv: value,
                            });
                          }
                        }}
                        maxLength="3"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {paymentData.paymentMethod === 'upi' && (
                <div className="form-group">
                  <label>UPI ID</label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    required
                  />
                </div>
              )}

              {paymentData.paymentMethod === 'cash' && (
                <div className="cash-payment-info">
                  <div className="info-icon">💵</div>
                  <h4>Pay at Restaurant</h4>
                  <p>Your table will be reserved. Please pay the booking amount of <strong>${bookingAmount}</strong> when you arrive at the restaurant.</p>
                  <div className="info-note">
                    <strong>Note:</strong> Please arrive on time. Late arrivals may result in booking cancellation.
                  </div>
                </div>
              )}

              <div className="payment-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setShowModal(true);
                  }}
                >
                  Back
                </button>
                <button type="submit" className="btn-primary">
                  {paymentData.paymentMethod === 'cash' ? 'Confirm Booking' : `Pay $${bookingAmount}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .payment-modal {
          max-width: 500px;
        }

        .payment-summary {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .payment-summary h3 {
          margin-top: 0;
          margin-bottom: 15px;
          color: #333;
        }

        .payment-summary p {
          margin: 8px 0;
          color: #666;
        }

        .total-amount {
          font-size: 1.2em;
          font-weight: bold;
          color: #28a745;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 2px solid #ddd;
        }

        .booking-price-info {
          background: #e7f3ff;
          padding: 15px;
          border-radius: 8px;
          margin: 15px 0;
        }

        .booking-price-info p {
          margin: 5px 0;
          color: #333;
        }

        .cash-payment-info {
          background: #fff3cd;
          border: 2px solid #ffc107;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          margin: 20px 0;
        }

        .info-icon {
          font-size: 48px;
          margin-bottom: 10px;
        }

        .cash-payment-info h4 {
          color: #856404;
          margin: 10px 0;
        }

        .cash-payment-info p {
          color: #856404;
          line-height: 1.6;
          margin: 15px 0;
        }

        .info-note {
          background: rgba(133, 100, 4, 0.1);
          padding: 10px;
          border-radius: 6px;
          margin-top: 15px;
          font-size: 14px;
          color: #856404;
        }

        .payment-method {
          text-transform: uppercase;
          font-size: 12px;
          font-weight: 600;
          color: #007bff;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .payment-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .payment-actions button {
          flex: 1;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
        }

        .btn-secondary:hover {
          background: #5a6268;
        }

        input[type="text"],
        input[type="password"],
        select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        input:focus,
        select:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
        }
      `}</style>
    </div>
  );
};

export default MyBookings;  