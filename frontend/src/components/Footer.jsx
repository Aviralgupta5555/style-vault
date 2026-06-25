import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3>👕 StyleVault</h3>
          <p>Your premium destination for the world's finest clothing brands. Shop the latest trends from Nike, Adidas, Zara, and more.</p>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Instagram">📷</a>
            <a href="#" className="social-link" aria-label="Twitter">🐦</a>
            <a href="#" className="social-link" aria-label="Facebook">📘</a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Shop</h4>
          <ul>
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/products?brand=Nike">Nike</Link></li>
            <li><Link to="/products?brand=Adidas">Adidas</Link></li>
            <li><Link to="/products?brand=Zara">Zara</Link></li>
            <li><Link to="/products?brand=Gucci">Gucci</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Categories</h4>
          <ul>
            <li><Link to="/products?category=T-Shirts">T-Shirts</Link></li>
            <li><Link to="/products?category=Jeans">Jeans</Link></li>
            <li><Link to="/products?category=Shoes">Shoes</Link></li>
            <li><Link to="/products?category=Dresses">Dresses</Link></li>
            <li><Link to="/products?category=Jackets">Jackets</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Account</h4>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/orders">My Orders</Link></li>
            <li><Link to="/cart">My Cart</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 StyleVault. All rights reserved. Made with ❤️</p>
        <p>Secure payments • Free shipping over ₹2999 • Easy returns</p>
      </div>
    </footer>
  )
}

export default Footer
