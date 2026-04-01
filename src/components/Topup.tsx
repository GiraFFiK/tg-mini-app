import { useState } from "react";
import { useLanguage } from "./LanguageContext";
import starsIcon from "../public/6514f1e6-dab4-4d49-806a-3ff22d7793e5.webp";
import "./Topup.css";

// Тип для статуса оплаты
type PaymentStatus = 'paid' | 'failed' | 'cancelled' | 'pending';

interface TopupProps {
  user?: any;
}

export default function Topup({ user }: TopupProps) {
  const { t } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<string>("month");
  const [processing, setProcessing] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  const telegramId = user?.telegramId;

  const plans = [
    {
      id: "month",
      name: t("month"),
      stars: 1,
      discount: 0,
      active: true,
      popular: false,
      days: 30,
    },
    {
      id: "3months",
      name: t("months_3"),
      stars: 3,
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

    try {
      const tg = window.Telegram?.WebApp;

      if (!tg) {
        alert("❌ Не удалось подключиться к Telegram");
        return;
      }

      // Получаем ссылку на инвойс с бэкенда
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
      const response = await fetch(`${API_URL}/invoice/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: telegramId,
          plan: selectedPlan,
          stars: selected.stars,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to create invoice");
      }

      console.log("📤 Открываем инвойс:", data.invoiceLink);

      // Открываем инвойс по ссылке с callback
      tg.openInvoice(data.invoiceLink, (status: PaymentStatus) => {
        console.log("Статус оплаты:", status);
        if (status === "paid") {
          // Оплата успешна, можно обновить UI
          sessionStorage.setItem("justPurchased", "true");
          alert("✅ Оплата прошла успешно! Подписка активирована.");
          // Обновляем страницу или перезагружаем данные
          window.location.reload();
        } else if (status === "failed") {
          alert("❌ Оплата не прошла. Попробуйте позже.");
        } else if (status === "cancelled") {
          console.log("Платеж отменен");
        }
      });

    } catch (error) {
      console.error("Payment error:", error);
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    } finally {
      setProcessing(false);
    }
  };

  const selectedPlanData = plans.find((p) => p.id === selectedPlan);

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
      </div>
    </div>
  );
}