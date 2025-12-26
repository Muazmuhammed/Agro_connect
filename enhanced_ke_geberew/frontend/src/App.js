import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './i18n/i18n'; // Initialize i18n

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DriverDashboard from './pages/DriverDashboard';
import Products from './pages/Products';
import PrivateRoute from './components/PrivateRoute';

import './styles/App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/products" element={<Products />} />
              
              {/* Protected Routes */}
              <Route 
                path="/farmer/dashboard" 
                element={
                  <PrivateRoute role="farmer">
                    <FarmerDashboard />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/buyer/dashboard" 
                element={
                  <PrivateRoute role="buyer">
                    <BuyerDashboard />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/admin/dashboard" 
                element={
                  <PrivateRoute role="admin">
                    <AdminDashboard />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/driver/dashboard" 
                element={
                  <PrivateRoute role="driver">
                    <DriverDashboard />
                  </PrivateRoute>
                } 
              />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
