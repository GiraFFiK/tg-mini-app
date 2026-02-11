import { useLanguage } from "./LanguageContext";

interface SubscriptionCardProps {
  daysLeft: number;
  totalDays?: number;
  isActive?: boolean;
  expiryDate?: string;
}

export default function SubscriptionCard({
  daysLeft = 15,
  totalDays = 30,
  isActive = true,
  expiryDate = "25.03.2026",
}: SubscriptionCardProps) {
  const { t } = useLanguage();
  const progressPercentage = ((totalDays - daysLeft) / totalDays) * 100;

  return (
    <div
      className={`subscription-card ${!isActive ? "subscription-card--empty" : ""}`}
    >
      <div className="subscription-card__header">
        <span className="subscription-card__title">{t("subscription")}</span>
        <span className="subscription-card__badge">
          {isActive ? t("active") : t("inactive") || "Неактивна"}
        </span>
      </div>

      <div className="subscription-card__content">
        <div className="subscription-card__days">
          <span className="subscription-card__days-number">{daysLeft}</span>
          <span className="subscription-card__days-label">
            {t("days_left")}
          </span>
        </div>

        <div className="subscription-card__progress">
          <div
            className="subscription-card__progress-bar"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="subscription-card__footer">
          <span className="subscription-card__date">
            {t("valid_until")} {expiryDate}
          </span>
        </div>
      </div>
    </div>
  );
}