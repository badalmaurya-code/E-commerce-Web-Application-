import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getTransactions } from "../services/IndexedDBService";
import "../styles/MyOrders.css";

const USD_TO_INR = 83;
const formatINR = (amount) => {
    // If the amount is already a large number, it might already be in INR or we should check
    // In Cart.jsx: cartTotal is likely in USD? Wait, let's see: `totalAmount = cartTotal + 5`.
    // Then `Math.round(totalAmount * 100)` for Razorpay.
    // In saveTransaction, amount is `totalAmount`.
    // In Cart.jsx formatINR is `₹${(usd * USD_TO_INR).toFixed(2)}`.
    // Assuming amount saved in IndexedDB is in USD like cartTotal.
    return `₹${(amount * USD_TO_INR).toFixed(2)}`;
};

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthAndFetchOrders = async () => {
            const isAuth = localStorage.getItem('shopmartAuth') === 'true';
            if (!isAuth) {
                navigate('/login', { state: { from: '/my-orders' } });
                return;
            }

            try {
                // Get current logged-in user email
                let userEmail = "";
                const userJson = localStorage.getItem("shopmartUser");
                if (userJson) {
                    try {
                        const user = JSON.parse(userJson);
                        userEmail = user?.email || "";
                    } catch {
                        userEmail = "";
                    }
                }

                // Fetch all transactions
                const allTransactions = await getTransactions();
                
                // Filter transactions by the current user's email
                // Sort by date descending (newest first)
                const userOrders = allTransactions
                    .filter(tx => tx.customer?.email === userEmail)
                    .sort((a, b) => new Date(b.date) - new Date(a.date));

                setOrders(userOrders);
            } catch (error) {
                console.error("Failed to load orders", error);
            } finally {
                setLoading(false);
            }
        };

        checkAuthAndFetchOrders();
    }, [navigate]);

    if (loading) {
        return (
            <div className="my-orders-container">
                <div className="my-orders-header">
                    <h2>My Orders</h2>
                </div>
                <p>Loading your orders...</p>
            </div>
        );
    }

    return (
        <div className="my-orders-container">
            <div className="my-orders-header">
                <h2>My Orders 📦</h2>
            </div>

            {orders.length === 0 ? (
                <div className="empty-orders">
                    <p>You haven't placed any orders yet.</p>
                    <Link to="/" className="shop-now-btn">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order.id || order.transactionId} className="order-card">
                            <div className="order-header">
                                <div className="order-header-info">
                                    <p><strong>Order ID:</strong> {order.orderId}</p>
                                    <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>
                                    <p><strong>Payment ID:</strong> {order.transactionId}</p>
                                </div>
                                <div>
                                    <span className={`order-status ${order.status === 'success' ? 'success' : ''}`}>
                                        {order.status === 'success' ? 'Completed' : order.status}
                                    </span>
                                </div>
                            </div>

                            <div className="order-items">
                                {order.items && order.items.map((item, index) => (
                                    <div key={index} className="order-item">
                                        <img src={item.image} alt={item.title} className="order-item-img" />
                                        <div className="order-item-details">
                                            <h4>{item.title}</h4>
                                            {item.size && <p>Size: {item.size}</p>}
                                            <p>Qty: {item.quantity} × {formatINR(item.price)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="order-total-row">
                                <h3>Total: {formatINR(order.amount)}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
