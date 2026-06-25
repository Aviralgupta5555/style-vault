import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import useAuthStore from '../store/authStore'

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      const { token, email, fullName, role, userId } = res.data
      login({ email, fullName, role, userId }, token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-logo">👕</span>
          <h1>StyleVault</h1>
        </div>

        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your account to continue shopping</p>

        {error && <div className="error-message" id="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" id="login-form">
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="your@email.com"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-auth"
            disabled={loading}
            id="login-submit-btn"
          >
            {loading ? '⏳ Signing in...' : 'Sign In →'}
          </button>
        </form>

        <div className="auth-divider"><span>OR</span></div>

        <div className="demo-credentials">
          <p>🧪 Demo: Register a new account to get started!</p>
        </div>

        <p className="auth-switch">
          Don't have an account?{' '}
          <Link to="/register" id="goto-register-link">Create one free →</Link>
        </p>
      </div>

      <div className="auth-visual">
        <div className="auth-visual-content">
          <h2>Shop Premium Brands</h2>
          <p>Nike • Adidas • Gucci • Zara • and more</p>
          <div className="auth-brand-badges">
            {['⚡ Nike', '🔱 Adidas', '💎 Gucci', '✨ Zara', '👖 Levi\'s', '🐆 Puma'].map(b => (
              <span key={b} className="auth-badge">{b}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
