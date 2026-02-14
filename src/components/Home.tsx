import { useState } from "react";
import { useLanguage } from "./LanguageContext";
import starsIcon from "../public/6514f1e6-dab4-4d49-806a-3ff22d7793e5.webp";
import "./Home.css";
import apple from "../public/apple1-logo-svgrepo-com.svg";
import android from "../public/android-svgrepo-com.svg";
import windows from "../public/microsoft-windows-22-logo-svgrepo-com.svg";

export default function Home() {
  const { t } = useLanguage();
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activationCode, setActivationCode] = useState("ABCD-EFGH-IJKL-MNOP");
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  // Проверка наличия подписки (для демо)
  const hasSubscription = true; // В реальном приложении будет проверка из контекста

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

  // Обновленный массив devices с импортированными иконками
  const devices = [
    {
      id: "ios",
      name: "iOS",
      icon: apple, // Используем импортированную иконку Apple
      available: true,
    },
    {
      id: "android",
      name: "Android",
      icon: android, // Используем импортированную иконку Android
      available: true,
    },
    {
      id: "windows",
      name: "Windows",
      icon: windows, // Используем импортированную иконку Windows
      available: true,
    },
    {
      id: "macos",
      name: "macOS",
      icon: apple, // Для macOS тоже используем иконку Apple
      available: true,
    },
  ];

  const handleDeviceClick = (deviceId: string) => {
    // Если кликнули на то же устройство - закрываем
    if (selectedDevice === deviceId) {
      setSelectedDevice(null);
    } else {
      // Если кликнули на другое устройство - открываем его
      setSelectedDevice(deviceId);
    }
  };

  const handleCopyCode = () => {
    if (!hasSubscription) return;
    navigator.clipboard.writeText(activationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateNewCode = () => {
    if (!hasSubscription) return;
    // Генерация нового кода (в реальном приложении будет запрос к бэкенду)
    const newCode =
      Math.random().toString(36).substring(2, 6).toUpperCase() +
      "-" +
      Math.random().toString(36).substring(2, 6).toUpperCase() +
      "-" +
      Math.random().toString(36).substring(2, 6).toUpperCase() +
      "-" +
      Math.random().toString(36).substring(2, 6).toUpperCase();
    setActivationCode(newCode);
    setCopied(false);
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

        {/* Раздел с кодом активации */}
        <div className="activation-section">
          <h2 className="activation-section__title">
            {t("activation_code") || "Код активации"}
          </h2>

          {hasSubscription ? (
            <>
              <div className="activation-code">
                <div className="activation-code__wrapper">
                  <span className="activation-code__text">
                    {activationCode}
                  </span>
                </div>
                <button
                  className={`activation-code__button ${copied ? "activation-code__button--copied" : ""}`}
                  onClick={handleCopyCode}
                >
                  {copied ? (
                    <>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          d="M20 6L9 17L4 12"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>{t("copied") || "Скопировано!"}</span>
                    </>
                  ) : (
                    <>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect
                          x="9"
                          y="9"
                          width="13"
                          height="13"
                          rx="2"
                          ry="2"
                        ></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      <span>{t("copy") || "Копировать"}</span>
                    </>
                  )}
                </button>
              </div>

              <button
                className="activation-code__replace"
                onClick={handleGenerateNewCode}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M23 4v6h-6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M1 20v-6h6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{t("replace_code") || "Заменить код"}</span>
              </button>
            </>
          ) : (
            <div className="activation-code__empty">
              <span className="activation-code__empty-icon">🔒</span>
              <p className="activation-code__empty-text">
                {t("no_subscription_code") ||
                  "Оформите подписку для получения кода активации"}
              </p>
            </div>
          )}
        </div>

        {/* Раздел выбора устройства */}
        <div className="devices-section">
          <h2 className="devices-section__title">
            {t("choose_device") || "Выберите устройство"}
          </h2>
          <p className="devices-section__subtitle">
            {t("device_instructions") ||
              "Выберите устройство для просмотра инструкции по подключению"}
          </p>

          <div className="devices-grid">
            {devices.map((device) => (
              <button
                key={device.id}
                className={`device-card ${selectedDevice === device.id ? "device-card--active" : ""}`}
                onClick={() => handleDeviceClick(device.id)}
              >
                <img
                  src={device.icon}
                  alt={device.name}
                  className="device-card__icon"
                />
                <span className="device-card__name">{device.name}</span>
                <span className="device-card__status">
                  {t("instructions_soon") || "Скоро"}
                </span>
              </button>
            ))}
          </div>

          {/* Анимированное появление/исчезновение инструкции */}
          <div
            className={`device-instructions-wrapper ${selectedDevice ? "device-instructions-wrapper--visible" : ""}`}
          >
            {selectedDevice && (
              <div className="device-instructions">
                <div className="device-instructions__header">
                  <img
                    src={devices.find((d) => d.id === selectedDevice)?.icon}
                    alt={devices.find((d) => d.id === selectedDevice)?.name}
                    className="device-instructions__icon"
                  />
                  <h3 className="device-instructions__title">
                    {devices.find((d) => d.id === selectedDevice)?.name}
                  </h3>
                </div>
                <div className="device-instructions__content">
                  <p className="device-instructions__placeholder">
                    {t("instructions_placeholder") ||
                      "Инструкция по настройке появится здесь. Это временное сообщение."}
                  </p>
                </div>
              </div>
            )}
          </div>
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
                  <div className="history-item__date">{purchase.date}</div>
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
