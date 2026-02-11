import { useState } from "react";
import { useLanguage } from "./LanguageContext";
import "./Topup.css";

export default function Topup() {
  const { t } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<string>("month");

  const plans = [
    {
      id: "month",
      name: t("month"),
      price: 80,
      discount: 0,
      popular: false,
      days: 30,
    },
    {
      id: "3months",
      name: t("months_3"),
      price: 210,
      discount: 12,
      popular: true,
      days: 90,
    },
    {
      id: "6months",
      name: t("months_6"),
      price: 450,
      discount: 25,
      popular: false,
      days: 180,
    },
    {
      id: "year",
      name: t("year"),
      price: 900,
      discount: 32,
      popular: false,
      days: 365,
    },
  ];

  const formatPrice = (price: number) => {
    return `${price} ₽`;
  };

  return (
    <div className="topup-page">
      <div className="container">
        {/* Заголовок */}
        <div className="topup__header">
          <h1 className="topup__title">{t("subscription_title")}</h1>
          <p className="topup__subtitle">{t("subscription_subtitle")}</p>
        </div>

        {/* Список тарифов */}
        <div className="plans-grid">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card ${selectedPlan === plan.id ? "plan-card--active" : ""} ${plan.popular ? "plan-card--popular" : ""}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="plan-card__badge">
                  <span>🔥 {t("popular")}</span>
                </div>
              )}

              <div className="plan-card__content">
                <div className="plan-card__header">
                  <h3 className="plan-card__name">{plan.name}</h3>
                </div>

                <div className="plan-card__price">
                  <span className="plan-card__price-value">
                    {formatPrice(plan.price)}
                  </span>
                  {plan.discount > 0 && (
                    <span className="plan-card__discount">
                      -{plan.discount}%
                    </span>
                  )}
                </div>

                <div className="plan-card__features">
                  <div className="plan-card__feature">
                    <span className="plan-card__feature-icon">✓</span>
                    <span>
                      {t("full_access") || "Полный доступ ко всем функциям"}
                    </span>
                  </div>
                  <div className="plan-card__feature">
                    <span className="plan-card__feature-icon">✓</span>
                    <span>
                      {t("priority_support") || "Приоритетная поддержка"}
                    </span>
                  </div>
                  <div className="plan-card__feature">
                    <span className="plan-card__feature-icon">✓</span>
                    <span>{t("unlimited") || "Без ограничений"}</span>
                  </div>
                </div>

                <div className="plan-card__footer">
                  <div className="plan-card__price-per-day">
                    {Math.round(plan.price / plan.days)} {t("per_day")}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Кнопка оформления */}
        <div className="topup__action">
          <button className="topup__button">
            <span>{t("subscribe")}</span>
            <span className="topup__button-price">
              {formatPrice(
                plans.find((p) => p.id === selectedPlan)?.price || 0,
              )}
            </span>
          </button>
          <p className="topup__terms">{t("terms")}</p>
        </div>
      </div>
    </div>
  );
}
