import { useState } from "react";
import { useLanguage } from "./LanguageContext";
import starsIcon from "../public/6514f1e6-dab4-4d49-806a-3ff22d7793e5.webp";
import "./Topup.css";

type PaymentStatus = "paid" | "failed" | "cancelled" | "pending";

interface TopupProps {
  user?: any;
}

interface LogMessage {
  id: number;
  text: string;
  type: "info" | "success" | "error" | "warning";
  timestamp: string;
}

export default function Topup({ user }: TopupProps) {
  const { t } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<string>("month");
  const [processing, setProcessing] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [showLogs, setShowLogs] = useState<boolean>(true);

  const telegramId = user?.telegramId;

  const addLog = (text: string, type: LogMessage["type"] = "info") => {
    const newLog: LogMessage = {
      id: Date.now(),
      text,
      type,
      timestamp: new Date().toLocaleTimeString(),
    };
    setLogs((prev) => [...prev, newLog]);
    console.log(`[${type.toUpperCase()}] ${text}`);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const plans = [
    {
      id: "month",
      name: t("month"),
      stars: 5,
      discount: 0,
      active: true,
      popular: false,
      days: 30,
    },
    {
      id: "3months",
      name: t("months_3"),
      stars: 10,
      discount: 13,
      active: true,
      popular: true,
      days: 90,
    },
    {
      id: "6months",
      name: t("months_6"),
      stars: 280,
      discount: 0,
      active: false,
      popular: false,
      days: 180,
    },
    {
      id: "year",
      name: t("year"),
      stars: 550,
      discount: 0,
      active: false,
      popular: false,
      days: 365,
    },
  ];

  const handleTopUp = () => {
    window.Telegram?.WebApp?.openTelegramLink?.("https://t.me/PremiumBot");
  };

  const handleSubscribe = async () => {
    const selected = plans.find((p) => p.id === selectedPlan);
    if (!selected?.active || !telegramId) return;

    setProcessing(true);
    setShowError(false);
    addLog(`🚀 Начало оформления подписки: ${selected.name}`, "info");

    try {
      const tg = window.Telegram?.WebApp;

      if (!tg) {
        addLog("❌ Telegram WebApp не доступен", "error");
        alert("❌ Не удалось подключиться к Telegram");
        return;
      }
      addLog("✅ Telegram WebApp доступен", "success");

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
      // Убираем возможный слеш в конце
      const cleanApiUrl = API_URL.replace(/\/$/, "");
      const response = await fetch(`${cleanApiUrl}/invoice/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: telegramId,
          plan: selectedPlan,
          stars: selected.stars,
        }),
      });

      addLog(`📥 Ответ сервера: статус ${response.status}`, "info");

      const data = await response.json();

      if (!data.success) {
        addLog(
          `❌ Ошибка: ${data.error || "Failed to create invoice"}`,
          "error",
        );
        throw new Error(data.error || "Failed to create invoice");
      }

      addLog(`✅ Инвойс создан, ссылка получена`, "success");
      addLog(`🔗 Ссылка: ${data.invoiceLink?.slice(0, 60)}...`, "info");

      if (!data.invoiceLink || !data.invoiceLink.startsWith("https://")) {
        addLog(`❌ Неверная ссылка: ${data.invoiceLink}`, "error");
        throw new Error("Invalid invoice link");
      }

      addLog(`🔄 Вызов tg.openInvoice()...`, "info");

      tg.openInvoice(data.invoiceLink, (status: PaymentStatus) => {
        addLog(
          `💰 Статус оплаты: ${status}`,
          status === "paid" ? "success" : "warning",
        );

        if (status === "paid") {
          sessionStorage.setItem("justPurchased", "true");
          addLog(`✅ Оплата прошла успешно! Подписка активирована.`, "success");
          alert("✅ Оплата прошла успешно! Подписка активирована.");
          window.location.reload();
        } else if (status === "failed") {
          addLog(`❌ Оплата не прошла.`, "error");
          alert("❌ Оплата не прошла. Попробуйте позже.");
        } else if (status === "cancelled") {
          addLog(`ℹ️ Платеж отменен пользователем`, "warning");
        }
      });

      addLog(`✅ openInvoice вызван, ожидание оплаты...`, "success");
    } catch (error: any) {
      addLog(`❌ Ошибка: ${error.message}`, "error");
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    } finally {
      setProcessing(false);
    }
  };

  const selectedPlanData = plans.find((p) => p.id === selectedPlan);

  const getLogIcon = (type: string) => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      default:
        return "📝";
    }
  };

  return (
    <div className="topup-page">
      <div className="container">
        {/* Заголовок */}
        <div className="topup__header">
          <h1 className="topup__title">{t("subscription_title")}</h1>
          <p className="topup__subtitle">{t("subscription_subtitle")}</p>
        </div>

        {/* Блок информации о звездах */}
        <div className="stars-info">
          <div className="stars-info__content">
            <div className="stars-info__icon">
              <img src={starsIcon} alt="⭐" width="40" height="40" />
            </div>
            <div className="stars-info__text">
              <h3 className="stars-info__title">Оплата Telegram Stars</h3>
              <p className="stars-info__description">
                Для оформления подписки используются Telegram Stars. Если у вас
                недостаточно звезд, вы можете пополнить баланс нажав на кнопку
                ниже.
              </p>
            </div>
          </div>
          <button className="stars-info__button" onClick={handleTopUp}>
            <span>{t("top_up") || "Пополнить Stars"}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 3L11 8L6 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Список тарифов */}
        <div className="plans-grid">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card 
                ${selectedPlan === plan.id ? "plan-card--active" : ""} 
                ${plan.popular ? "plan-card--popular" : ""}
                ${!plan.active ? "plan-card--inactive" : ""}
              `}
              onClick={() => {
                if (plan.active) {
                  setSelectedPlan(plan.id);
                  setShowError(false);
                }
              }}
            >
              {plan.popular && plan.active && (
                <div className="plan-card__badge">
                  <span>🔥 {t("popular")}</span>
                </div>
              )}

              {!plan.active && (
                <div className="plan-card__coming-soon">
                  <span>✨ {t("coming_soon")}</span>
                </div>
              )}

              <div className="plan-card__content">
                <div className="plan-card__header">
                  <h3 className="plan-card__name">{plan.name}</h3>
                </div>

                <div className="plan-card__price">
                  <div className="plan-card__price-value">
                    <span>{plan.stars}</span>
                    <img
                      src={starsIcon}
                      alt="⭐"
                      className="plan-card__stars-icon"
                      width="28"
                      height="28"
                    />
                  </div>
                  {plan.discount > 0 && plan.active && (
                    <span className="plan-card__discount">
                      -{plan.discount}%
                    </span>
                  )}
                </div>

                {plan.active && (
                  <>
                    <div className="plan-card__features">
                      <div className="plan-card__feature">
                        <span className="plan-card__feature-icon">✓</span>
                        <span>{t("full_access")}</span>
                      </div>
                      <div className="plan-card__feature">
                        <span className="plan-card__feature-icon">✓</span>
                        <span>{t("priority_support")}</span>
                      </div>
                      <div className="plan-card__feature">
                        <span className="plan-card__feature-icon">✓</span>
                        <span>{t("unlimited")}</span>
                      </div>
                    </div>

                    <div className="plan-card__footer">
                      <div className="plan-card__price-per-day">
                        <span>
                          {Math.round((plan.stars / plan.days) * 10) / 10}
                        </span>
                        <img
                          src={starsIcon}
                          alt="⭐"
                          className="plan-card__price-per-day-icon"
                          width="16"
                          height="16"
                        />
                        <span>/{t("day") || "день"}</span>
                      </div>
                      {plan.id === "3months" && (
                        <div className="plan-card__savings">
                          <span>{t("economy")} 20</span>
                          <img
                            src={starsIcon}
                            alt="⭐"
                            className="plan-card__savings-icon"
                            width="16"
                            height="16"
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Кнопка оформления */}
        {selectedPlanData?.active && (
          <div className="topup__action">
            <button
              className={`topup__button ${showError ? "topup__button--error" : ""}`}
              onClick={handleSubscribe}
              disabled={processing}
            >
              <span>{processing ? "Обработка..." : t("subscribe")}</span>
              <span className="topup__button-price">
                <span>{selectedPlanData.stars}</span>
                <img
                  src={starsIcon}
                  alt="⭐"
                  className="topup__button-price-icon"
                  width="20"
                  height="20"
                />
              </span>
            </button>

            {showError && (
              <div className="topup__error">
                <span className="topup__error-icon">⚠️</span>
                <p className="topup__error-text">
                  Не удалось создать платеж. Попробуйте позже.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Визуальный логгер */}
        {showLogs && logs.length > 0 && (
          <div className="debug-logger">
            <div className="debug-logger__header">
              <span className="debug-logger__title">📋 Лог событий</span>
              <button className="debug-logger__clear" onClick={clearLogs}>
                Очистить
              </button>
              <button
                className="debug-logger__close"
                onClick={() => setShowLogs(false)}
                style={{ marginLeft: "8px" }}
              >
                ✕
              </button>
            </div>
            <div className="debug-logger__content">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className={`debug-logger__item debug-logger__item--${log.type}`}
                >
                  <span className="debug-logger__time">{log.timestamp}</span>
                  <span className="debug-logger__icon">
                    {getLogIcon(log.type)}
                  </span>
                  <span className="debug-logger__text">{log.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!showLogs && logs.length > 0 && (
          <button
            className="debug-logger__show"
            onClick={() => setShowLogs(true)}
          >
            📋 Показать лог ({logs.length})
          </button>
        )}
      </div>
    </div>
  );
}
