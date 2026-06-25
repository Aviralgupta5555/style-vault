import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import useAuthStore from '../store/authStore'

function RegisterPage() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/auth/register', {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        phone: form.phone,
        address: form.address
      })
      const { token, email, fullName, role, userId } = res.data
      login({ email, fullName, role, userId }, token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-brand">
          <span className="auth-logo">👕</span>
          <h1>StyleVault</h1>
        </div>

        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join millions of fashion lovers worldwide</p>

        {error && <div className="error-message" id="register-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" id="register-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="reg-fullname">Full Name *</label>
              <input
                id="reg-fullname"
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={form.fullName}
                onChange={e => setForm({...form, fullName: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg-phone">Phone</label>
              <input
                id="reg-phone"
                type="tel"
                className="form-input"
                placeholder="+91 9876543210"
                value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email Address *</label>
            <input
              id="reg-email"
              type="email"
              className="form-input"
              placeholder="your@email.com"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="reg-password">Password *</label>
              <input
                id="reg-password"
                type="password"
                className="form-input"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg-confirm-password">Confirm Password *</label>
              <input
                id="reg-confirm-password"
                type="password"
                className="form-input"
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={e => setForm({...form, confirmPassword: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-address">Default Address</label>
            <input
              id="reg-address"
              type="text"
              className="form-input"
              placeholder="Enter your address (optional)"
              value={form.address}
              onChange={e => setForm({...form, address: e.target.value})}
            />
          </div>

          <button
            type="submit"
            className="btn-auth"
            disabled={loading}
            id="register-submit-btn"
          >
            {loading ? '⏳ Creating Account...' : 'Create Account →'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login" id="goto-login-link">Sign in →</Link>
        </p>
      </div>

      <div className="auth-visual">
        <div className="auth-visual-content">
          <h2>Why StyleVault?</h2>
          <div className="auth-features">
            <div className="auth-feature">✅ 100% Authentic Products</div>
            <div className="auth-feature">🚚 Fast Free Delivery</div>
            <div className="auth-feature">↩️ 30-Day Easy Returns</div>
            <div className="auth-feature">🔒 Secure Payments</div>
            <div className="auth-feature">💬 24/7 Support</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
