import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { addItem } from "../services/CartService";

const USD_TO_INR = 83;
const formatINR = (usd) => `₹${(usd * USD_TO_INR).toFixed(2)}`;

let ProductCard = ({ product }) => {
  const [qty, setQty] = useState(1);

  const increment = (e) => {
    e.preventDefault();
    setQty((q) => Math.min(99, q + 1));
  };

  const decrement = (e) => {
    e.preventDefault();
    setQty((q) => Math.max(1, q - 1));
  };

  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    const isAuth = localStorage.getItem('shopmartAuth') === 'true';
    if (!isAuth) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    addItem(product, qty);
    alert(`${product.title} added to cart (x${qty})`);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <Link to={`/product/${product.id}`} className="product-card-link">
          <img src={product.image} alt={product.title} />
        </Link>
      </div>

      <div className="product-info">
        <div className="product-title">
          <Link to={`/product/${product.id}`} className="product-card-link">
            <h3>{product.title}</h3>
          </Link>
        </div>

        <div className="product-meta">
          <p className="price">{formatINR(product.price)}</p>
          <p className="category">{product.category}</p>
        </div>

        <div className="product-controls">
          <div className="qty-controls">
            <button className="qty-btn" onClick={decrement}>-</button>
            <span className="qty-value">{qty}</span>
            <button className="qty-btn" onClick={increment}>+</button>
          </div>

          <button className="add-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard;
