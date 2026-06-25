import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import useAuthStore from '../store/authStore'

function CheckoutPage() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    shippingAddress: user?.address || '',
    paymentMethod: 'Cash on Delivery'
  })

  useEffect(() => {
    api.get('/cart')
      .then(res => {
        setCartItems(res.data)
        if (res.data.length === 0) navigate('/cart')
      })
      .catch(() => navigate('/cart'))
      .finally(() => setLoading(false))
  }, [])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const total = cartItems.reduce((sum, item) =>
    sum + (item.product.price * item.quantity), 0)

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    if (!form.shippingAddress.trim()) {
      alert('Please enter shipping address')
      return
    }
    setPlacing(true)
    try {
      const order = await api.post('/orders/place', form)
      navigate('/orders', { state: { newOrder: order.data } })
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  if (loading) {
    return <div className="checkout-page"><div className="loading-spinner">Loading...</div></div>
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>

        <div className="checkout-layout">
          {/* Form */}
          <div className="checkout-form-wrap">
            <form onSubmit={handlePlaceOrder} className="checkout-form" id="checkout-form">
              <h3>📦 Shipping Information</h3>

              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={user?.fullName || ''} readOnly className="form-input" />
              </div>

              <div className="form-group">
                <label htmlFor="shipping-address">Shipping Address *</label>
                <textarea
                  id="shipping-address"
                  className="form-input form-textarea"
                  placeholder="Enter your full address including city, state, pincode..."
                  value={form.shippingAddress}
                  onChange={e => setForm({...form, shippingAddress: e.target.value})}
                  required
                  rows={3}
                />
              </div>

              <h3>💳 Payment Method</h3>
              <div className="payment-options">
                {['Cash on Delivery', 'Net Banking', 'UPI'].map(method => (
                  <label key={method} className={`payment-option ${form.paymentMethod === method ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={form.paymentMethod === method}
                      onChange={e => setForm({...form, paymentMethod: e.target.value})}
                      id={`payment-${method.replace(/\s+/g, '-').toLowerCase()}`}
                    />
                    <span>{method === 'Cash on Delivery' ? '💵' : method === 'UPI' ? '📱' : '🏦'} {method}</span>
                  </label>
                ))}
              </div>

              <button
                type="submit"
                className="btn-place-order"
                disabled={placing}
                id="place-order-btn"
              >
                {placing ? '⏳ Placing Order...' : '✅ Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="checkout-summary">
            <h3>Order Summary</h3>
            <div className="checkout-items">
              {cartItems.map(item => (
                <div key={item.id} className="checkout-item">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="checkout-item-img"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/80x80/1a1a2e/f5a623?text=${encodeURIComponent(item.product.brand)}`
                    }}
                  />
                  <div className="checkout-item-info">
                    <div className="checkout-item-name">{item.product.name}</div>
                    <div className="checkout-item-meta">Size: {item.selectedSize} × {item.quantity}</div>
                    <div className="checkout-item-price">{formatPrice(item.product.price * item.quantity)}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="checkout-total">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{total >= 2999 ? 'FREE' : formatPrice(99)}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row summary-total">
                <span>Grand Total</span>
                <span>{formatPrice(total >= 2999 ? total : total + 99)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
