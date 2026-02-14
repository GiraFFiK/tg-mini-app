import { useState } from "react";
import { useLanguage } from "../components/LanguageContext";
import { useTheme } from "../components/ThemeContext";
import "./Settings.css";

export default function Settings() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isSupportHovered, setIsSupportHovered] = useState(false);

  const languages = [
    { id: "ru" as const, name: "Русский", flag: "🇷🇺", native: "Русский" },
    { id: "en" as const, name: "English", flag: "🇺🇸", native: "English" },
  ];

  return (
    <div className="settings-page">
      <div className="container">
        {/* Заголовок с иконкой шестеренки */}
        <div className="settings__header">
          <div className="settings__title-wrapper">
            <svg
              className="settings__gear-icon"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3"  />
              <path d="M13.7654 2.15224C13.3978 2 12.9319 2 12 2C11.0681 2 10.6022 2 10.2346 2.15224C9.74457 2.35523 9.35522 2.74458 9.15223 3.23463C9.05957 3.45834 9.0233 3.7185 9.00911 4.09799C8.98826 4.65568 8.70226 5.17189 8.21894 5.45093C7.73564 5.72996 7.14559 5.71954 6.65219 5.45876C6.31645 5.2813 6.07301 5.18262 5.83294 5.15102C5.30704 5.08178 4.77518 5.22429 4.35436 5.5472C4.03874 5.78938 3.80577 6.1929 3.33983 6.99993C2.87389 7.80697 2.64092 8.21048 2.58899 8.60491C2.51976 9.1308 2.66227 9.66266 2.98518 10.0835C3.13256 10.2756 3.3397 10.437 3.66119 10.639C4.1338 10.936 4.43789 11.4419 4.43786 12C4.43783 12.5581 4.13375 13.0639 3.66118 13.3608C3.33965 13.5629 3.13248 13.7244 2.98508 13.9165C2.66217 14.3373 2.51966 14.8691 2.5889 15.395C2.64082 15.7894 2.87379 16.193 3.33973 17C3.80568 17.807 4.03865 18.2106 4.35426 18.4527C4.77508 18.7756 5.30694 18.9181 5.83284 18.8489C6.07289 18.8173 6.31632 18.7186 6.65204 18.5412C7.14547 18.2804 7.73556 18.27 8.2189 18.549C8.70224 18.8281 8.98826 19.3443 9.00911 19.9021C9.02331 20.2815 9.05957 20.5417 9.15223 20.7654C9.35522 21.2554 9.74457 21.6448 10.2346 21.8478C10.6022 22 11.0681 22 12 22C12.9319 22 13.3978 22 13.7654 21.8478C14.2554 21.6448 14.6448 21.2554 14.8477 20.7654C14.9404 20.5417 14.9767 20.2815 14.9909 19.902C15.0117 19.3443 15.2977 18.8281 15.781 18.549C16.2643 18.2699 16.8544 18.2804 17.3479 18.5412C17.6836 18.7186 17.927 18.8172 18.167 18.8488C18.6929 18.9181 19.2248 18.7756 19.6456 18.4527C19.9612 18.2105 20.1942 17.807 20.6601 16.9999C21.1261 16.1929 21.3591 15.7894 21.411 15.395C21.4802 14.8691 21.3377 14.3372 21.0148 13.9164C20.8674 13.7243 20.6602 13.5628 20.3387 13.3608C19.8662 13.0639 19.5621 12.558 19.5621 11.9999C19.5621 11.4418 19.8662 10.9361 20.3387 10.6392C20.6603 10.4371 20.8675 10.2757 21.0149 10.0835C21.3378 9.66273 21.4803 9.13087 21.4111 8.60497C21.3592 8.21055 21.1262 7.80703 20.6602 7C20.1943 6.19297 19.9613 5.78945 19.6457 5.54727C19.2249 5.22436 18.693 5.08185 18.1671 5.15109C17.9271 5.18269 17.6837 5.28136 17.3479 5.4588C16.8545 5.71959 16.2644 5.73002 15.7811 5.45096C15.2977 5.17191 15.0117 4.65566 14.9909 4.09794C14.9767 3.71848 14.9404 3.45833 14.8477 3.23463C14.6448 2.74458 14.2554 2.35523 13.7654 2.15224Z" />
            </svg>
            <h1 className="settings__title">{t("settings")}</h1>
          </div>
          <p className="settings__subtitle">
            {language === "ru"
              ? "Настройте приложение под себя"
              : "Customize your experience"}
          </p>
        </div>

        {/* Секция темы */}
        <div className="settings-section">
          <div className="settings-section__header">
            <span className="settings-section__icon">🎨</span>
            <h2 className="settings-section__title">
              {language === "ru" ? "Тема оформления" : "Theme"}
            </h2>
          </div>

          <div className="settings-section__content">
            <button
              className={`theme-card ${theme === "dark" ? "theme-card--active" : ""}`}
              onClick={() => theme !== "dark" && toggleTheme()}
            >
              <div className="theme-card__info">
                <div className="theme-card__preview theme-card__preview--dark">
                  <div className="theme-card__preview-dot"></div>
                  <div className="theme-card__preview-dot"></div>
                  <div className="theme-card__preview-dot"></div>
                </div>
                <div className="theme-card__text">
                  <span className="theme-card__name">
                    {language === "ru" ? "Темная" : "Dark"}
                  </span>
                  <span className="theme-card__description">
                    {language === "ru"
                      ? "Для комфорта в темноте"
                      : "Comfortable in the dark"}
                  </span>
                </div>
              </div>
              {theme === "dark" && (
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
              className={`theme-card ${theme === "light" ? "theme-card--active" : ""}`}
              onClick={() => theme !== "light" && toggleTheme()}
            >
              <div className="theme-card__info">
                <div className="theme-card__preview theme-card__preview--light">
                  <div className="theme-card__preview-dot"></div>
                  <div className="theme-card__preview-dot"></div>
                  <div className="theme-card__preview-dot"></div>
                </div>
                <div className="theme-card__text">
                  <span className="theme-card__name">
                    {language === "ru" ? "Светлая" : "Light"}
                  </span>
                  <span className="theme-card__description">
                    {language === "ru" ? "Яркая и чистая" : "Bright and clean"}
                  </span>
                </div>
              </div>
              {theme === "light" && (
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
            <h2 className="settings-section__title">{t("language")}</h2>
          </div>

          <div className="settings-section__content">
            {languages.map((lang) => (
              <button
                key={lang.id}
                className={`language-card ${language === lang.id ? "language-card--active" : ""}`}
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
            <h2 className="settings-section__title">{t("support")}</h2>
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
                  <span className="support-card__title">
                    {t("contact_support")}
                  </span>
                  <span className="support-card__badge">
                    {t("coming_soon")}
                  </span>
                </div>
              </div>

              <div
                className={`support-card__arrow ${isSupportHovered ? "support-card__arrow--hover" : ""}`}
              >
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
                {language === "ru"
                  ? "Поддержка скоро будет доступна в Telegram"
                  : "Support will be available soon in Telegram"}
              </p>
            </div>
          </div>
        </div>

        {/* Информация о приложении */}
        <div className="settings-footer">
          <div className="settings-footer__version">Version 1.0.0</div>
          <div className="settings-footer__copyright">© 2026 AuraVPN</div>
        </div>
      </div>
    </div>
  );
}
