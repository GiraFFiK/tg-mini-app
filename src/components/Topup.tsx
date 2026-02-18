import { useState, useEffect } from "react";
import { useLanguage } from "./LanguageContext";
import starsIcon from "../public/6514f1e6-dab4-4d49-806a-3ff22d7793e5.webp";
import "./Topup.css";
import { purchaseSubscription } from "../services/api";
import { useRefresh } from "../../hooks/useRefresh";

interface TopupProps {
  user?: any;
}

export default function Topup({ user }: TopupProps) {
  const { t } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<string>("month");
  const [starsBalance, setStarsBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showInsufficientError, setShowInsufficientError] =
    useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);

  const telegramId = user?.telegramId;

  // Функция получения баланса звезд
  const fetchStarsBalance = async () => {
    // TODO: Реальный запрос к бэкенду
    setTimeout(() => {
      setStarsBalance(40);
      setIsLoading(false);
    }, 500);
  };

  const { refresh, refreshing } = useRefresh(fetchStarsBalance);

  // Загрузка данных
  useEffect(() => {
    fetchStarsBalance();
  }, []);

  // Автообновление при фокусе
  useEffect(() => {
    const handleFocus = () => {
      refresh();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [refresh]);

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

  const handleTopUp = () => {
    window.Telegram?.WebApp?.openTelegramLink?.("https://t.me/PremiumBot");
  };

  const handleSubscribe = async () => {
    const selected = plans.find((p) => p.id === selectedPlan);
    if (!selected?.active || !telegramId) return;

    if (starsBalance >= selected.stars) {
      setProcessing(true);
      try {
        const result = await purchaseSubscription(
          telegramId,
          selectedPlan,
          selected.stars,
        );

        if (result.success) {
          alert(`✅ Подписка оформлена! Добавлено ${result.daysLeft} дней.`);
          setShowInsufficientError(false);
          // Помечаем, что была покупка для обновления на Home
          sessionStorage.setItem("justPurchased", "true");
          // Обновляем баланс после покупки
          refresh();
        }
      } catch (error) {
        console.error("Purchase error:", error);
        alert("❌ Ошибка при оформлении подписки");
      } finally {
        setProcessing(false);
      }
    } else {
      setShowInsufficientError(true);
      setTimeout(() => setShowInsufficientError(false), 5000);
    }
  };

  const selectedPlanData = plans.find((p) => p.id === selectedPlan);
  const hasInsufficientBalance =
    selectedPlanData?.active && starsBalance < (selectedPlanData?.stars || 0);

  return (
    <div className="topup-page">
      <div className="container">
        {/* Индикатор обновления */}
        {refreshing && (
          <div className="refresh-indicator">
            <div className="refresh-spinner"></div>
            <span>Обновление баланса...</span>
          </div>
        )}

        {/* Заголовок с кнопкой обновления */}
        <div
          className="topup__header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h1 className="topup__title">{t("subscription_title")}</h1>
            <p className="topup__subtitle">{t("subscription_subtitle")}</p>
          </div>
          <button
            className={`refresh-button ${refreshing ? "refreshing" : ""}`}
            onClick={refresh}
            disabled={refreshing}
            title="Обновить баланс"
          >
            <svg
              width="20"
              height="20"
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
          </button>
        </div>
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
                <img
                  src={starsIcon}
                  alt="⭐"
                  className="stars-balance__icon"
                  width="32"
                  height="32"
                />
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

        {/* Кнопка оформления и сообщение об ошибке */}
        {selectedPlanData?.active && (
          <div className="topup__action">
            <button
              className={`topup__button ${showInsufficientError ? "topup__button--error" : ""}`}
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
          </div>
        )}
      </div>
    </div>
  );
}
