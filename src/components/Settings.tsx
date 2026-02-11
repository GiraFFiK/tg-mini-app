import { useState } from 'react';
import { useLanguage } from '../components/LanguageContext';
import { useTheme } from '../components/ThemeContext';
import './Settings.css';

export default function Settings() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isSupportHovered, setIsSupportHovered] = useState(false);

  const languages = [
    { id: 'ru' as const, name: 'Русский', flag: '🇷🇺', native: 'Русский' },
    { id: 'en' as const, name: 'English', flag: '🇺🇸', native: 'English' },
  ];

  return (
    <div className="settings-page">
      <div className="container">
        {/* Заголовок */}
        <div className="settings__header">
          <h1 className="settings__title">{t('settings')}</h1>
          <p className="settings__subtitle">
            {language === 'ru' ? 'Настройте приложение под себя' : 'Customize your experience'}
          </p>
        </div>

        {/* Секция темы */}
        <div className="settings-section">
          <div className="settings-section__header">
            <span className="settings-section__icon">🎨</span>
            <h2 className="settings-section__title">
              {language === 'ru' ? 'Тема оформления' : 'Theme'}
            </h2>
          </div>
          
          <div className="settings-section__content">
            <button 
              className={`theme-card ${theme === 'dark' ? 'theme-card--active' : ''}`}
              onClick={() => theme !== 'dark' && toggleTheme()}
            >
              <div className="theme-card__info">
                <div className="theme-card__preview theme-card__preview--dark">
                  <div className="theme-card__preview-dot"></div>
                  <div className="theme-card__preview-dot"></div>
                  <div className="theme-card__preview-dot"></div>
                </div>
                <div className="theme-card__text">
                  <span className="theme-card__name">
                    {language === 'ru' ? 'Темная' : 'Dark'}
                  </span>
                  <span className="theme-card__description">
                    {language === 'ru' ? 'Для комфорта в темноте' : 'Comfortable in the dark'}
                  </span>
                </div>
              </div>
              {theme === 'dark' && (
                <div className="theme-card__check">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" fill="#6d5dfc" />
                    <path 
                      d="M6 10L9 13L14 7" 
                      stroke="white" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </button>

            <button 
              className={`theme-card ${theme === 'light' ? 'theme-card--active' : ''}`}
              onClick={() => theme !== 'light' && toggleTheme()}
            >
              <div className="theme-card__info">
                <div className="theme-card__preview theme-card__preview--light">
                  <div className="theme-card__preview-dot"></div>
                  <div className="theme-card__preview-dot"></div>
                  <div className="theme-card__preview-dot"></div>
                </div>
                <div className="theme-card__text">
                  <span className="theme-card__name">
                    {language === 'ru' ? 'Светлая' : 'Light'}
                  </span>
                  <span className="theme-card__description">
                    {language === 'ru' ? 'Яркая и чистая' : 'Bright and clean'}
                  </span>
                </div>
              </div>
              {theme === 'light' && (
                <div className="theme-card__check">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" fill="#6d5dfc" />
                    <path 
                      d="M6 10L9 13L14 7" 
                      stroke="white" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Секция языка */}
        <div className="settings-section">
          <div className="settings-section__header">
            <span className="settings-section__icon">🌐</span>
            <h2 className="settings-section__title">{t('language')}</h2>
          </div>
          
          <div className="settings-section__content">
            {languages.map((lang) => (
              <button
                key={lang.id}
                className={`language-card ${language === lang.id ? 'language-card--active' : ''}`}
                onClick={() => setLanguage(lang.id)}
              >
                <div className="language-card__info">
                  <span className="language-card__flag">{lang.flag}</span>
                  <div className="language-card__names">
                    <span className="language-card__name">{lang.name}</span>
                    <span className="language-card__native">{lang.native}</span>
                  </div>
                </div>
                
                {language === lang.id && (
                  <div className="language-card__check">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="8" fill="#6d5dfc" />
                      <path 
                        d="M6 10L9 13L14 7" 
                        stroke="white" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Секция поддержки */}
        <div className="settings-section">
          <div className="settings-section__header">
            <span className="settings-section__icon">💬</span>
            <h2 className="settings-section__title">{t('support')}</h2>
          </div>
          
          <div className="settings-section__content">
            <button 
              className="support-card"
              onMouseEnter={() => setIsSupportHovered(true)}
              onMouseLeave={() => setIsSupportHovered(false)}
              disabled
            >
              <div className="support-card__info">
                <div className="support-card__icon-wrapper">
                  <span className="support-card__icon">🛟</span>
                </div>
                <div className="support-card__text">
                  <span className="support-card__title">{t('contact_support')}</span>
                  <span className="support-card__badge">
                    {t('coming_soon')}
                  </span>
                </div>
              </div>
              
              <div className={`support-card__arrow ${isSupportHovered ? 'support-card__arrow--hover' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path 
                    d="M7 4L13 10L7 16" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </button>

            <div className="support-message">
              <span className="support-message__icon">✨</span>
              <p className="support-message__text">
                {language === 'ru' 
                  ? 'Поддержка скоро будет доступна в Telegram' 
                  : 'Support will be available soon in Telegram'}
              </p>
            </div>
          </div>
        </div>

        {/* Информация о приложении */}
        <div className="settings-footer">
          <div className="settings-footer__version">
            Version 1.0.0
          </div>
          <div className="settings-footer__copyright">
            © 2026 Wallet App
          </div>
        </div>
      </div>
    </div>
  );
}