import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import useAuthStore from '../store/authStore'

const BRAND_LOGOS = {
  'Nike':         'https://logo.clearbit.com/nike.com',
  'Adidas':       'https://logo.clearbit.com/adidas.com',
  'Zara':         'https://logo.clearbit.com/zara.com',
  'H&M':          'https://logo.clearbit.com/hm.com',
  'Levis':        'https://logo.clearbit.com/levi.com',
  'Puma':         'https://logo.clearbit.com/puma.com',
  'Gucci':        'https://logo.clearbit.com/gucci.com',
  'Ralph Lauren': 'https://logo.clearbit.com/ralphlauren.com',
}

function ProductCard({ product }) {
  const { isAuthenticated } = useAuthStore()
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      window.location.href = '/login'
      return
    }
    setAdding(true)
    try {
      await api.post('/cart/add', {
        productId: product.id,
        quantity: 1,
        selectedSize: 'M'
      })
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch (err) {
      console.error('Add to cart failed', err)
    } finally {
      setAdding(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const renderStars = (rating) => {
    return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating))
  }

  const brandLogo = BRAND_LOGOS[product.brand]

  return (
    <div className={`product-card ${product.featured ? 'featured' : ''}`}>
      <Link to={`/products/${product.id}`} className="product-card-link">
        <div className="product-image-wrap">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-image"
            onError={(e) => {
              e.target.src = `https://placehold.co/400x400/1a1a2e/f5a623?text=${encodeURIComponent(product.brand)}`
            }}
          />
          {product.featured && <span className="badge-featured">⭐ Featured</span>}
          {/* Brand logo watermark on image */}
          {brandLogo && (
            <div className="card-brand-logo-wrap">
              <img
                src={brandLogo}
                alt={product.brand}
                className="card-brand-logo"
                onError={e => { e.target.parentNode.style.display = 'none' }}
              />
            </div>
          )}
          <div className="product-overlay">
            <span className="view-text">View Details</span>
          </div>
        </div>

        <div className="product-info">
          <div className="product-brand-row">
            {brandLogo ? (
              <div className="product-brand-logo-mini">
                <img
                  src={brandLogo}
                  alt={product.brand}
                  className="brand-logo-mini-img"
                  onError={e => { e.target.parentNode.style.display = 'none' }}
                />
              </div>
            ) : null}
            <span className="product-brand">{product.brand}</span>
          </div>
          <h3 className="product-name">{product.name}</h3>
          <div className="product-rating">
            <span className="stars">{renderStars(product.rating)}</span>
            <span className="review-count">({product.reviewCount})</span>
          </div>
          <div className="product-bottom">
            <span className="product-price">{formatPrice(product.price)}</span>
            <span className="product-category">{product.category}</span>
          </div>
        </div>
      </Link>

      <button
        className={`btn-add-cart ${added ? 'btn-added' : ''}`}
        onClick={handleAddToCart}
        disabled={adding}
        id={`add-cart-${product.id}`}
      >
        {adding ? '⏳ Adding...' : added ? '✓ Added!' : '🛒 Add to Cart'}
      </button>
    </div>
  )
}

export default ProductCard
