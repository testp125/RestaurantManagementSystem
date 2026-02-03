import api from './api';

/**
 * Payment API Service
 * Handles both Razorpay and Stripe payment integrations
 */

// ============================================
// RAZORPAY PAYMENT APIs
// ============================================

export const razorpayPayment = {
  /**
   * Create a new Razorpay order
   * @param {Object} data - Order details (amount, currency, etc.)
   * @returns {Promise} Order response with order_id
   */
  createOrder: (data) => api.post('/payment/razorpay/create-order', data),

  /**
   * Verify Razorpay payment signature
   * @param {Object} data - Payment verification details
   * @returns {Promise} Verification result
   */
  verifyPayment: (data) => api.post('/payment/razorpay/verify', data),

  /**
   * Create a booking-specific payment
   * @param {Object} data - Booking and payment details
   * @returns {Promise} Payment response
   */
  createBookingPayment: (data) => api.post('/payment/razorpay/booking-payment', data),

  /**
   * Verify booking payment
   * @param {Object} data - Booking payment verification details
   * @returns {Promise} Verification result
   */
  verifyBookingPayment: (data) => api.post('/payment/razorpay/verify-booking', data),

  /**
   * Get payment details by ID
   * @param {string} paymentId - The payment ID to retrieve
   * @returns {Promise} Payment details
   */
  getPaymentDetails: (paymentId) => api.get(`/payment/payment/${paymentId}`), // Fixed syntax error

  /**
   * Initiate a refund
   * @param {Object} data - Refund details (paymentId, amount, etc.)
   * @returns {Promise} Refund result
   */
  refundPayment: (data) => api.post('/payment/refund', data),
};

// ============================================
// STRIPE PAYMENT APIs
// ============================================

export const stripePayment = {
  /**
   * Create a Stripe payment intent
   * @param {Object} data - Payment intent details (amount, currency, etc.)
   * @returns {Promise} Payment intent with client_secret
   */
  createPaymentIntent: (data) => api.post('/payment/stripe/create-payment-intent', data),

  /**
   * Verify Stripe payment
   * @param {Object} data - Payment verification details
   * @returns {Promise} Verification result
   */
  verifyPayment: (data) => api.post('/payment/stripe/verify', data),

  /**
   * Create a booking-specific payment
   * @param {Object} data - Booking and payment details
   * @returns {Promise} Payment response
   */
  createBookingPayment: (data) => api.post('/payment/stripe/booking-payment', data),

  /**
   * Verify booking payment
   * @param {Object} data - Booking payment verification details
   * @returns {Promise} Verification result
   */
  verifyBookingPayment: (data) => api.post('/payment/stripe/verify-booking', data),

  /**
   * Initiate a refund
   * @param {Object} data - Refund details (paymentIntentId, amount, etc.)
   * @returns {Promise} Refund result
   */
  refundPayment: (data) => api.post('/payment/stripe/refund', data),
};

// ============================================
// HELPER FUNCTIONS (Optional)
// ============================================

/**
 * Determine which payment service to use based on config or preference
 * @param {string} provider - 'razorpay' or 'stripe'
 * @returns {Object} The appropriate payment service object
 */
export const getPaymentService = (provider) => {
  const providers = {
    razorpay: razorpayPayment,
    stripe: stripePayment,
  };
  
  return providers[provider.toLowerCase()] || razorpayPayment; // Default to Razorpay
};
