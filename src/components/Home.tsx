import { useLanguage } from "./LanguageContext";
// import { useTheme } from "./ThemeContext";
import "./Home.css";

export default function Home() {
  const { t } = useLanguage();
//   const { theme } = useTheme();

  // Данные пользователя из Telegram
  const tg = window.Telegram?.WebApp;
  const user = tg?.initDataUnsafe?.user;

  const username = user?.username || user?.first_name || "User";
  const firstName = user?.first_name || "";
  const lastName = user?.last_name || "";
  const photoUrl = user?.photo_url;
  const initials =
    `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";

  return (
    <div className="home">
      <div className="container">
        {/* Только логотип сверху */}
        {/* <div className="home__header">
          <div className="home__logo">
            <span className="home__logo-text">W</span>
            <span className="home__logo-accent">.</span>
          </div>
        </div> */}

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
              {/* <span className="subscription-card__user-status">
                {t("active_subscriber") || "Активный подписчик"}
              </span> */}
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
      </div>
    </div>
  );
}
