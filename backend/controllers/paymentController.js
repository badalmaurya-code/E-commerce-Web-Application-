import {
  createRazorpayOrder,
  verifyPaymentSignature,
  fetchPaymentDetails
} from '../utils/razorpay.js';

/**
 * Create Order Controller
 * POST /api/payment/create-order
 * Body: { amount, currency?, receipt? }
 */
export const createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    // Validate inputs
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount. Amount must be greater than 0.'
      });
    }

    // Create Razorpay order
    const order = await createRazorpayOrder(amount, currency, receipt);

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      }
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create order'
    });
  }
};

/**
 * Verify Payment Controller
 * POST /api/payment/verify-payment
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Validate inputs
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification data'
      });
    }

    // Verify signature
    const isSignatureValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isSignatureValid) {
      return res.status(401).json({
        success: false,
        message: 'Payment verification failed. Invalid signature.'
      });
    }

    // Fetch payment details from Razorpay for additional verification
    const paymentDetails = await fetchPaymentDetails(razorpay_payment_id);

    if (paymentDetails.status !== 'captured') {
      return res.status(400).json({
        success: false,
        message: 'Payment not captured',
        status: paymentDetails.status
      });
    }

    // Payment verified successfully
    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        amount: paymentDetails.amount / 100, // Convert from paise to rupees
        currency: paymentDetails.currency,
        status: paymentDetails.status,
        createdAt: new Date(paymentDetails.created_at * 1000).toISOString()
      }
    });
  } catch (error) {
    console.error('Verify Payment Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify payment'
    });
  }
};

/**
 * Get Razorpay Key Controller
 * GET /api/payment/get-key
 */
export const getRazorpayKey = (req, res) => {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;

    if (!keyId) {
      return res.status(500).json({
        success: false,
        message: 'Razorpay key not configured'
      });
    }

    return res.status(200).json({
      success: true,
      keyId: keyId
    });
  } catch (error) {
    console.error('Get Key Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get Razorpay key'
    });
  }
};
