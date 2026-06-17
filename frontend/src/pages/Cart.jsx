import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCart, updateQuantity, removeItem, clearCart } from "../services/CartService";
import {
  getRazorpayKey,
  createRazorpayOrder,
  verifyPaymentSignature,
  loadRazorpayScript
} from "../services/PaymentService";
import { saveTransaction } from "../services/IndexedDBService";

const USD_TO_INR = 83;
const formatINR = (usd) => `₹${(usd * USD_TO_INR).toFixed(2)}`;

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState(null);
  const [messageType, setMessageType] = useState(null); // 'success' or 'error'
  const navigate = useNavigate();

  const loadCart = () => {
    setCart(getCart());
  };

  useEffect(() => {
    const isAuth = localStorage.getItem('shopmartAuth') === 'true';
    if (!isAuth) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    loadCart();
    window.addEventListener("cartUpdated", loadCart);
    window.addEventListener("storage", loadCart);

    return () => {
      window.removeEventListener("cartUpdated", loadCart);
      window.removeEventListener("storage", loadCart);
    };
  }, []);

  const handleQuantityChange = (itemKey, nextQty) => {
    updateQuantity(itemKey, nextQty);
    loadCart();
  };

  const handleRemove = (itemKey) => {
    removeItem(itemKey);
    loadCart();
  };

  const handleClearCart = () => {
    clearCart();
    loadCart();
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  /**
   * Handle Checkout and Razorpay Payment
   */
  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      setPaymentMessage(null);

      // Validate cart
      if (cart.length === 0) {
        setMessageType('error');
        setPaymentMessage('Your cart is empty. Please add items before checkout.');
        setIsProcessing(false);
        return;
      }

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay. Please try again.');
      }

      // Fetch Razorpay Key
      const razorpayKeyId = await getRazorpayKey();

      // Calculate total amount
      const totalAmount = cartTotal + (cartTotal > 0 ? 5 : 0); // Add shipping

      // Get user email
      let userEmail = "";
      try {
        const userJson = localStorage.getItem("shopmartUser");
        if (userJson) {
          userEmail = JSON.parse(userJson).email || "";
        }
      } catch (e) {
        console.error("Error parsing user email", e);
      }

      // Create Order
      const orderData = await createRazorpayOrder(
        totalAmount,
        `order_${Date.now()}_${Math.random().toString(36).substring(7)}`
      );

      // Prepare Razorpay Options
      const options = {
        key: razorpayKeyId,
        amount: Math.round(totalAmount * 100), // Amount in paise
        currency: 'INR',
        name: 'ShopMart',
        description: `Order for ${cart.length} item(s)`,
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            // Verify payment on backend
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            };

            const verificationResult = await verifyPaymentSignature(verificationData);

            if (verificationResult.success) {
              setMessageType('success');
              setPaymentMessage('✅ Payment successful! Your order has been placed.');

              // Store the full order data and Transaction ID in IndexedDB
              await saveTransaction(response.razorpay_payment_id, {
                orderId: response.razorpay_order_id,
                amount: totalAmount,
                items: cart, // Save the complete array of items
                customer: {
                  name: 'Customer',
                  email: userEmail,
                  phone: ''
                },
                status: 'success'
              });

              // Clear cart after successful payment
              setTimeout(() => {
                clearCart();
                setCart([]);
                // Optionally redirect to order confirmation page
                // navigate('/order-confirmation', { state: { orderId: response.razorpay_order_id } });
              }, 2000);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            setMessageType('error');
            setPaymentMessage(`❌ Payment verification failed: ${error.message}`);
            console.error('Payment verification error:', error);
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: localStorage.getItem('userName') || 'Customer',
          email: userEmail,
          contact: localStorage.getItem('userPhone') || ''
        },
        notes: {
          itemCount: cart.length,
          totalItems: cart.map(item => item.title).join(', ')
        },
        theme: {
          color: '#6366f1' // Indigo color (customize as needed)
        },
        modal: {
          ondismiss: () => {
            setMessageType('error');
            setPaymentMessage('❌ Payment cancelled. Please try again.');
            setIsProcessing(false);
          }
        }
      };

      // Open Razorpay Checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setMessageType('error');
      setPaymentMessage(`❌ Checkout failed: ${error.message}`);
      console.error('Checkout error:', error);
      setIsProcessing(false);
    }
  };


  return (
    <div className="cart-container">
      <div className="cart-header-row">
        <Link to="/" className="back-button">
          <i className="fa-solid fa-arrow-left"></i> Back to shop
        </Link>
        <div className="cart-header-info">
          <h2>Your Cart 🛒</h2>
          <p>{cart.length ? `${cart.length} item${cart.length > 1 ? "s" : ""} in your cart` : "Your cart is empty."}</p>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart has no items yet.</p>
          <Link to="/" className="shop-now-btn">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="cart-main">
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.key} className="cart-item">
                <img src={item.image} alt={item.title} className="cart-item-img" />
                <div className="cart-item-details">
                  <div className="cart-item-title-row">
                    <div>
                      <h3>{item.title}</h3>
                      {item.size && (
                        <p className="cart-item-variant">Size: <strong>{item.size}</strong></p>
                      )}
                    </div>
                    <button className="remove-item" onClick={() => handleRemove(item.key)}>
                      Remove
                    </button>
                  </div>
                  <p className="cart-item-price">{formatINR(item.price)} each</p>
                  <div className="quantity-row">
                    <button
                      className="qty-control"
                      onClick={() => handleQuantityChange(item.key, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-control"
                      onClick={() => handleQuantityChange(item.key, item.quantity + 1)}
                    >
                      +
                    </button>
                    <span className="item-total">Total: {formatINR(item.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="cart-summary">
            <h3>Order summary</h3>
            <div className="summary-line">
              <span>Subtotal</span>
              <span>{formatINR(cartTotal)}</span>
            </div>
            <div className="summary-line">
              <span>Shipping</span>
              <span>{cartTotal > 0 ? formatINR(5) : formatINR(0)}</span>
            </div>
            <div className="summary-line summary-total">
              <span>Total</span>
              <span>{formatINR(cartTotal + (cartTotal > 0 ? 5 : 0))}</span>
            </div>

            {paymentMessage && (
              <div className={`payment-message ${messageType}`}>
                {paymentMessage}
              </div>
            )}

            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={isProcessing || cart.length === 0}
            >
              {isProcessing ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Processing...
                </>
              ) : (
                'Proceed to Checkout'
              )}
            </button>
            <button className="clear-cart-btn" onClick={handleClearCart} disabled={isProcessing}>
              Clear Cart
            </button>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;
