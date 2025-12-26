import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import '../styles/Dashboard.css';

const BuyerDashboard = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

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

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/get_all.php`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleOrder = async (productId) => {
    try {
      await axios.post(`${API_BASE_URL}/orders/create.php`, {
        product_id: productId,
        quantity: quantity,
        transport_cost: 50.00
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Order placed successfully!');
      setSelectedProduct(null);
      setQuantity(1);
      fetchOrders();
      fetchProducts();
    } catch (error) {
      alert('Error placing order: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <div className="dashboard">
      <Navbar />
      
      <div className="dashboard-container">
        <h1>Buyer Dashboard</h1>

        <div className="dashboard-section">
          <h2>Available Products</h2>
          <div className="products-grid">
            {products.length === 0 ? (
              <p>No products available at the moment.</p>
            ) : (
              products.map((product) => (
                <div key={product.product_id} className="product-card">
                  <h3>{product.name}</h3>
                  <p className="category">{product.category}</p>
                  <p className="price">{product.price} ETB</p>
                  <p className="quantity">Available: {product.quantity}</p>
                  <p className="location">📍 {product.location}</p>
                  <p className="farmer">Farmer: {product.farmer_name}</p>
                  
                  {selectedProduct === product.product_id ? (
                    <div className="order-form">
                      <input
                        type="number"
                        min="1"
                        max={product.quantity}
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                      <button 
                        className="btn-primary" 
                        onClick={() => handleOrder(product.product_id)}
                      >
                        Confirm Order
                      </button>
                      <button 
                        className="btn-secondary" 
                        onClick={() => setSelectedProduct(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="btn-primary" 
                      onClick={() => setSelectedProduct(product.product_id)}
                      disabled={product.quantity === 0}
                    >
                      Order Now
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>My Orders</h2>
          <div className="orders-list">
            {orders.length === 0 ? (
              <p>No orders yet. Browse products and place your first order!</p>
            ) : (
              orders.map((order) => (
                <div key={order.order_id} className="order-card">
                  <div className="order-header">
                    <h3>{order.product_name}</h3>
                    <span className={`status ${order.status}`}>{order.status}</span>
                  </div>
                  <p>Farmer: {order.farmer_name}</p>
                  <p>Quantity: {order.quantity}</p>
                  <p>Total Price: {order.total_price} ETB</p>
                  <p>Transport Cost: {order.transport_cost} ETB</p>
                  <p className="order-date">
                    Ordered on: {new Date(order.order_date).toLocaleDateString()}
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

export default BuyerDashboard;
