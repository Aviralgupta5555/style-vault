import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'

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

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('')

  const selectedBrand = searchParams.get('brand') || ''
  const selectedCategory = searchParams.get('category') || ''
  const searchQuery = searchParams.get('search') || ''

  useEffect(() => {
    api.get('/products/brands').then(res => setBrands(res.data))
    api.get('/products/categories').then(res => setCategories(res.data))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (selectedBrand) params.brand = selectedBrand
    if (selectedCategory) params.category = selectedCategory
    if (searchQuery) params.search = searchQuery

    api.get('/products', { params })
      .then(res => setProducts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [selectedBrand, selectedCategory, searchQuery])

  const handleBrandFilter = (brand) => {
    const params = {}
    if (brand && brand !== selectedBrand) params.brand = brand
    if (selectedCategory) params.category = selectedCategory
    setSearchParams(params)
  }

  const handleCategoryFilter = (cat) => {
    const params = {}
    if (selectedBrand) params.brand = selectedBrand
    if (cat && cat !== selectedCategory) params.category = cat
    setSearchParams(params)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      setSearchParams({ search: searchInput.trim() })
    } else {
      setSearchParams({})
    }
  }

  const clearFilters = () => {
    setSearchParams({})
    setSearchInput('')
  }

  const hasFilters = selectedBrand || selectedCategory || searchQuery

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>All Products</h1>
        <p>Discover {products.length} items from the world's top brands</p>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products, brands..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="search-input"
            id="product-search-input"
          />
          <button type="submit" className="search-btn" id="search-submit-btn">🔍 Search</button>
          {hasFilters && (
            <button type="button" className="clear-btn" onClick={clearFilters} id="clear-filters-btn">
              ✕ Clear
            </button>
          )}
        </form>
      </div>

      <div className="products-layout">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar">
          <div className="filter-group">
            <h3>Brands</h3>
            <button
              className={`filter-btn ${!selectedBrand ? 'active' : ''}`}
              onClick={() => handleBrandFilter('')}
              id="filter-brand-all"
            >
              All Brands
            </button>
            {brands.map(brand => (
              <button
                key={brand}
                className={`filter-btn filter-btn-brand ${selectedBrand === brand ? 'active' : ''}`}
                onClick={() => handleBrandFilter(brand)}
                id={`filter-brand-${brand.replace(/[\s'&]+/g, '-').toLowerCase()}`}
              >
                {BRAND_LOGOS[brand] && (
                  <img
                    src={BRAND_LOGOS[brand]}
                    alt={brand}
                    className="filter-brand-logo"
                    onError={e => { e.target.style.display = 'none' }}
                  />
                )}
                <span>{brand}</span>
              </button>
            ))}
          </div>

          <div className="filter-group">
            <h3>Categories</h3>
            <button
              className={`filter-btn ${!selectedCategory ? 'active' : ''}`}
              onClick={() => handleCategoryFilter('')}
              id="filter-cat-all"
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategoryFilter(cat)}
                id={`filter-cat-${cat.replace(/\s+/g, '-').toLowerCase()}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </aside>

        {/* Products Grid */}
        <div className="products-main">
          {hasFilters && (
            <div className="active-filters">
              {selectedBrand && (
                <span className="filter-tag">
                  {BRAND_LOGOS[selectedBrand] && (
                    <img src={BRAND_LOGOS[selectedBrand]} alt={selectedBrand} className="tag-brand-logo" onError={e => { e.target.style.display='none' }} />
                  )}
                  {selectedBrand}
                  <button onClick={() => handleBrandFilter('')}>✕</button>
                </span>
              )}
              {selectedCategory && <span className="filter-tag">Category: {selectedCategory} <button onClick={() => handleCategoryFilter('')}>✕</button></span>}
              {searchQuery && <span className="filter-tag">Search: "{searchQuery}" <button onClick={clearFilters}>✕</button></span>}
            </div>
          )}

          {loading ? (
            <div className="products-grid">
              {[...Array(8)].map((_, i) => <div key={i} className="skeleton-card"></div>)}
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🔍</span>
              <h3>No products found</h3>
              <p>Try a different search or filter</p>
              <button className="btn-primary" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
