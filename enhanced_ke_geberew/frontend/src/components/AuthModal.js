import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('farmer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    national_id: '',
    license_number: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/auth/login.php' : '/auth/register.php';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password, role }
        : { ...formData, role };

      const response = await axios.post(`${API_BASE_URL}${endpoint}`, payload);

      if (isLogin) {
        login(response.data.user, response.data.token);
        
        // Navigate to appropriate dashboard
        switch(role) {
          case 'farmer':
            navigate('/farmer/dashboard');
            break;
          case 'buyer':
            navigate('/buyer/dashboard');
            break;
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'driver':
            navigate('/driver/dashboard');
            break;
          default:
            navigate('/');
        }
        
        onClose();
      } else {
        // After registration, switch to login
        setIsLogin(true);
        setError('Registration successful! Please login.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      location: '',
      national_id: '',
      license_number: ''
    });
    setError('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        
        <div className="role-selector">
          <label>Select Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="farmer">Farmer</option>
            <option value="buyer">Buyer/Merchant</option>
            <option value="admin">Admin</option>
            <option value="driver">Driver</option>
          </select>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {!isLogin && (role === 'farmer' || role === 'buyer') && (
            <div className="form-group">
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          )}

          {!isLogin && role === 'driver' && (
            <>
              <div className="form-group">
                <input
                  type="text"
                  name="national_id"
                  placeholder="National ID"
                  value={formData.national_id}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="license_number"
                  placeholder="License Number"
                  value={formData.license_number}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <p className="toggle-mode">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={toggleMode}>
            {isLogin ? 'Register' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
