import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";
import { getReferralInfo } from "../services/api";
import { useRefresh } from "../../hooks/useRefresh";
import type { AppUser, ReferralInfo } from "../types/app";
import "./Referral.css";

const referralMemoryCache = new Map<string, ReferralInfo>();

function readReferralCache(telegramId?: string) {
  if (!telegramId) return null;
  const memoryValue = referralMemoryCache.get(telegramId);
  if (memoryValue) return memoryValue;

  try {
    const storedValue = sessionStorage.getItem(`referral-data:${telegramId}`);
    if (!storedValue) return null;
    const parsedValue = JSON.parse(storedValue) as ReferralInfo;
    referralMemoryCache.set(telegramId, parsedValue);
    return parsedValue;
  } catch {
    return null;
  }
}

function saveReferralCache(telegramId: string, data: ReferralInfo) {
  referralMemoryCache.set(telegramId, data);
  sessionStorage.setItem(`referral-data:${telegramId}`, JSON.stringify(data));
}

interface ReferralProps {
  user?: AppUser | null;
  isMobile?: boolean;
}

export default function Referral({ user, isMobile = true }: ReferralProps) {
  const { t } = useLanguage();
  const telegramId = user?.telegramId;
  const [copied, setCopied] = useState(false);
  const [showAllReferrals, setShowAllReferrals] = useState(false);
  const [referralData, setReferralData] = useState<ReferralInfo | null>(() => readReferralCache(telegramId));

  const vibrate = () => {
    const feedback = window.Telegram?.WebApp?.HapticFeedback;
    if (feedback) {
      feedback.impactOccurred?.("light");
      return;
    }
    navigator.vibrate?.(25);
  };

  const fetchReferralData = useCallback(async () => {
    if (!telegramId) return;
    try {
      const data = await getReferralInfo(telegramId);
      setReferralData(data);
      saveReferralCache(telegramId, data);
    } catch (error) {
      console.error("Error fetching referral data:", error);
    }
  }, [telegramId]);

  const { refresh } = useRefresh(fetchReferralData);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const cachedData = readReferralCache(telegramId);
      if (cachedData) setReferralData(cachedData);
      void fetchReferralData();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchReferralData, telegramId]);

  useEffect(() => {
    const handleFocus = () => refresh();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") refresh();
    };
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refresh]);

  useEffect(() => {
    const interval = window.setInterval(refresh, 60000);
    return () => window.clearInterval(interval);
  }, [refresh]);

  const handleCopyLink = async () => {
    if (!referralData?.referralLink) return;
    vibrate();
    try {
      await navigator.clipboard.writeText(referralData.referralLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Could not copy referral link:", error);
    }
  };

  const handleShareLink = () => {
    if (!referralData?.referralLink) return;
    vibrate();
    window.Telegram?.WebApp?.openTelegramLink?.(
      `https://t.me/share/url?url=${encodeURIComponent(referralData.referralLink)}&text=${encodeURIComponent(t("share_text"))}`,
    );
  };

  const referrals = referralData?.invitedList || [];
  const visibleReferrals = showAllReferrals ? referrals : referrals.slice(0, 4);

  return (
    <div
      className="referral-page friends-dashboard"
      style={{ paddingTop: isMobile ? "calc(env(safe-area-inset-top) + 76px)" : "32px" }}
    >
      <div className="container">
        <header className="referral__header">
          <span className="page-heading__eyebrow">AuraVPN</span>
          <h1 className="referral__title">{t("referral_title")}</h1>
          <p className="referral__subtitle">{t("referral_subtitle")}</p>
        </header>

        <section className="friends-hero">
          <div className="friends-hero__copy">
            <span>{t("friend_reward_eyebrow")}</span>
            <h2>{t("friend_reward_title")}</h2>
            <p>{t("friend_reward_description")}</p>
          </div>
          <div className="friends-hero__visual" aria-hidden="true">
            <span className="friends-hero__person friends-hero__person--left"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg></span>
            <span className="friends-hero__person friends-hero__person--right"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg></span>
            <span className="friends-hero__link"><svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.2" strokeLinecap="round" /></svg></span>
            <strong>+3</strong>
          </div>
        </section>

        <section className="friends-results">
          <div className="section-heading-row"><div><span className="section-kicker">{t("your_results")}</span><h2>{t("bonus_days")}</h2></div></div>
          <div className="friends-results__grid">
            <div><span>{t("total_invited")}</span><strong>{referralData?.totalInvited || 0}</strong></div>
            <div><span>{t("activated")}</span><strong>{referralData?.activatedCount || 0}</strong></div>
            <div className="friends-results__bonus"><span>{t("bonus_days")}</span><strong>+{referralData?.totalBonus || 0}</strong></div>
          </div>
        </section>

        <section className="invite-panel">
          <div className="section-heading-row">
            <div><span className="section-kicker">{t("invitation_ready")}</span><h2>{t("your_link")}</h2></div>
            <span className="invite-panel__status"><i /> {t("active")}</span>
          </div>
          <p>{t("invitation_hint")}</p>
          <div className="invite-link"><code>{referralData?.referralLink || t("updating")}</code></div>
          <div className="invite-actions">
            <button className="invite-actions__copy" type="button" disabled={!referralData?.referralLink} onClick={handleCopyLink}>
              {copied ? (
                <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>{t("copied")}</>
              ) : (
                <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>{t("copy")}</>
              )}
            </button>
            <button className="invite-actions__share" type="button" disabled={!referralData?.referralLink} onClick={handleShareLink}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 2-7 20-4-9-9-4 20-7Z" strokeLinecap="round" strokeLinejoin="round" /><path d="M22 2 11 13" /></svg>{t("share")}
            </button>
          </div>
        </section>

        <section className="friends-list-panel">
          <div className="section-heading-row">
            <div><span className="section-kicker">{t("friends_activity")}</span><h2>{t("invited_friends")}</h2></div>
            {referrals.length > 0 && <span className="section-count">{referrals.length}</span>}
          </div>

          {referrals.length > 0 ? (
            <>
              <div className="friends-list">
                {visibleReferrals.map((referral) => (
                  <div key={referral.id} className="friend-row">
                    <div className="friend-row__avatar">
                      {referral.photoUrl ? <img src={referral.photoUrl} alt={referral.username || referral.firstName || ""} /> : <span>{referral.firstName?.[0] || referral.username?.[0] || "U"}</span>}
                    </div>
                    <div className="friend-row__copy"><strong>{referral.username ? `@${referral.username}` : referral.firstName || "User"}</strong><small>{referral.date}</small></div>
                    <div className={referral.status === "activated" ? "friend-row__reward friend-row__reward--active" : "friend-row__reward"}>
                      {referral.status === "activated" ? `+${referral.bonus} ${t("bonus_days_short")}` : t("pending")}
                    </div>
                  </div>
                ))}
              </div>
              {referrals.length > 4 && (
                <button className="friends-list-panel__more" type="button" onClick={() => setShowAllReferrals(!showAllReferrals)}>
                  {showAllReferrals ? t("show_less") : t("show_more")}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: showAllReferrals ? "rotate(180deg)" : "none" }}><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              )}
            </>
          ) : (
            <div className="friends-empty">
              <span><svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" strokeLinecap="round" /></svg></span>
              <div><strong>{t("no_referrals")}</strong><small>{t("share_link_hint")}</small></div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
