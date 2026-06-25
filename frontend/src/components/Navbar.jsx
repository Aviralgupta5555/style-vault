import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import api from '../api/axios'

function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [cartCount, setCartCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/cart').then(res => setCartCount(res.data.length)).catch(() => {})
    } else {
      setCartCount(0)
    }
  }, [isAuthenticated, location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">👕</span>
          <span className="logo-text">StyleVault</span>
        </Link>

        <div className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/products" className="nav-link" onClick={() => setMenuOpen(false)}>Shop</Link>
          {isAuthenticated && (
            <Link to="/orders" className="nav-link" onClick={() => setMenuOpen(false)}>Orders</Link>
          )}
        </div>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <Link to="/cart" className="cart-btn" id="cart-icon-btn">
                🛒
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
              <div className="user-menu">
                <span className="user-name">Hi, {user?.fullName?.split(' ')[0]}</span>
                <button onClick={handleLogout} className="btn-logout" id="logout-btn">Logout</button>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-nav-login" id="login-nav-btn">Login</Link>
              <Link to="/register" className="btn-nav-register" id="register-nav-btn">Sign Up</Link>
            </div>
          )}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} id="hamburger-btn">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
