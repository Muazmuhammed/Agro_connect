import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';
import '../styles/Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, categoryFilter, products]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/get_all.php`);
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(product =>
        product.category === categoryFilter
      );
    }

    setFilteredProducts(filtered);
  };

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="products-page">
      <Navbar onOpenAuth={() => setShowAuth(true)} />
      
      <div className="products-container">
        <h1>Available Products</h1>

        <div className="filters">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="category-select"
          >
            <option value="">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <p className="no-products">No products found.</p>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.product_id} className="product-card">
                <div className="product-image">
                  <span className="product-icon">🌾</span>
                </div>
                <h3>{product.name}</h3>
                <p className="category">{product.category}</p>
                <p className="price">{product.price} ETB</p>
                <p className="quantity">Available: {product.quantity}</p>
                <p className="location">📍 {product.location}</p>
                <p className="farmer">Farmer: {product.farmer_name}</p>
                <button 
                  className="btn-primary"
                  onClick={() => setShowAuth(true)}
                >
                  Order Now
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
};

export default Products;
