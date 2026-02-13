import { useState } from "react";
import { useLanguage } from "./LanguageContext";
import starsIcon from "../public/6514f1e6-dab4-4d49-806a-3ff22d7793e5.webp";
import "./Home.css";

export default function Home() {
  const { t } = useLanguage();
  const [showAllHistory, setShowAllHistory] = useState(false);

  // Данные пользователя из Telegram
  const tg = window.Telegram?.WebApp;
  const user = tg?.initDataUnsafe?.user;

  const username = user?.username || user?.first_name || "User";
  const firstName = user?.first_name || "";
  const lastName = user?.last_name || "";
  const photoUrl = user?.photo_url;
  const initials =
    `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";

  // История покупок
  const purchaseHistory = [
    {
      id: 1,
      date: "15.02.2026",
      plan: t("month"),
      stars: 50,
      status: "active",
    },
    {
      id: 2,
      date: "10.01.2026",
      plan: t("month"),
      stars: 50,
      status: "expired",
    },
    {
      id: 3,
      date: "05.12.2025",
      plan: t("months_3"),
      stars: 130,
      status: "expired",
    },
    {
      id: 4,
      date: "01.11.2025",
      plan: t("month"),
      stars: 50,
      status: "expired",
    },
    {
      id: 5,
      date: "15.10.2025",
      plan: t("months_6"),
      stars: 280,
      status: "expired",
    },
  ];

  const visibleHistory = showAllHistory
    ? purchaseHistory
    : purchaseHistory.slice(0, 3);

  const formatDate = (date: string) => {
    return date;
  };

  return (
    <div className="home">
      <div className="container">
        {/* Карточка подписки с профилем */}
        <div className="subscription-card">
          {/* Шапка карточки с подпиской и статусом */}
          <div className="subscription-card__header">
            <span className="subscription-card__title">
              {t("subscription")}
            </span>
            <span className="subscription-card__badge">{t("active")}</span>
          </div>

          {/* Блок с аватаром и пользователем */}
          <div className="subscription-card__profile">
            <div className="subscription-card__avatar-wrapper">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={username}
                  className="subscription-card__avatar"
                />
              ) : (
                <div className="subscription-card__avatar subscription-card__avatar--placeholder">
                  {initials}
                </div>
              )}
              <div className="subscription-card__avatar-glow"></div>
            </div>
            <div className="subscription-card__user-info">
              <span className="subscription-card__username">@{username}</span>
            </div>
          </div>

          {/* Дни и прогресс */}
          <div className="subscription-card__content">
            <div className="subscription-card__days">
              <span className="subscription-card__days-number">15</span>
              <span className="subscription-card__days-label">
                {t("days_left")}
              </span>
            </div>

            <div className="subscription-card__progress">
              <div
                className="subscription-card__progress-bar"
                style={{ width: "50%" }}
              />
            </div>

            <div className="subscription-card__footer">
              <span className="subscription-card__date">
                {t("valid_until")} 25.03.2026
              </span>
            </div>
          </div>

          {/* Декоративный элемент */}
          <div className="subscription-card__decoration"></div>
        </div>

        {/* История покупок */}
        <div className="history-section">
          <div className="history-section__header">
            <h2 className="history-section__title">
              {t("purchase_history") || "История покупок"}
            </h2>
            <span className="history-section__count">
              {purchaseHistory.length} {t("total") || "всего"}
            </span>
          </div>

          <div className="history-list">
            {visibleHistory.map((purchase) => (
              <div key={purchase.id} className="history-item">
                <div className="history-item__left">
                  <div className="history-item__date">
                    {formatDate(purchase.date)}
                  </div>
                  <div className="history-item__plan">{purchase.plan}</div>
                </div>
                <div className="history-item__right">
                  <div className="history-item__stars">
                    <span className="history-item__stars-number">
                      {purchase.stars}
                    </span>
                    <img
                      src={starsIcon}
                      alt="⭐"
                      className="history-item__stars-icon"
                      width="16"
                      height="16"
                    />
                  </div>
                  <div
                    className={`history-item__status history-item__status--${purchase.status}`}
                  >
                    {purchase.status === "active"
                      ? t("active") || "Активен"
                      : t("expired") || "Истек"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {purchaseHistory.length > 3 && (
            <button
              className="history-section__show-more"
              onClick={() => setShowAllHistory(!showAllHistory)}
            >
              <span>
                {showAllHistory
                  ? t("show_less") || "Скрыть"
                  : t("show_more") || "Показать еще"}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                style={{
                  transform: showAllHistory ? "rotate(180deg)" : "none",
                  transition: "transform 0.3s ease",
                }}
              >
                <path
                  d="M4 6L8 10L12 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
