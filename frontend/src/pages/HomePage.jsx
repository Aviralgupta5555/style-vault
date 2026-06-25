import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'

const BRANDS = [
  { name: 'Nike',         logo: 'https://logo.clearbit.com/nike.com',         query: 'Nike'         },
  { name: 'Adidas',       logo: 'https://logo.clearbit.com/adidas.com',       query: 'Adidas'       },
  { name: 'Zara',         logo: 'https://logo.clearbit.com/zara.com',         query: 'Zara'         },
  { name: 'H&M',          logo: 'https://logo.clearbit.com/hm.com',           query: 'H%26M'        },
  { name: "Levi's",       logo: 'https://logo.clearbit.com/levi.com',         query: 'Levis'        },
  { name: 'Puma',         logo: 'https://logo.clearbit.com/puma.com',         query: 'Puma'         },
  { name: 'Gucci',        logo: 'https://logo.clearbit.com/gucci.com',        query: 'Gucci'        },
  { name: 'Ralph Lauren', logo: 'https://logo.clearbit.com/ralphlauren.com',  query: 'Ralph+Lauren' },
]

function HomePage() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/products/featured')
      .then(res => setFeatured(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <div className="hero-badge">🌟 Premium Fashion Destination</div>
          <h1 className="hero-title">
            Dress to <span className="hero-accent">Impress</span>
          </h1>
          <p className="hero-subtitle">
            Explore the world's finest clothing brands — Nike, Adidas, Gucci, Zara &amp; more.
            Authentic products, delivered to your door.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn-hero-primary" id="hero-shop-btn">
              Shop Now →
            </Link>
            <Link to="/register" className="btn-hero-secondary" id="hero-join-btn">
              Join Free
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">76+</span>
              <span className="stat-label">Products</span>
            </div>
            <div className="stat">
              <span className="stat-number">8</span>
              <span className="stat-label">Brands</span>
            </div>
            <div className="stat">
              <span className="stat-number">100%</span>
              <span className="stat-label">Authentic</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <span>👗</span>
            <p>New Arrivals</p>
          </div>
          <div className="floating-card card-2">
            <span>🚚</span>
            <p>Free Shipping</p>
          </div>
          <div className="floating-card card-3">
            <span>↩️</span>
            <p>Easy Returns</p>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="brands-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Shop by Brand</h2>
            <p>Discover your favorite premium brands</p>
          </div>
          <div className="brands-grid">
            {BRANDS.map(brand => (
              <Link
                key={brand.name}
                to={`/products?brand=${brand.query}`}
                className="brand-card"
                id={`brand-${brand.name.replace(/[\s'&]+/g, '-').toLowerCase()}`}
              >
                <div className="brand-logo-wrap">
                  <img
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    className="brand-logo-img"
                    onError={e => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <span className="brand-logo-fallback" style={{ display: 'none' }}>
                    {brand.name.charAt(0)}
                  </span>
                </div>
                <span className="brand-name">{brand.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="section-container">
          <div className="section-header">
            <div>
              <h2>Featured Products</h2>
              <p style={{ marginTop: 4, color: 'var(--text-muted)', fontSize: 15 }}>
                Hand-picked across all brands
              </p>
            </div>
            <Link to="/products" className="see-all-link">See All →</Link>
          </div>
          {loading ? (
            <div className="products-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton-card"></div>
              ))}
            </div>
          ) : (
            <div className="products-grid">
              {featured.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Banner */}
      <section className="features-section">
        <div className="section-container">
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">🚚</span>
              <h4>Free Shipping</h4>
              <p>On orders above ₹2,999</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">↩️</span>
              <h4>Easy Returns</h4>
              <p>30-day hassle-free returns</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <h4>Secure Payment</h4>
              <p>100% safe &amp; encrypted</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💬</span>
              <h4>24/7 Support</h4>
              <p>Always here to help</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
