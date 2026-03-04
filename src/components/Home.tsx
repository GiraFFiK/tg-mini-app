import { useState, useEffect } from "react";
import { useLanguage } from "./LanguageContext";
import starsIcon from "../public/6514f1e6-dab4-4d49-806a-3ff22d7793e5.webp";
import "./Home.css";
import apple from "../public/apple1-logo-svgrepo-com.svg";
import android from "../public/android-svgrepo-com.svg";
import windows from "../public/microsoft-windows-22-logo-svgrepo-com.svg";
import {
  getSubscription,
  getActivationCode, // 👈 ДОБАВИТЬ ЭТОТ ИМПОРТ
  regenerateActivationCode,
  getFullHistory,
} from "../services/api";
import { useRefresh } from "../../hooks/useRefresh";

interface HomeProps {
  user?: any;
}

export default function Home({ user }: HomeProps) {
  const { t } = useLanguage();
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activationCode, setActivationCode] = useState("");
  const [subscription, setSubscription] = useState<any>(null);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Данные пользователя из Telegram
  const tg = window.Telegram?.WebApp;
  const tgUser = tg?.initDataUnsafe?.user;

  const username =
    tgUser?.username || tgUser?.first_name || user?.username || "User";
  const firstName = tgUser?.first_name || user?.firstName || "";
  const lastName = tgUser?.last_name || user?.lastName || "";
  const photoUrl = tgUser?.photo_url;
  const telegramId = user?.telegramId || String(tgUser?.id || "");

  const initials =
    `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";

  // Функция загрузки данных подписки
  const fetchSubscriptionData = async () => {
    if (!telegramId) return;

    try {
      const subData = await getSubscription(telegramId);
      console.log("📦 Данные подписки:", subData);
      
      if (subData && typeof subData.isActive === 'boolean') {
        setSubscription({
          isActive: subData.isActive,
          daysLeft: subData.daysLeft || 0,
          subscriptionUntil: subData.subscriptionUntil || null
        });
      }
    } catch (error) {
      console.error("Ошибка fetchSubscriptionData:", error);
    }
  };

  // 👇 НОВАЯ ФУНКЦИЯ для загрузки кода активации
  const fetchActivationCodeData = async () => {
    if (!telegramId) return;

    try {
      const codeData = await getActivationCode(telegramId);
      console.log("🔑 Данные кода активации:", codeData);
      
      if (codeData.hasSubscription && codeData.code) {
        setActivationCode(codeData.code);
      } else {
        setActivationCode(""); // Очищаем код, если подписка неактивна
      }
    } catch (error) {
      console.error("Ошибка fetchActivationCodeData:", error);
    }
  };

  // Функция загрузки истории
  const fetchHistoryData = async () => {
    if (!telegramId) return;

    try {
      const historyData = await getFullHistory(telegramId);
      console.log("📚 История загружена:", historyData);
      setHistory(historyData || []);
    } catch (error) {
      console.error("Ошибка загрузки истории:", error);
      setHistory([]);
    }
  };

  // Общая функция загрузки всех данных
  const fetchAllData = async () => {
    await Promise.all([
      fetchSubscriptionData(),
      fetchActivationCodeData(), // 👈 ДОБАВЛЕНО
      fetchHistoryData()
    ]);
  };

  // Загрузка данных при монтировании
  useEffect(() => {
    const init = async () => {
      console.log("🔄 Компонент Home монтируется, telegramId=", telegramId);
      if (telegramId) {
        await fetchAllData();
        console.log("✅ Все данные загружены");
      } else {
        console.log("❌ telegramId отсутствует");
      }
      setLoading(false);
    };
    init();
  }, [telegramId]);

  // Используем хук обновления
  const { refresh } = useRefresh(async () => {
    await fetchAllData();
  });

  // Автоматическое обновление при возвращении на страницу
  useEffect(() => {
    const handleFocus = () => {
      refresh();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refresh]);

  // Периодическое обновление каждые 30 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, 30000);

    return () => clearInterval(interval);
  }, [refresh]);

  // Обновление после возвращения с покупки
  useEffect(() => {
    const justPurchased = sessionStorage.getItem("justPurchased");
    if (justPurchased === "true") {
      refresh();
      sessionStorage.removeItem("justPurchased");
    }
  }, []);

  // Обработчики событий
  const handleDeviceClick = (deviceId: string) => {
    if (selectedDevice === deviceId) {
      setSelectedDevice(null);
    } else {
      setSelectedDevice(deviceId);
    }
  };

  const handleCopyCode = () => {
    if (!subscription?.isActive) return;
    navigator.clipboard.writeText(activationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateNewCode = async () => {
    if (!subscription?.isActive) return;

    try {
      const result = await regenerateActivationCode(telegramId);
      setActivationCode(result.code);
      setCopied(false);
    } catch (error) {
      console.error("Error regenerating code:", error);
    }
  };

  // Массив устройств
  const devices = [
    {
      id: "ios",
      name: "iOS",
      icon: apple,
      available: true,
    },
    {
      id: "android",
      name: "Android",
      icon: android,
      available: true,
    },
    {
      id: "windows",
      name: "Windows",
      icon: windows,
      available: true,
    },
    {
      id: "macos",
      name: "macOS",
      icon: apple,
      available: true,
    },
  ];

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  const hasSubscription = subscription?.isActive || false;
  const daysLeft = subscription?.daysLeft || 0;
  const expiryDate = subscription?.subscriptionUntil
    ? new Date(subscription.subscriptionUntil).toLocaleDateString("ru-RU")
    : "";

  const visibleHistory = showAllHistory
    ? history
    : history.slice(0, 3);

  // Функция для получения названия плана
  const getPlanName = (plan: string) => {
    switch(plan) {
      case 'month': return t('month') || '1 месяц';
      case '3months': return t('months_3') || '3 месяца';
      case '6months': return t('months_6') || '6 месяцев';
      case 'year': return t('year') || '1 год';
      default: return plan;
    }
  };

  // Функция для получения описания типа записи
  const getItemType = (item: any) => {
    if (item.type === 'purchase') {
      return getPlanName(item.plan);
    } else if (item.type === 'welcome_bonus') {
      return '🎁 Бонус за первый вход';
    } else if (item.type === 'referral_bonus') {
      return '👥 Реферальный бонус';
    }
    return '';
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
            <div>
              <span
                className={`subscription-card__badge ${!hasSubscription ? "subscription-card__badge--inactive" : ""}`}
              >
                {hasSubscription ? t("active") : t("inactive") || "Неактивна"}
              </span>
            </div>
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

          {/* Дни и прогресс - показываем только если есть подписка */}
          {hasSubscription ? (
            <div className="subscription-card__content">
              <div className="subscription-card__days">
                <span className="subscription-card__days-number">
                  {daysLeft}
                </span>
                <span className="subscription-card__days-label">
                  {t("days_left")}
                </span>
              </div>

              <div className="subscription-card__progress">
                <div
                  className="subscription-card__progress-bar"
                  style={{ width: `${(daysLeft / 30) * 100}%` }}
                />
              </div>

              <div className="subscription-card__footer">
                <span className="subscription-card__date">
                  {t("valid_until")} {expiryDate}
                </span>
              </div>
            </div>
          ) : (
            <div className="subscription-card__inactive">
              <p className="subscription-card__inactive-text">
                {t("subscription_inactive") ||
                  "Подписка не активирована. Оформите подписку, чтобы получить доступ ко всем функциям."}
              </p>
            </div>
          )}

          {/* Декоративный элемент */}
          <div className="subscription-card__decoration"></div>
        </div>

        {/* Раздел с кодом активации - связан с состоянием подписки */}
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
                  "Активируйте подписку, чтобы получить код"}
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

        {/* История покупок и бонусов */}
        <div className="history-section">
          <div className="history-section__header">
            <h2 className="history-section__title">
              {t("purchase_history") || "История покупок и бонусов"}
            </h2>
            {history.length > 0 && (
              <span className="history-section__count">
                {history.length} {t("total") || "всего"}
              </span>
            )}
          </div>

          {history.length > 0 ? (
            <>
              <div className="history-list">
                {visibleHistory.map((item: any) => (
                  <div key={item.id} className="history-item">
                    <div className="history-item__left">
                      <div className="history-item__date">{item.date}</div>
                      <div className="history-item__plan">
                        {getItemType(item)}
                      </div>
                      {item.description && (
                        <div className="history-item__description">
                          {item.description}
                        </div>
                      )}
                    </div>
                    <div className="history-item__right">
                      {item.type === 'purchase' ? (
                        <div className="history-item__stars">
                          <span className="history-item__stars-number">
                            {item.stars}
                          </span>
                          <img
                            src={starsIcon}
                            alt="⭐"
                            className="history-item__stars-icon"
                            width="16"
                            height="16"
                          />
                        </div>
                      ) : (
                        <div className="history-item__bonus">
                          <span className="history-item__bonus-number">
                            +{item.days}
                          </span>
                          <span className="history-item__bonus-days">
                            {t("days") || "дн"}
                          </span>
                        </div>
                      )}
                      <div
                        className={`history-item__status history-item__status--${item.status}`}
                      >
                        {item.status === "active"
                          ? t("active") || "Активен"
                          : t("expired") || "Истек"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {history.length > 3 && (
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
            </>
          ) : (
            <div className="history-empty">
              <div className="history-empty__icon">🛒</div>
              <p className="history-empty__title">
                {t("no_purchases_title") || "История покупок пуста"}
              </p>
              <p className="history-empty__text">
                {t("no_purchases_text") || "У вас пока нет покупок или бонусов."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}