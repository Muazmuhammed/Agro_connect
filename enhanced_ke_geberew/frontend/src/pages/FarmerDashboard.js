import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import '../styles/Dashboard.css';

const FarmerDashboard = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    price: '',
    location: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/get_all.php`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/get_user_orders.php`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/products/create.php`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setFormData({
        name: '',
        category: '',
        quantity: '',
        price: '',
        location: ''
      });
      setShowAddProduct(false);
      fetchProducts();
      alert('Product added successfully!');
    } catch (error) {
      alert('Error adding product: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <div className="dashboard">
      <Navbar />
      
      <div className="dashboard-container">
        <h1>Farmer Dashboard</h1>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>My Products</h2>
            <button 
              className="btn-primary" 
              onClick={() => setShowAddProduct(!showAddProduct)}
            >
              {showAddProduct ? 'Cancel' : 'Add Product'}
            </button>
          </div>

          {showAddProduct && (
            <div className="form-card">
              <h3>Add New Product</h3>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  required
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price (ETB)"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
                <button type="submit" className="btn-primary">Add Product</button>
              </form>
            </div>
          )}

          <div className="products-grid">
            {products.length === 0 ? (
              <p>No products yet. Add your first product!</p>
            ) : (
              products.map((product) => (
                <div key={product.product_id} className="product-card">
                  <h3>{product.name}</h3>
                  <p className="category">{product.category}</p>
                  <p className="price">{product.price} ETB</p>
                  <p className="quantity">Quantity: {product.quantity}</p>
                  <p className="location">📍 {product.location}</p>
                  <span className={`status ${product.status}`}>{product.status}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Recent Orders</h2>
          <div className="orders-list">
            {orders.length === 0 ? (
              <p>No orders yet.</p>
            ) : (
              orders.map((order) => (
                <div key={order.order_id} className="order-card">
                  <div className="order-header">
                    <h3>{order.product_name}</h3>
                    <span className={`status ${order.status}`}>{order.status}</span>
                  </div>
                  <p>Buyer: {order.buyer_name}</p>
                  <p>Quantity: {order.quantity}</p>
                  <p>Total: {order.total_price} ETB</p>
                  <p className="order-date">
                    {new Date(order.order_date).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
