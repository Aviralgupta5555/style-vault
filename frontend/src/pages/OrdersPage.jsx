import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import api from '../api/axios'

const STATUS_COLORS = {
  PENDING: '#f59e0b',
  CONFIRMED: '#10b981',
  SHIPPED: '#3b82f6',
  DELIVERED: '#6366f1',
  CANCELLED: '#ef4444'
}

function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const newOrder = location.state?.newOrder

  useEffect(() => {
    api.get('/orders/my')
      .then(res => setOrders(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return <div className="orders-page"><div className="loading-spinner">Loading orders...</div></div>
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1>📦 My Orders</h1>

        {newOrder && (
          <div className="order-success-banner" id="order-success-banner">
            <span>🎉</span>
            <div>
              <strong>Order Placed Successfully!</strong>
              <p>Your order #{newOrder.id} has been confirmed. Thank you for shopping!</p>
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📦</span>
            <h3>No orders yet</h3>
            <p>You haven't placed any orders yet</p>
            <Link to="/products" className="btn-primary" id="orders-shop-btn">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-id">
                    <strong>Order #{order.id}</strong>
                    <span className="order-date">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="order-status" style={{ color: STATUS_COLORS[order.status] }}>
                    ● {order.status}
                  </div>
                </div>

                <div className="order-items-list">
                  {order.items?.map(item => (
                    <div key={item.id} className="order-item">
                      <img
                        src={item.product?.imageUrl}
                        alt={item.product?.name}
                        className="order-item-img"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/70x70/1a1a2e/f5a623?text=${encodeURIComponent(item.product?.brand || 'Item')}`
                        }}
                      />
                      <div className="order-item-info">
                        <span className="order-item-brand">{item.product?.brand}</span>
                        <span className="order-item-name">{item.product?.name}</span>
                        <span className="order-item-meta">Size: {item.selectedSize} × {item.quantity}</span>
                      </div>
                      <span className="order-item-price">{formatPrice(item.priceAtPurchase * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-address">
                    <span>📍 {order.shippingAddress}</span>
                  </div>
                  <div className="order-total-wrap">
                    <span className="payment-method">💳 {order.paymentMethod}</span>
                    <span className="order-total">Total: {formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersPage
