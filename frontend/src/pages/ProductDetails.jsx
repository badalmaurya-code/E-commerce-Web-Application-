import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getProductById } from '../services/Api'
import { addItem } from '../services/CartService'

const USD_TO_INR = 83;
const formatINR = (usd) => `₹${(usd * USD_TO_INR).toFixed(2)}`;

const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL']
const TAB_OPTIONS = [
  { key: 'description', label: 'Description' },
  { key: 'specs', label: 'Specifications' },
]

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate();
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('M')
  const [activeTab, setActiveTab] = useState('description')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id)
        setProduct(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  useEffect(() => {
    if (!message) return
    const timeout = window.setTimeout(() => setMessage(''), 2800)
    return () => window.clearTimeout(timeout)
  }, [message])

  const handleQuantityChange = (step) => {
    setQuantity((current) => Math.max(1, Math.min(99, current + step)))
  }

  const isClothing = product?.category?.toLowerCase().includes('clothing')

  const handleAddToCart = () => {
    const isAuth = localStorage.getItem('shopmartAuth') === 'true';
    if (!isAuth) {
      navigate('/login', { state: { from: `/product/${product.id}` } });
      return;
    }
    if (isClothing) {
      addItem(product, quantity, selectedSize)
      setMessage(`${product.title} (${selectedSize}) added to cart — x${quantity}`)
    } else {
      addItem(product, quantity)
      setMessage(`${product.title} added to cart — x${quantity}`)
    }
  }

  const renderStars = () => {
    const rate = product.rating?.rate ?? 0
    const filled = Math.round(rate)
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={index < filled ? 'star filled' : 'star'}>
        ★
      </span>
    ))
  }

  const productSpecs = [
    { label: 'SKU', value: `PRD-${String(product?.id || '').padStart(4, '0')}` },
    { label: 'Category', value: product?.category },
    { label: 'Material', value: product?.category?.includes('clothing') ? 'Premium Cotton Blend' : product?.category === 'jewelery' ? 'Stainless Steel' : 'High-Quality Polymer' },
    { label: 'Fit', value: 'Regular' },
    { label: 'Shipping', value: 'Free over ₹4,150' },
    { label: 'Availability', value: 'In stock' },
    { label: 'Delivery', value: '2-4 business days' },
  ]

  if (loading) {
    return <h2 className='loader'><i className='fa-solid fa-spinner fa-lg'></i></h2>
  }

  if (error) {
    return <h2>Error: {error}</h2>
  }

  if (!product) {
    return <h2>Product not found</h2>
  }

  return (
    <div className='cart-container'>
      <div className='cart-header-row'>
        <Link to='/' className='back-button'>
          <i className='fa-solid fa-arrow-left'></i>
          Back to shop
        </Link>
        <Link to='/cart' className='back-button'>
          <i className='fa-solid fa-cart-shopping'></i>
          View Cart
        </Link>
      </div>

      <div className='product-details'>
        <div className='detail-image'>
          <img src={product.image} alt={product.title} />
        </div>

        <div className='detail-content'>
          <div className='detail-title-row'>
            <div>
              <h2>{product.title}</h2>
              <p className='detail-subtitle'>A premium pick in the {product.category} collection.</p>
            </div>
            <span className='category-badge'>{product.category}</span>
          </div>

          <div className='detail-data-grid'>
            <div className='detail-data-item'>
              <span>Price</span>
              <strong>{formatINR(product.price)}</strong>
            </div>
            <div className='detail-data-item'>
              <span>Rating</span>
              <strong>{product.rating?.rate?.toFixed(1) ?? '0.0'} / 5</strong>
            </div>
            <div className='detail-data-item'>
              <span>Reviews</span>
              <strong>{product.rating?.count ?? 0}</strong>
            </div>
            {isClothing && (
              <div className='detail-data-item'>
                <span>Selected size</span>
                <strong>{selectedSize}</strong>
              </div>
            )}
          </div>

          <div className='product-spec-tabs'>
            {TAB_OPTIONS.map((tab) => (
              <button
                key={tab.key}
                type='button'
                className={`tab-pill ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className='product-tab-panel'>
            {activeTab === 'description' ? (
              <p className='product-description'>{product.description}</p>
            ) : (
              <div className='spec-list'>
                {productSpecs.map((spec) => (
                  <div key={spec.label} className='spec-row'>
                    <span>{spec.label}</span>
                    <strong>{spec.value}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className='detail-actions'>
            <div>
              {isClothing && (
                <div className='size-selector'>
                  {SIZE_OPTIONS.map((size) => (
                    <button
                      key={size}
                      type='button'
                      className={`size-pill ${selectedSize === size ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}

              <div className='quantity-row detail-qty-row'>
                <button
                  type='button'
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className='qty-btn detail-qty-btn'
                >
                  -
                </button>
                <span className='qty-value detail-qty-value'>{quantity}</span>
                <button
                  type='button'
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 99}
                  className='qty-btn detail-qty-btn'
                >
                  +
                </button>
              </div>
            </div>

            <button type='button' className='add-cart-btn detail-add-btn' onClick={handleAddToCart}>
              <i className='fa-solid fa-cart-plus'></i>
              Add to cart
            </button>
          </div>

          {message && <div className='toast-message'>{message}</div>}
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
