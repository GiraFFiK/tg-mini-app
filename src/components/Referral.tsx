import { useState, useEffect } from "react";
import { useLanguage } from "./LanguageContext";
import "./Referral.css";
import { getReferralInfo } from "../services/api";
import { useRefresh } from "../../hooks/useRefresh";

interface ReferralProps {
  user?: any;
}

export default function Referral({ user }: ReferralProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [showAllReferrals, setShowAllReferrals] = useState(false);
  const [referralData, setReferralData] = useState<any>(null);
  // const [loading, setLoading] = useState(true);

  const telegramId = user?.telegramId;

  const fetchReferralData = async () => {
    if (!telegramId) return;
    
    try {
      const data = await getReferralInfo(telegramId);
      setReferralData(data);
    } catch (error) {
      console.error("Error fetching referral data:", error);
    }
  };

  const { refresh } = useRefresh(fetchReferralData);

  useEffect(() => {
    const init = async () => {
      await fetchReferralData();
    };
    init();
  }, [telegramId]);

  // Автообновление
  useEffect(() => {
    const handleFocus = () => refresh();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refresh]);

  useEffect(() => {
    const interval = setInterval(refresh, 60000); // Каждую минуту
    return () => clearInterval(interval);
  }, [refresh]);

  const handleCopyLink = () => {
    if (!referralData?.referralLink) return;
    navigator.clipboard.writeText(referralData.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    // Обновляем данные после копирования (на всякий случай)
    refresh();
  };

  const handleShareLink = () => {
    if (!referralData?.referralLink) return;
    
    const text =
      t("share_text") ||
      `Присоединяйся по моей реферальной ссылке и получи 3 дня бесплатного VPN!`;
    
    window.Telegram?.WebApp?.openTelegramLink?.(
      `https://t.me/share/url?url=${encodeURIComponent(referralData.referralLink)}&text=${encodeURIComponent(text)}`,
    );
  };

  const referrals = referralData?.invitedList || [];
  const visibleReferrals = showAllReferrals ? referrals : referrals.slice(0, 4);

  return (
    <div className="referral-page">
      <div className="container">
        
        {/* Заголовок */}
        <div className="referral__header">
          <h1 className="referral__title">
            {t("referral_title") || "Реферальная система"}
          </h1>
          <p className="referral__subtitle">
            {t("referral_subtitle") || "Приглашайте друзей и получайте бонусы"}
          </p>
        </div>

        {/* Статистика */}
        <div className="referral-stats">
          <div className="referral-stat">
            <span className="referral-stat__label">
              {t("total_invited") || "Всего приглашено"}
            </span>
            <span className="referral-stat__value">{referralData?.totalInvited || 0}</span>
          </div>
          <div className="referral-stat">
            <span className="referral-stat__label">
              {t("activated") || "Активировано"} <span>&nbsp;</span>
            </span>
            <span className="referral-stat__value">{referralData?.activatedCount || 0}</span>
          </div>
          <div className="referral-stat">
            <span className="referral-stat__label">
              {t("bonus_days") || "Бонусных дней"}
            </span>
            <span className="referral-stat__value referral-stat__value--bonus">
              +{referralData?.totalBonus || 0}
            </span>
          </div>
        </div>

        {/* Информация о бонусе */}
        <div className="referral-bonus-banner">
          <div className="referral-bonus-banner__icon">🎁</div>
          <div className="referral-bonus-banner__content">
            <h3 className="referral-bonus-banner__title">
              {t("bonus_title") || "Мгновенный бонус!"}
            </h3>
            <p className="referral-bonus-banner__text">
              {t("bonus_description") ||
                "Как только друг перейдет по ссылке и запустит бота, вы оба получите по 3 дня бесплатно. Даже без покупки подписки!"}
            </p>
          </div>
        </div>

        {/* Реферальная ссылка */}
        <div className="referral-link-card">
          <h2 className="referral-link-card__title">
            {t("your_link") || "Ваша реферальная ссылка"}
          </h2>
          <p className="referral-link-card__description">
            {t("link_description") ||
              "Отправьте эту ссылку друзьям. Когда они перейдут по ней и запустят бота, вы оба получите по 3 дня бесплатно!"}
          </p>

          <div className="referral-link__container">
            <div className="referral-link__wrapper">
              <span className="referral-link__text">{referralData?.referralLink || ""}</span>
            </div>
            <div className="referral-link__actions">
              <button
                className={`referral-link__button ${copied ? "referral-link__button--copied" : ""}`}
                onClick={handleCopyLink}
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
              <button
                className="referral-link__button referral-link__button--share"
                onClick={handleShareLink}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                <span>{t("share") || "Поделиться"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Список приглашенных */}
        <div className="referrals-list-section">
          <div className="referrals-list-section__header">
            <h2 className="referrals-list-section__title">
              {t("invited_friends") || "Приглашенные друзья"}
            </h2>
            <span className="referrals-list-section__count">
              {referrals.length} {t("total") || "всего"}
            </span>
          </div>

          {referrals.length > 0 ? (
            <>
              <div className="referrals-list">
                {visibleReferrals.map((referral: any) => (
                  <div key={referral.id} className="referral-item">
                    <div className="referral-item__left">
                      <div className="referral-item__avatar">
                        {referral.firstName?.[0] || "U"}
                      </div>
                      <div className="referral-item__info">
                        <div className="referral-item__name">
                          <span className="referral-item__username">
                            @{referral.username}
                          </span>
                        </div>
                        <div className="referral-item__date">
                          {referral.date}
                        </div>
                      </div>
                    </div>
                    <div className="referral-item__right">
                      {referral.status === "activated" ? (
                        <>
                          <div className="referral-item__bonus">
                            <span className="referral-item__bonus-number">
                              +{referral.bonus}
                            </span>
                            <span className="referral-item__bonus-days">
                              {t("days") || "дн"}
                            </span>
                          </div>
                          <div className="referral-item__status referral-item__status--activated">
                            {t("activated") || "Активирован"}
                          </div>
                        </>
                      ) : (
                        <div className="referral-item__status referral-item__status--pending">
                          {t("pending") || "Ожидание"}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {referrals.length > 4 && (
                <button
                  className="referrals-list-section__show-more"
                  onClick={() => setShowAllReferrals(!showAllReferrals)}
                >
                  <span>
                    {showAllReferrals
                      ? t("show_less") || "Скрыть"
                      : t("show_more") || "Показать еще"}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    style={{
                      transform: showAllReferrals ? "rotate(180deg)" : "none",
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
            <div className="referrals-empty">
              <span className="referrals-empty__icon">👥</span>
              <p className="referrals-empty__text">
                {t("no_referrals") || "У вас пока нет приглашенных друзей"}
              </p>
              <p className="referrals-empty__hint">
                {t("share_link_hint") ||
                  "Поделитесь ссылкой и получите бонусы!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}