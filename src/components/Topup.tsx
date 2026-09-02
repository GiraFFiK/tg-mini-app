import { useState } from "react";
import { useLanguage } from "./LanguageContext";
import starsIcon from "../public/6514f1e6-dab4-4d49-806a-3ff22d7793e5.webp";
import "./Topup.css";
import type { AppUser } from "../types/app";

type PaymentStatus = "paid" | "failed" | "cancelled" | "pending";
type PlanId = "month" | "3months" | "6months" | "year";

interface TopupProps {
  user?: AppUser | null;
  isMobile?: boolean;
}

interface SubscriptionPlan {
  id: PlanId;
  name: string;
  months: number;
  stars: number;
  popular?: boolean;
}

const MONTHLY_REFERENCE_PRICE = 60;

function DeviceIllustration() {
  return (
    <div className="multi-device-offer__visual" aria-hidden="true">
      <span className="multi-device-offer__device multi-device-offer__device--desktop">
        <svg viewBox="0 0 32 32" fill="none">
          <rect x="3" y="5" width="26" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
          <path d="M11 28h10M16 23v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      <span className="multi-device-offer__device multi-device-offer__device--tablet">
        <svg viewBox="0 0 32 32" fill="none">
          <rect x="6" y="3" width="20" height="26" rx="4" stroke="currentColor" strokeWidth="2" />
          <circle cx="16" cy="25" r="1" fill="currentColor" />
        </svg>
      </span>
      <span className="multi-device-offer__device multi-device-offer__device--phone">
        <svg viewBox="0 0 32 32" fill="none">
          <rect x="9" y="2" width="14" height="28" rx="4" stroke="currentColor" strokeWidth="2" />
          <path d="M14 6h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="16" cy="26" r="1" fill="currentColor" />
        </svg>
      </span>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Topup({ user, isMobile = true }: TopupProps) {
  const { t, language } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("3months");
  const [processing, setProcessing] = useState(false);
  const [showError, setShowError] = useState(false);

  const telegramId = user?.telegramId;
  const plans: SubscriptionPlan[] = [
    { id: "month", name: t("month"), months: 1, stars: 60 },
    { id: "3months", name: t("months_3"), months: 3, stars: 155, popular: true },
    { id: "6months", name: t("months_6"), months: 6, stars: 330 },
    { id: "year", name: t("year"), months: 12, stars: 650 },
  ];

  const selectedPlanData = plans.find((plan) => plan.id === selectedPlan) ?? plans[1];
  const numberFormatter = new Intl.NumberFormat(language === "ru" ? "ru-RU" : "en-US", {
    maximumFractionDigits: 1,
  });

  const vibrate = (type: "selection" | "impact" = "selection") => {
    const haptics = window.Telegram?.WebApp?.HapticFeedback;
    if (haptics) {
      if (type === "impact") {
        haptics.impactOccurred("medium");
      } else {
        haptics.selectionChanged?.();
      }
      return;
    }
    navigator.vibrate?.(type === "impact" ? 35 : 20);
  };

  const handleSelectPlan = (planId: PlanId) => {
    vibrate();
    setSelectedPlan(planId);
    setShowError(false);
  };

  const handleTopUp = () => {
    vibrate("impact");
    window.Telegram?.WebApp?.openTelegramLink?.("https://t.me/PremiumBot");
  };

  const handleSubscribe = async () => {
    if (!telegramId) return;

    vibrate("impact");
    setProcessing(true);
    setShowError(false);

    try {
      const tg = window.Telegram?.WebApp;

      if (!tg) {
        alert(t("telegram_connect_error"));
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
      const cleanApiUrl = API_URL.replace(/\/$/, "");
      const initData = tg.initData;

      if (!initData) {
        throw new Error("Missing Telegram initData");
      }

      const response = await fetch(`${cleanApiUrl}/invoice/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Telegram-Init-Data": initData,
        },
        body: JSON.stringify({ plan: selectedPlan }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to create invoice");
      }

      if (!data.invoiceLink || !data.invoiceLink.startsWith("https://")) {
        throw new Error("Invalid invoice link");
      }

      tg.openInvoice(data.invoiceLink, (status: PaymentStatus) => {
        if (status === "paid") {
          sessionStorage.setItem("justPurchased", "true");
          alert(t("payment_success"));
          window.location.reload();
        } else if (status === "failed") {
          alert(t("payment_failed"));
        }
      });
    } catch (error: unknown) {
      console.error("Payment error:", error);
      setShowError(true);
      window.setTimeout(() => setShowError(false), 5000);
    } finally {
      setProcessing(false);
    }
  };

  const topupStyle = {
    paddingTop: isMobile ? "calc(env(safe-area-inset-top) + 76px)" : "32px",
  };

  return (
    <div className="topup-page" style={topupStyle}>
      <div className="container">
        <header className="topup__header">
          <h1 className="topup__title">{t("subscription_title")}</h1>
          <p className="topup__subtitle">{t("subscription_subtitle")}</p>
        </header>

        <section className="multi-device-offer">
          <div className="multi-device-offer__content">
            <span className="multi-device-offer__eyebrow">{t("one_subscription")}</span>
            <h2>{t("multi_device_title")}</h2>
            <p>{t("multi_device_description")}</p>
            <div className="multi-device-offer__tags">
              <span>{t("all_platforms_feature")}</span>
              <span>{t("one_config_feature")}</span>
            </div>
          </div>
          <DeviceIllustration />
        </section>

        <section className="period-picker">
          <div className="period-picker__header">
            <div>
              <h2>{t("choose_period")}</h2>
              <p>{t("choose_period_hint")}</p>
            </div>
            <span className="period-picker__device-limit">{t("up_to_five_devices")}</span>
          </div>

          <div className="period-options" role="radiogroup" aria-label={t("choose_period")}>
            {plans.map((plan) => {
              const monthlyPrice = plan.stars / plan.months;
              const savings = MONTHLY_REFERENCE_PRICE * plan.months - plan.stars;
              const isSelected = selectedPlan === plan.id;

              return (
                <button
                  key={plan.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={isSelected ? "period-option period-option--active" : "period-option"}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  <span className="period-option__selector" aria-hidden="true">
                    {isSelected && <span />}
                  </span>
                  <span className="period-option__copy">
                    <span className="period-option__title-row">
                      <strong>{plan.name}</strong>
                      {plan.popular && <span className="period-option__popular">{t("best_choice")}</span>}
                    </span>
                    <small>
                      {savings > 0
                        ? `${t("save_label")} ${savings} Stars`
                        : t("flexible_start")}
                    </small>
                  </span>
                  <span className="period-option__price">
                    <strong>
                      {plan.stars}
                      <img src={starsIcon} alt="" aria-hidden="true" />
                    </strong>
                    <small>
                      {numberFormatter.format(monthlyPrice)} {t("per_month_stars")}
                    </small>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="plan-includes">
          <h2>{t("included_title")}</h2>
          <div className="plan-includes__grid">
            <span><CheckIcon />{t("up_to_five_devices")}</span>
            <span><CheckIcon />{t("full_access")}</span>
            <span><CheckIcon />{t("priority_support")}</span>
            <span><CheckIcon />{t("unlimited")}</span>
          </div>
        </section>

        <section className="plan-checkout">
          <div className="plan-checkout__summary">
            <span>{t("checkout_title")}</span>
            <strong>{selectedPlanData.name} · {t("up_to_five_devices")}</strong>
          </div>
          <button
            type="button"
            className={showError ? "plan-checkout__button plan-checkout__button--error" : "plan-checkout__button"}
            onClick={handleSubscribe}
            disabled={processing || !telegramId}
          >
            <span>{processing ? t("processing") : t("subscribe")}</span>
            <span className="plan-checkout__price">
              {selectedPlanData.stars}
              <img src={starsIcon} alt="" aria-hidden="true" />
            </span>
          </button>
          <p className="plan-checkout__terms">{t("terms")}</p>
          {showError && (
            <p className="plan-checkout__error" role="alert">
              {t("payment_create_error")}
            </p>
          )}
        </section>

        <div className="stars-wallet-row">
          <img src={starsIcon} alt="" aria-hidden="true" />
          <span>
            <strong>{t("stars_payment_title")}</strong>
            <small>{t("stars_topup_hint")}</small>
          </span>
          <button type="button" onClick={handleTopUp}>{t("top_up")}</button>
        </div>
      </div>
    </div>
  );
}
