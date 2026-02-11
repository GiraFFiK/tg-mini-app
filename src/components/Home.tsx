import { useLanguage } from "./LanguageContext";
import "./Home.css";

export default function Home() {
  const { t } = useLanguage();

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
        {/* Header с логотипом и профилем */}
        <div className="home__header">
          <div className="home__logo">
            <span className="home__logo-text">W</span>
            <span className="home__logo-gradient">{t("wallet")}</span>
          </div>

          <div className="home__profile">
            {photoUrl ? (
              <img src={photoUrl} alt={username} className="home__avatar" />
            ) : (
              <div className="home__avatar home__avatar--placeholder">
                {initials}
              </div>
            )}
            <span className="home__username">@{username}</span>
          </div>
        </div>

        {/* Карточка подписки */}
        <div className="subscription-card">
          <div className="subscription-card__header">
            <span className="subscription-card__title">
              {t("subscription")}
            </span>
            <span className="subscription-card__badge">{t("active")}</span>
          </div>

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
        </div>
      </div>
    </div>
  );
}
