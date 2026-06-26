import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'

const BRAND_LOGOS = {
  Nike: 'https://logo.clearbit.com/nike.com',
  Adidas: 'https://logo.clearbit.com/adidas.com',
  Zara: 'https://logo.clearbit.com/zara.com',
  'H&M': 'https://logo.clearbit.com/hm.com',
  Levis: 'https://logo.clearbit.com/levi.com',
  Puma: 'https://logo.clearbit.com/puma.com',
  Gucci: 'https://logo.clearbit.com/gucci.com',
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

  // -------------------------
  // Load Brands & Categories
  // -------------------------
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [brandsRes, categoriesRes] = await Promise.all([
          api.get('/products/brands'),
          api.get('/products/categories'),
        ])

        setBrands(brandsRes.data)
        setCategories(categoriesRes.data)
      } catch (err) {
        console.error('Error loading filters:', err)

        if (err.response) {
          console.log(err.response.data)
          console.log(err.response.status)
        }
      }
    }

    loadFilters()
  }, [])

  // -------------------------
  // Load Products
  // -------------------------
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)

      try {
        const params = {}

        if (selectedBrand) params.brand = selectedBrand
        if (selectedCategory) params.category = selectedCategory
        if (searchQuery) params.search = searchQuery

        const res = await api.get('/products', { params })

        console.log('Products API Response:', res.data)

        setProducts(Array.isArray(res.data) ? res.data : [])
      } catch (err) {
        console.error('Products Error:', err)

        if (err.response) {
          console.log(err.response.data)
          console.log(err.response.status)
        }

        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
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

  const hasFilters =
    selectedBrand || selectedCategory || searchQuery

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>All Products</h1>

        <p>
          Discover {products.length} items from the world's top brands
        </p>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products, brands..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
          />

          <button type="submit" className="search-btn">
            🔍 Search
          </button>

          {hasFilters && (
            <button
              type="button"
              className="clear-btn"
              onClick={clearFilters}
            >
              ✕ Clear
            </button>
          )}
        </form>
      </div>

      <div className="products-layout">

        <aside className="filters-sidebar">

          <div className="filter-group">
            <h3>Brands</h3>

            <button
              className={`filter-btn ${!selectedBrand ? 'active' : ''
                }`}
              onClick={() => handleBrandFilter('')}
            >
              All Brands
            </button>

            {brands.map((brand) => (
              <button
                key={brand}
                className={`filter-btn ${selectedBrand === brand ? 'active' : ''
                  }`}
                onClick={() => handleBrandFilter(brand)}
              >
                {BRAND_LOGOS[brand] && (
                  <img
                    src={BRAND_LOGOS[brand]}
                    alt={brand}
                    className="filter-brand-logo"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                )}

                {brand}
              </button>
            ))}
          </div>

          <div className="filter-group">
            <h3>Categories</h3>

            <button
              className={`filter-btn ${!selectedCategory ? 'active' : ''
                }`}
              onClick={() => handleCategoryFilter('')}
            >
              All Categories
            </button>

            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''
                  }`}
                onClick={() => handleCategoryFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

        </aside>

        <div className="products-main">

          {loading ? (
            <h2>Loading products...</h2>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <h2>No products found</h2>

              <button
                className="btn-primary"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  )
}

export default ProductsPage