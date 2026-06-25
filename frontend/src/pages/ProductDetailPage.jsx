import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import useAuthStore from '../store/authStore'

function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => {
        setProduct(res.data)
        const sizes = res.data.sizes?.split(',') || []
        if (sizes.length > 0) setSelectedSize(sizes[0])
      })
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false))
  }, [id])

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

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (!selectedSize) {
      alert('Please select a size')
      return
    }
    setAdding(true)
    try {
      await api.post('/cart/add', {
        productId: product.id,
        quantity,
        selectedSize
      })
      setAdded(true)
      setTimeout(() => setAdded(false), 3000)
    } catch (err) {
      alert('Failed to add to cart')
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="detail-skeleton">
          <div className="skeleton-img"></div>
          <div className="skeleton-info">
            <div className="skeleton-line"></div>
            <div className="skeleton-line short"></div>
            <div className="skeleton-line"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  const sizes = product.sizes?.split(',').map(s => s.trim()) || []

  return (
    <div className="product-detail-page">
      <div className="detail-container">
        {/* Image */}
        <div className="detail-image-wrap">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="detail-image"
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/600x600/1a1a2e/f5a623?text=${encodeURIComponent(product.brand)}`
            }}
          />
          {product.featured && <div className="detail-badge">⭐ Featured</div>}
        </div>

        {/* Info */}
        <div className="detail-info">
          <span className="detail-brand">{product.brand}</span>
          <h1 className="detail-name">{product.name}</h1>

          <div className="detail-rating">
            <span className="stars">{renderStars(product.rating)}</span>
            <span className="rating-text">{product.rating} ({product.reviewCount} reviews)</span>
          </div>

          <div className="detail-price">{formatPrice(product.price)}</div>

          <p className="detail-description">{product.description}</p>

          <div className="detail-color">
            <span className="detail-label">Color:</span>
            <span className="color-value">{product.color}</span>
          </div>

          {/* Size Selector */}
          {sizes.length > 0 && (
            <div className="size-selector">
              <span className="detail-label">Size:</span>
              <div className="size-options">
                {sizes.map(size => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'size-active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                    id={`size-${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="quantity-selector">
            <span className="detail-label">Quantity:</span>
            <div className="qty-controls">
              <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))} id="qty-decrease">−</button>
              <span className="qty-value">{quantity}</span>
              <button className="qty-btn" onClick={() => setQuantity(q => Math.min(10, q + 1))} id="qty-increase">+</button>
            </div>
          </div>

          {/* Actions */}
          <div className="detail-actions">
            <button
              className={`btn-detail-cart ${added ? 'btn-added' : ''}`}
              onClick={handleAddToCart}
              disabled={adding}
              id="detail-add-cart-btn"
            >
              {adding ? '⏳ Adding...' : added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
            </button>
            <button
              className="btn-detail-buy"
              onClick={async () => {
                await handleAddToCart()
                navigate('/cart')
              }}
              disabled={adding}
              id="detail-buy-now-btn"
            >
              ⚡ Buy Now
            </button>
          </div>

          <div className="detail-features">
            <div className="detail-feature">🚚 Free shipping on orders above ₹2,999</div>
            <div className="detail-feature">↩️ 30-day easy returns</div>
            <div className="detail-feature">✓ {product.stockQuantity} in stock</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
