import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance
export const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

/**
 * Create Razorpay Order
 * @param {number} amount - Amount in smallest currency unit (paise for INR)
 * @param {string} currency - Currency code (e.g., 'INR')
 * @param {string} receipt - Unique receipt id
 * @returns {Promise} Razorpay order object
 */
export const createRazorpayOrder = async (amount, currency = 'INR', receipt = '') => {
  try {
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1 // Auto capture payment
    };

    const order = await razorpayInstance.orders.create(options);
    return order;
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    throw new Error(`Failed to create Razorpay order: ${error.message}`);
  }
};

/**
 * Verify Razorpay Payment Signature
 * @param {string} razorpay_order_id - Order ID from Razorpay
 * @param {string} razorpay_payment_id - Payment ID from Razorpay
 * @param {string} razorpay_signature - Signature from Razorpay
 * @returns {boolean} Signature verification result
 */
export const verifyPaymentSignature = (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
  try {
    // Create HMAC SHA256 hash
    const message = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(message)
      .digest('hex');

    // Verify signature
    return generatedSignature === razorpay_signature;
  } catch (error) {
    console.error('Signature Verification Error:', error);
    return false;
  }
};

/**
 * Fetch Payment Details from Razorpay
 * @param {string} paymentId - Payment ID from Razorpay
 * @returns {Promise} Payment details object
 */
export const fetchPaymentDetails = async (paymentId) => {
  try {
    const payment = await razorpayInstance.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error('Fetch Payment Error:', error);
    throw new Error(`Failed to fetch payment details: ${error.message}`);
  }
};
