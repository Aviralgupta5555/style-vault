import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

function CartPage() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchCart = () => {
    api.get('/cart')
      .then(res => setCartItems(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchCart() }, [])

  const updateQuantity = async (itemId, quantity) => {
    try {
      await api.put(`/cart/update/${itemId}`, null, { params: { quantity } })
      fetchCart()
    } catch (err) {
      console.error(err)
    }
  }

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/cart/remove/${itemId}`)
      fetchCart()
    } catch (err) {
      console.error(err)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const total = cartItems.reduce((sum, item) =>
    sum + (item.product.price * item.quantity), 0)

  if (loading) {
    return <div className="cart-page"><div className="loading-spinner">Loading cart...</div></div>
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-title">🛒 My Cart</h1>

        {cartItems.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🛒</span>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything yet</p>
            <Link to="/products" className="btn-primary" id="cart-shop-btn">Start Shopping</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {cartItems.map(item => (
                <div className="cart-item" key={item.id}>
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="cart-item-img"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/100x100/1a1a2e/f5a623?text=${encodeURIComponent(item.product.brand)}`
                    }}
                  />
                  <div className="cart-item-info">
                    <span className="cart-item-brand">{item.product.brand}</span>
                    <h3 className="cart-item-name">{item.product.name}</h3>
                    <span className="cart-item-size">Size: {item.selectedSize}</span>
                    <span className="cart-item-price">{formatPrice(item.product.price)}</span>
                  </div>
                  <div className="cart-item-controls">
                    <div className="qty-controls">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        id={`cart-qty-decrease-${item.id}`}
                      >−</button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        id={`cart-qty-increase-${item.id}`}
                      >+</button>
                    </div>
                    <div className="cart-item-total">{formatPrice(item.product.price * item.quantity)}</div>
                    <button
                      className="btn-remove"
                      onClick={() => removeItem(item.id)}
                      id={`cart-remove-${item.id}`}
                    >🗑️ Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free-shipping">{total >= 2999 ? 'FREE' : formatPrice(99)}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>{formatPrice(total >= 2999 ? total : total + 99)}</span>
              </div>
              {total < 2999 && (
                <div className="shipping-notice">
                  Add {formatPrice(2999 - total)} more for FREE shipping!
                </div>
              )}
              <button
                className="btn-checkout"
                onClick={() => navigate('/checkout')}
                id="proceed-checkout-btn"
              >
                Proceed to Checkout →
              </button>
              <Link to="/products" className="continue-shopping" id="continue-shopping-link">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage
