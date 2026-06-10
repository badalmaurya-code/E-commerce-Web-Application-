import axios from 'axios';

// Use Vite environment variable when provided, otherwise use a relative API path
const API_BASE_URL = import.meta.env.VITE_API_BASE || '/api/payment';

/**
 * Get Razorpay Key ID from backend
 * @returns {Promise<string>} Razorpay Key ID
 */
export const getRazorpayKey = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-key`);
    if (response.data.success) {
      return response.data.keyId;
    }
    throw new Error('Failed to fetch Razorpay key');
  } catch (error) {
    console.error('Error fetching Razorpay key:', error);
    throw error;
  }
};

/**
 * Create Razorpay Order from backend
 * @param {number} amount - Amount in rupees
 * @param {string} receipt - Unique receipt identifier
 * @returns {Promise<object>} Order details with orderId
 */
export const createRazorpayOrder = async (amount, receipt = '') => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create-order`, {
      amount: parseFloat(amount),
      currency: 'INR',
      receipt: receipt || `receipt_${Date.now()}`
    });

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to create order');
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

/**
 * Verify Payment Signature on backend
 * @param {object} paymentData - Payment data with razorpay_order_id, razorpay_payment_id, razorpay_signature
 * @returns {Promise<object>} Verification result
 */
export const verifyPaymentSignature = async (paymentData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/verify-payment`, paymentData);

    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message || 'Payment verification failed');
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

/**
 * Load Razorpay Checkout Script
 * @returns {Promise<boolean>} Script loading status
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
