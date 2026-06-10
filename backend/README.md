# Backend Payment Server - Razorpay Integration

Express.js backend server for handling Razorpay payment integration.

## Quick Start

```bash
# Install dependencies
npm install

# Copy .env.example to .env
cp .env.example .env

# Edit .env with your Razorpay keys
# RAZORPAY_KEY_ID=your_key_here
# RAZORPAY_KEY_SECRET=your_secret_here

# Start server
npm start

# For development with auto-reload
npm run dev
```

## Environment Setup

Create `.env` file:

```env
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXX
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Folder Structure

```
backend/
├── controllers/
│   └── paymentController.js      # Payment logic handlers
├── routes/
│   └── paymentRoutes.js          # API route definitions
├── utils/
│   └── razorpay.js               # Razorpay SDK wrapper
├── server.js                     # Express app setup
├── package.json                  # Dependencies
├── .env                          # Environment variables
└── .env.example                  # Example env file
```

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payment/create-order` | Create Razorpay order |
| POST | `/api/payment/verify-payment` | Verify payment signature |
| GET | `/api/payment/get-key` | Get Razorpay public key |
| GET | `/api/health` | Health check |

## File Descriptions

### `server.js`
- Main Express application
- CORS configuration
- Middleware setup
- Error handling

### `controllers/paymentController.js`
- `createOrder()` - Creates Razorpay order
- `verifyPayment()` - Verifies payment signature
- `getRazorpayKey()` - Returns public key

### `routes/paymentRoutes.js`
- Route definitions for payment endpoints
- Connects routes to controllers

### `utils/razorpay.js`
- `createRazorpayOrder()` - Wraps Razorpay SDK
- `verifyPaymentSignature()` - Signature verification
- `fetchPaymentDetails()` - Fetch payment info from Razorpay

## Dependencies

- **express** - Web framework
- **cors** - CORS middleware
- **dotenv** - Environment variable loader
- **razorpay** - Razorpay Node SDK
- **crypto** - Signature verification
- **nodemon** (dev) - Auto-reload on file changes

## Security Features

✅ Environment variable management  
✅ HMAC-SHA256 signature verification  
✅ CORS protection  
✅ Input validation  
✅ Error handling  
✅ Secure key management  

## Deployment Checklist

- [ ] Use live Razorpay keys
- [ ] Set NODE_ENV to production
- [ ] Enable HTTPS
- [ ] Set up database for order storage
- [ ] Implement logging
- [ ] Add rate limiting
- [ ] Set up monitoring/alerts
- [ ] Backup and security audit

---

**For detailed setup guide, see:** [RAZORPAY_SETUP.md](../RAZORPAY_SETUP.md)
