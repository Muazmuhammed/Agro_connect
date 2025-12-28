import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';
import Chatbot from '../components/Chatbot';
import '../styles/Home.css';

const Home = () => {
  const { t } = useTranslation();
  const [showAuth, setShowAuth] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalDeliveries: 0
  });
  const [countersVisible, setCountersVisible] = useState(false);

  useEffect(() => {
    // Fetch live statistics from database
    fetchStats();
    
    // Setup scroll listener for counter animation
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stats/get_stats.php`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback to zero if API fails
      setStats({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalDeliveries: 0
      });
    }
  };

  const handleScroll = () => {
    const statsSection = document.getElementById('stats-section');
    if (statsSection) {
      const rect = statsSection.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
      if (isVisible && !countersVisible) {
        setCountersVisible(true);
        animateCounters();
      }
    }
  };

  const animateCounters = () => {
    const duration = 2000; // 2 seconds
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);

    Object.keys(stats).forEach(key => {
      let frame = 0;
      const countTo = stats[key];
      
      const counter = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const currentCount = Math.round(countTo * progress);
        
        const element = document.getElementById(key);
        if (element) {
          element.textContent = currentCount.toLocaleString();
        }
        
        if (frame === totalFrames) {
          clearInterval(counter);
        }
      }, frameDuration);
    });
  };

  return (
    <div className="home">
      <Navbar onOpenAuth={() => setShowAuth(true)} />
      
      <section className="hero">
        <div className="hero-background"></div>
        <div className="hero-content">
          <h1>{t('home.welcome')}</h1>
          <p className="hero-subtitle">{t('home.subtitle')}</p>
          <p className="hero-description">
            {t('home.description')}
          </p>
          <button className="btn-hero" onClick={() => setShowAuth(true)}>
            {t('home.getStarted')}
          </button>
        </div>
      </section>

      {/* Live Statistics Section */}
      <section className="stats-section" id="stats-section">
        <div className="container">
          <h2>{t('home.ourSuccess')}</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">👥</div>
              <div className="stat-number" id="totalUsers">0</div>
              <div className="stat-label">{t('home.users')}</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🌾</div>
              <div className="stat-number" id="totalProducts">0</div>
              <div className="stat-label">{t('home.products')}</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">📦</div>
              <div className="stat-number" id="totalOrders">0</div>
              <div className="stat-label">{t('home.orders')}</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🚚</div>
              <div className="stat-number" id="totalDeliveries">0</div>
              <div className="stat-label">{t('home.deliveries')}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>{t('home.platformTitle')}</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌾</div>
              <h3>{t('home.forFarmers')}</h3>
              <p>{t('home.forFarmersDesc')}</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🛒</div>
              <h3>{t('home.forBuyers')}</h3>
              <p>{t('home.forBuyersDesc')}</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>{t('home.logistics')}</h3>
              <p>{t('home.logisticsDesc')}</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>{t('home.securePayment')}</h3>
              <p>{t('home.securePaymentDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>{t('home.joinToday')}</h2>
          <p>{t('home.startSelling')}</p>
          <button className="btn-cta" onClick={() => setShowAuth(true)}>
            {t('home.registerNow')}
          </button>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>{t('home.welcome').split(' ')[2] + ' ' + t('home.welcome').split(' ')[3]}</h3>
              <p>{t('footer.description')}</p>
            </div>
            <div className="footer-section">
              <h3>{t('footer.links')}</h3>
              <ul>
                <li><Link to="/about">{t('nav.about')}</Link></li>
                <li><Link to="/contact">{t('nav.contact')}</Link></li>
                <li><Link to="/products">{t('nav.products')}</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>{t('footer.help')}</h3>
              <ul>
                <li><a href="#faq">{t('footer.faq')}</a></li>
                <li><a href="#support">{t('footer.support')}</a></li>
                <li><a href="#terms">{t('footer.terms')}</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Ke Geberew. {t('footer.copyright')}</p>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      <Chatbot />
    </div>
  );
};

export default Home;
