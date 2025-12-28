import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import '../styles/About.css';

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="about-page">
      <Navbar />
      
      <div className="about-container">
        <div className="about-hero">
          <h1>{t('about.title')}</h1>
        </div>

        <div className="about-content">
          <section className="about-section">
            <div className="section-icon">🎯</div>
            <h2>{t('about.mission')}</h2>
            <p>{t('about.missionText')}</p>
          </section>

          <section className="about-section">
            <div className="section-icon">🔭</div>
            <h2>{t('about.vision')}</h2>
            <p>{t('about.visionText')}</p>
          </section>

          <section className="about-values">
            <h2>{t('about.values')}</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">💎</div>
                <h3>{t('about.transparency')}</h3>
                <p>{t('about.transparencyText')}</p>
              </div>
              <div className="value-card">
                <div className="value-icon">⭐</div>
                <h3>{t('about.quality')}</h3>
                <p>{t('about.qualityText')}</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🤝</div>
                <h3>{t('about.reliability')}</h3>
                <p>{t('about.reliabilityText')}</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🚀</div>
                <h3>{t('about.innovation')}</h3>
                <p>{t('about.innovationText')}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
