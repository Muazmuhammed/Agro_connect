import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import '../styles/Contact.css';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    alert(t('contact.send') + ' - Coming soon!');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="contact-page">
      <Navbar />
      
      <div className="contact-container">
        <div className="contact-hero">
          <h1>{t('contact.title')}</h1>
          <p>{t('contact.getInTouch')}</p>
        </div>

        <div className="contact-content">
          <div className="contact-form-section">
            <h2>{t('contact.description')}</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>{t('contact.name')}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder={t('contact.name')}
                />
              </div>
              <div className="form-group">
                <label>{t('contact.email')}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder={t('contact.email')}
                />
              </div>
              <div className="form-group">
                <label>{t('contact.message')}</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder={t('contact.message')}
                ></textarea>
              </div>
              <button type="submit" className="btn-submit">
                {t('contact.send')}
              </button>
            </form>
          </div>

          <div className="contact-info-section">
            <div className="contact-info-card">
              <div className="info-icon">📍</div>
              <h3>{t('contact.address')}</h3>
              <p>{t('contact.addressValue')}</p>
            </div>
            <div className="contact-info-card">
              <div className="info-icon">📞</div>
              <h3>{t('contact.phone')}</h3>
              <p>{t('contact.phoneValue')}</p>
            </div>
            <div className="contact-info-card">
              <div className="info-icon">📧</div>
              <h3>{t('contact.emailLabel')}</h3>
              <p>{t('contact.emailValue')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
