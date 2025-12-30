import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/LanguageSelector.css';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <div className="language-selector">
      <button
        className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
        onClick={() => changeLanguage('en')}
      >
        English
      </button>
      <button
        className={`lang-btn ${i18n.language === 'am' ? 'active' : ''}`}
        onClick={() => changeLanguage('am')}
      >
        አማርኛ
      </button>
    </div>
  );
};

export default LanguageSelector;
