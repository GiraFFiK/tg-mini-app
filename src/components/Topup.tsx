import { useState, useEffect } from "react";
import { useLanguage } from "./LanguageContext";
import "./Topup.css";

export default function Topup() {
  const { t } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<string>("month");
  const [starsBalance, setStarsBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showInsufficientError, setShowInsufficientError] =
    useState<boolean>(false);

  // Получаем данные пользователя из Telegram
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      // Здесь должен быть запрос к бэкенду для получения баланса звезд
      // Пока используем тестовые данные
      setTimeout(() => {
        setStarsBalance(40); // Умышленно мало для теста ошибки
        setIsLoading(false);
      }, 500);
    }
  }, []);

  const plans = [
    {
      id: "month",
      name: t("month"),
      price: 50,
      stars: 50,
      discount: 0,
      active: true,
      popular: false,
      days: 30,
    },
    {
      id: "3months",
      name: t("months_3"),
      price: 130,
      stars: 130,
      discount: 13,
      active: true,
      popular: true,
      days: 90,
    },
    {
      id: "6months",
      name: t("months_6"),
      price: 280,
      stars: 280,
      discount: 0,
      active: false,
      popular: false,
      days: 180,
    },
    {
      id: "year",
      name: t("year"),
      price: 550,
      stars: 550,
      discount: 0,
      active: false,
      popular: false,
      days: 365,
    },
  ];

  const formatStars = (stars: number) => {
    return `${stars} ⭐️`;
  };

  const handleTopUp = () => {
    // Открываем PremiumBot
    window.Telegram?.WebApp?.openTelegramLink?.("https://t.me/PremiumBot");
  };

  const handleSubscribe = () => {
    const selected = plans.find((p) => p.id === selectedPlan);
    if (!selected?.active) return;

    if (starsBalance >= selected.stars) {
      // Здесь логика оплаты подписки звездами
      setShowInsufficientError(false);
      alert(`Оплачено ${selected.stars} ⭐️`);
    } else {
      setShowInsufficientError(true);
      // Автоматически скрываем ошибку через 5 секунд
      setTimeout(() => setShowInsufficientError(false), 5000);
    }
  };

  const selectedPlanData = plans.find((p) => p.id === selectedPlan);
  const hasInsufficientBalance =
    selectedPlanData?.active && starsBalance < (selectedPlanData?.stars || 0);

  return (
    <div className="topup-page">
      <div className="container">
        {/* Заголовок */}
        <div className="topup__header">
          <h1 className="topup__title">{t("subscription_title")}</h1>
          <p className="topup__subtitle">{t("subscription_subtitle")}</p>
        </div>

        {/* Баланс звезд */}
        <div className="stars-balance">
          <div className="stars-balance__info">
            <span className="stars-balance__label">
              {t("stars_balance") || "Баланс звезд"}
            </span>
            {isLoading ? (
              <div className="stars-balance__skeleton"></div>
            ) : (
              <div className="stars-balance__value">
                <span
                  className={`stars-balance__number ${hasInsufficientBalance ? "stars-balance__number--warning" : ""}`}
                >
                  {starsBalance}
                </span>
                <span className="stars-balance__icon">⭐️</span>
              </div>
            )}
          </div>
          <button className="stars-balance__button" onClick={handleTopUp}>
            <span>{t("top_up") || "Пополнить"}</span>
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
                ${selectedPlan === plan.id && hasInsufficientBalance && showInsufficientError ? "plan-card--insufficient" : ""}
              `}
              onClick={() => {
                if (plan.active) {
                  setSelectedPlan(plan.id);
                  setShowInsufficientError(false);
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
                  <span className="plan-card__price-value">
                    {formatStars(plan.stars)}
                  </span>
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
                        {Math.round((plan.stars / plan.days) * 10) / 10} ⭐️/
                        {t("day") || "день"}
                      </div>
                      {plan.id === "3months" && (
                        <div className="plan-card__savings">
                          {t("economy")} 20 ⭐️
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Кнопка оформления и сообщение об ошибке */}
        {selectedPlanData?.active && (
          <div className="topup__action">
            <button
              className={`topup__button ${showInsufficientError ? "topup__button--error" : ""}`}
              onClick={handleSubscribe}
            >
              <span>{t("subscribe")}</span>
              <span className="topup__button-price">
                {formatStars(selectedPlanData.stars)}
              </span>
            </button>

            {showInsufficientError && (
              <div className="topup__error">
                <span className="topup__error-icon">⚠️</span>
                <p className="topup__error-text">
                  {t("insufficient_balance") || "Недостаточно средств."}{" "}
                  <button className="topup__error-link" onClick={handleTopUp}>
                    {t("please_top_up") || "Пожалуйста, пополните баланс"}
                  </button>
                </p>
              </div>
            )}

            <p className="topup__terms">{t("terms")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
