import express from 'express';
import {
  createOrder,
  verifyPayment,
  getRazorpayKey
} from '../controllers/paymentController.js';

const router = express.Router();

/**
 * Route: POST /api/payment/create-order
 * Description: Create a new Razorpay order
 * Body: { amount, currency?, receipt? }
 */
router.post('/create-order', createOrder);

/**
 * Route: POST /api/payment/verify-payment
 * Description: Verify payment signature and payment status
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
router.post('/verify-payment', verifyPayment);

/**
 * Route: GET /api/payment/get-key
 * Description: Get Razorpay public key for frontend
 */
router.get('/get-key', getRazorpayKey);

export default router;
