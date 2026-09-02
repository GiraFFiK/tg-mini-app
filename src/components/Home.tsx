import { useState, useEffect, useCallback, useRef } from "react";
import { useLanguage } from "./LanguageContext";
import starsIcon from "../public/6514f1e6-dab4-4d49-806a-3ff22d7793e5.webp";
import "./Home.css";
import apple from "../public/apple1-logo-svgrepo-com.svg";
import android from "../public/android-svgrepo-com.svg";
import windows from "../public/microsoft-windows-22-logo-svgrepo-com.svg";
import {
  getSubscription,
  getActivationCode,
  regenerateActivationCode,
  getFullHistory,
} from "../services/api";
import type { AppUser, HistoryItem, SubscriptionData } from "../types/app";

type HomeCacheData = {
  subscription: SubscriptionData | null;
  activationCode: string;
  history: HistoryItem[];
};

const homeMemoryCache = new Map<string, HomeCacheData>();

function getHomeCache(telegramId: string): HomeCacheData | null {
  if (!telegramId) return null;

  const memoryValue = homeMemoryCache.get(telegramId);
  if (memoryValue) return memoryValue;

  try {
    const storedValue = sessionStorage.getItem(`home-data:${telegramId}`);
    if (!storedValue) return null;
    const parsedValue = JSON.parse(storedValue) as HomeCacheData;
    homeMemoryCache.set(telegramId, parsedValue);
    return parsedValue;
  } catch {
    return null;
  }
}

function updateHomeCache(telegramId: string, patch: Partial<HomeCacheData>) {
  if (!telegramId) return;

  const currentValue = getHomeCache(telegramId) || {
    subscription: null,
    activationCode: "",
    history: [],
  };
  const nextValue = { ...currentValue, ...patch };
  homeMemoryCache.set(telegramId, nextValue);
  sessionStorage.setItem(`home-data:${telegramId}`, JSON.stringify(nextValue));
}

interface HomeProps {
  user?: AppUser | null;
  isMobile?: boolean;
  isActive?: boolean;
  requestedInstruction?: "region" | "setup" | null;
  onInstructionOpened?: () => void;
  onNavigate?: (page: string) => void;
}

export default function Home({
  user,
  isMobile = true,
  isActive = true,
  requestedInstruction = null,
  onInstructionOpened,
  onNavigate,
}: HomeProps) {
  const { t, language } = useLanguage();
  const tg = window.Telegram?.WebApp;
  const tgUser = tg?.initDataUnsafe?.user;
  const username =
    tgUser?.username || tgUser?.first_name || user?.username || "User";
  const firstName = tgUser?.first_name || user?.firstName || "";
  const lastName = tgUser?.last_name || user?.lastName || "";
  const photoUrl = tgUser?.photo_url;
  const telegramId = user?.telegramId || String(tgUser?.id || "");
  const initialCache = getHomeCache(telegramId);

  const [showAllHistory, setShowAllHistory] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [activationCode, setActivationCode] = useState(initialCache?.activationCode || "");
  const [subscription, setSubscription] = useState<SubscriptionData | null>(
    initialCache?.subscription || null,
  );
  const [subscriptionLoaded, setSubscriptionLoaded] = useState(
    Boolean(initialCache?.subscription),
  );
  const [activeInstruction, setActiveInstruction] = useState<"region" | "setup" | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(initialCache?.history || []);
  const refreshingRef = useRef(false);

  const initials =
    `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";

  // Функция загрузки данных подписки
  const fetchSubscriptionData = useCallback(async () => {
    if (!telegramId) return;

    try {
      const subData = await getSubscription(telegramId);
      console.log("📦 Данные подписки:", subData);
      
      if (subData && typeof subData.isActive === 'boolean') {
        const nextSubscription = {
          isActive: subData.isActive,
          daysLeft: subData.daysLeft || 0,
          subscriptionUntil: subData.subscriptionUntil || null
        };
        setSubscription(nextSubscription);
        setSubscriptionLoaded(true);
        updateHomeCache(telegramId, { subscription: nextSubscription });
      }
    } catch (error) {
      console.error("Ошибка fetchSubscriptionData:", error);
    }
  }, [telegramId]);

  // Функция для загрузки кода активации
  const fetchActivationCodeData = useCallback(async () => {
    if (!telegramId) return;

    try {
      const codeData = await getActivationCode(telegramId);
      console.log("🔑 Данные кода активации:", codeData);
      
      if (codeData.hasSubscription && codeData.code) {
        setActivationCode(codeData.code);
        updateHomeCache(telegramId, { activationCode: codeData.code });
      } else {
        setActivationCode("");
        updateHomeCache(telegramId, { activationCode: "" });
      }
    } catch (error) {
      console.error("Ошибка fetchActivationCodeData:", error);
    }
  }, [telegramId]);

  // Функция загрузки истории
  const fetchHistoryData = useCallback(async () => {
    if (!telegramId) return;

    try {
      const historyData = await getFullHistory(telegramId);
      console.log("📚 История загружена:", historyData);
      const nextHistory = Array.isArray(historyData) ? historyData : [];
      setHistory(nextHistory);
      updateHomeCache(telegramId, { history: nextHistory });
    } catch (error) {
      console.error("Ошибка загрузки истории:", error);
    }
  }, [telegramId]);

  // Общая функция загрузки всех данных
  const fetchAllData = useCallback(async () => {
    if (!telegramId || refreshingRef.current) return;
    refreshingRef.current = true;
    try {
      await Promise.all([
        fetchSubscriptionData(),
        fetchActivationCodeData(),
        fetchHistoryData()
      ]);
    } finally {
      refreshingRef.current = false;
    }
  }, [fetchActivationCodeData, fetchHistoryData, fetchSubscriptionData, telegramId]);

  // Загрузка данных при монтировании
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    if (isActive) fetchAllData();
  }, [isActive, fetchAllData]);

  // Автоматическое обновление при возвращении на страницу
  useEffect(() => {
    const handleFocus = () => {
      fetchAllData();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchAllData();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchAllData]);

  // Периодическое обновление каждые 30 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllData();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchAllData]);

  // Обновление после возвращения с покупки
  useEffect(() => {
    const justPurchased = sessionStorage.getItem("justPurchased");
    if (justPurchased === "true") {
      fetchAllData();
      sessionStorage.removeItem("justPurchased");
    }
  }, [fetchAllData]);

  // Обработчики событий
  const vibrate = () => {
    const tg = window.Telegram?.WebApp;

    if (tg?.HapticFeedback) {
      tg.HapticFeedback.impactOccurred("medium");
      return;
    }

    navigator.vibrate?.(35);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(""), 2200);
  };

  const handleCopyCode = () => {
    if (!subscription?.isActive) return;
    vibrate();
    navigator.clipboard.writeText(activationCode);
    setCopied(true);
    showToast(t("copied_to_clipboard"));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateNewCode = async () => {
    if (!subscription?.isActive) return;
    vibrate();

    try {
      const result = await regenerateActivationCode(telegramId);
      setActivationCode(result.code);
      updateHomeCache(telegramId, { activationCode: result.code });
      setCopied(false);
      showToast(t("config_changed"));
    } catch (error) {
      console.error("Error regenerating code:", error);
    }
  };

  const openInstruction = (instruction: "region" | "setup") => {
    vibrate();
    setActiveInstruction(instruction);
  };

  const closeInstruction = () => {
    setActiveInstruction(null);
  };

  useEffect(() => {
    if (!requestedInstruction) return;
    setActiveInstruction(requestedInstruction);
    onInstructionOpened?.();
  }, [onInstructionOpened, requestedInstruction]);

  // Получение инструкции и ссылки для устройства
  const deviceDownloadLinks: Record<string, string> = {
    ios: "https://apps.apple.com/en/app/v2raytun/id6476628951",
    android: "https://play.google.com/store/apps/details?id=com.v2raytun.android",
    windows: "https://storage.v2raytun.com/v2RayTun_Setup.exe",
    macos: "https://apps.apple.com/en/app/v2raytun/id6476628951",
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

  const appStoreRegionSteps = [
    {
      number: 1,
      title: t("region_step_account_title"),
      description: t("region_step_account_description"),
    },
    {
      number: 2,
      title: t("region_step_country_title"),
      description: t("region_step_country_description"),
    },
    {
      number: 3,
      title: t("region_step_usa_title"),
      description: t("region_step_usa_description"),
    },
    {
      number: 4,
      title: t("region_step_address_title"),
      description: t("region_step_address_description"),
    },
    {
      number: 5,
      title: t("region_step_download_title"),
      description: t("region_step_download_description"),
    },
  ];

  const setupSteps = [
    {
      number: 1,
      title: t("setup_step_download_title"),
      description: t("setup_step_download_description"),
    },
    {
      number: 2,
      title: t("setup_step_copy_title"),
      description: t("setup_step_copy_description"),
    },
    {
      number: 3,
      title: t("setup_step_import_title"),
      description: t("setup_step_import_description"),
    },
    {
      number: 4,
      title: t("setup_step_connect_title"),
      description: t("setup_step_connect_description"),
    },
  ];

  // Динамический padding-top в зависимости от платформы
  const homeStyle = {
    paddingTop: isMobile ? 'calc(env(safe-area-inset-top) + 76px)' : '32px',
  };

  const hasSubscription = subscription?.isActive || false;
  const daysLeft = subscription?.daysLeft || 0;
  const expiryDate = subscription?.subscriptionUntil
    ? new Date(subscription.subscriptionUntil).toLocaleDateString(language === "ru" ? "ru-RU" : "en-US")
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
  const getItemType = (item: HistoryItem) => {
    if (item.type === 'purchase') {
      return getPlanName(item.plan);
    } else if (item.type === 'welcome_bonus') {
      return t("welcome_bonus");
    } else if (item.type === 'referral_bonus') {
      return t("referral_bonus");
    }
    return '';
  };

  const currentInstructionSteps =
    activeInstruction === "region" ? appStoreRegionSteps : setupSteps;

  return (
    <div className="home" style={homeStyle}>
      {toastMessage && (
        <div className="home-toast" role="status" aria-live="polite">
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
          <span>{toastMessage}</span>
        </div>
      )}
      {activeInstruction && (
        <div className="instruction-modal" role="dialog" aria-modal="true">
          <button
            className="instruction-modal__backdrop"
            type="button"
            aria-label={t("close")}
            onClick={closeInstruction}
          />
          <div className="instruction-modal__panel">
            <div className="instruction-modal__header">
              <div>
                <p className="instruction-modal__eyebrow">
                  {t("instructions")}
                </p>
                <h3 className="instruction-modal__title">
                  {activeInstruction === "region"
                    ? t("region_instruction_title")
                    : t("setup_instruction_title")}
                </h3>
              </div>
              <button
                className="instruction-modal__close"
                type="button"
                aria-label={t("close")}
                onClick={closeInstruction}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18" strokeLinecap="round" />
                  <path d="M6 6L18 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="instruction-modal__body">
              {activeInstruction === "setup" && (
                <div className="instruction-modal__downloads">
                  {devices.map((device) => (
                    <a
                      key={device.id}
                      className="instruction-modal__download"
                      href={deviceDownloadLinks[device.id]}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src={device.icon} alt="" />
                      <span>{device.name}</span>
                    </a>
                  ))}
                </div>
              )}

              <div className="instruction-modal__steps">
                {currentInstructionSteps.map((step) => (
                  <div key={step.number} className="instruction-modal-step">
                    <div className="instruction-modal-step__number">
                      {step.number}
                    </div>
                    <div>
                      <h4 className="instruction-modal-step__title">
                        {step.title}
                      </h4>
                      <p className="instruction-modal-step__description">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="container home-dashboard">
        <header className="home-dashboard__header">
          <div>
            <span className="home-dashboard__brand">AuraVPN</span>
            <h1>{firstName ? `${t("home_welcome")}, ${firstName}` : t("home_title")}</h1>
          </div>
          <div className="home-dashboard__avatar">
            {photoUrl ? <img src={photoUrl} alt={username} /> : <span>{initials}</span>}
          </div>
        </header>

        <section className={`home-plan ${subscriptionLoaded && !hasSubscription ? "home-plan--inactive" : ""}`}>
          <div className="home-plan__topline">
            <span>{t("subscription")}</span>
            <span className="home-plan__status">
              <i />
              {!subscriptionLoaded ? t("updating") : hasSubscription ? t("active") : t("inactive")}
            </span>
          </div>

          {!subscriptionLoaded ? (
            <div className="home-plan__loading" aria-label={t("updating")}>
              <span />
              <span />
              <span />
            </div>
          ) : hasSubscription ? (
            <>
              <div className="home-plan__main">
                <div className="home-plan__days">
                  <strong>{daysLeft}</strong>
                  <span>{t("days_left")}</span>
                </div>
                <button className="home-plan__renew" type="button" onClick={() => onNavigate?.("topup")}>
                  <span>{t("renew_subscription")}</span>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <div className="home-plan__progress" aria-hidden="true">
                <span style={{ width: `${Math.min((daysLeft / 30) * 100, 100)}%` }} />
              </div>
              <div className="home-plan__footer">
                <span>{t("valid_until")} {expiryDate}</span>
                <strong>{t("up_to_five_devices")}</strong>
              </div>
            </>
          ) : (
            <div className="home-plan__empty">
              <div>
                <h2>{t("home_no_subscription_title")}</h2>
                <p>{t("subscription_inactive")}</p>
              </div>
              <button type="button" onClick={() => onNavigate?.("topup")}>
                {t("select_plan")}
              </button>
            </div>
          )}
        </section>

        <section className="home-connect">
          <div className="section-heading-row">
            <div>
              <span className="section-kicker">{t("quick_connection")}</span>
              <h2>{t("activation_code")}</h2>
            </div>
            <span className={`connection-state ${hasSubscription ? "connection-state--ready" : ""}`}>
              <i /> {hasSubscription ? t("ready_to_connect") : t("inactive")}
            </span>
          </div>

          {!subscriptionLoaded ? (
            <div className="home-connect__loading" aria-label={t("updating")}><span /><span /></div>
          ) : hasSubscription ? (
            <>
              <button className="quick-connect-button" type="button" onClick={handleCopyCode}>
                <span className="quick-connect-button__icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" strokeLinejoin="round" />
                    <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>
                  <strong>{copied ? t("copied") : t("copy_config_action")}</strong>
                  <small>{t("copy_config_hint")}</small>
                </span>
                <svg className="quick-connect-button__arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className="config-line">
                <div className="config-line__value">
                  <span>{t("one_config_feature")}</span>
                  <code>{activationCode}</code>
                </div>
                <button type="button" title={t("copy")} aria-label={t("copy")} onClick={handleCopyCode}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="12" height="12" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
                <button type="button" title={t("replace_code")} aria-label={t("replace_code")} onClick={handleGenerateNewCode}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 7h-5V2M4 17h5v5M19 12a7 7 0 0 0-12-5L4 10M5 12a7 7 0 0 0 12 5l3-3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className="home-connect__empty">
              <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="10" width="16" height="11" rx="3" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
              <div><strong>{t("no_subscription_code")}</strong><small>{t("home_config_locked_hint")}</small></div>
            </div>
          )}

          <div className="device-coverage">
            <div className="device-coverage__icons" aria-hidden="true">
              <span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></svg></span>
              <span><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></svg></span>
              <span><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M9 18h6" /></svg></span>
            </div>
            <div><strong>{t("device_coverage")}</strong><small>{t("supported_platforms")}</small></div>
          </div>
        </section>

        <section className="home-guides">
          <div className="section-heading-row">
            <div><span className="section-kicker">{t("setup_center")}</span><h2>{t("instructions")}</h2></div>
            <small>{t("setup_center_hint")}</small>
          </div>
          <div className="home-guides__grid">
            <button type="button" onClick={() => openInstruction("setup")}>
              <span className="home-guides__icon home-guides__icon--violet">
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12M7 10l5 5 5-5M5 21h14" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <span><strong>{t("setup_instruction_button")}</strong><small>{t("setup_instruction_hint")}</small></span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button type="button" onClick={() => openInstruction("region")}>
              <span className="home-guides__icon home-guides__icon--cyan">
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9S14.5 18.5 12 21M12 3c-2.5 2.5-3.8 5.5-3.8 9s1.3 6.5 3.8 9" /></svg>
              </span>
              <span><strong>{t("region_instruction_button")}</strong><small>{t("region_instruction_hint")}</small></span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </section>

        <section className="home-activity">
          <div className="section-heading-row">
            <div><span className="section-kicker">{t("recent_activity")}</span><h2>{t("purchase_history")}</h2></div>
            {history.length > 0 && <span className="section-count">{history.length}</span>}
          </div>

          {history.length > 0 ? (
            <>
              <div className="history-list">
                {visibleHistory.map((item) => (
                  <div key={item.id} className="history-item">
                    <div className="history-item__marker">
                      {item.type === "purchase" ? (
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2l1.5 4H20l-2 8H9L6 2H2M9 20h.01M17 20h.01" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      ) : (
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 12v10H4V12M2 7h20v5H2zM12 7v15M12 7H7.5A2.5 2.5 0 1 1 10 4.5L12 7Zm0 0h4.5A2.5 2.5 0 1 0 14 4.5L12 7Z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      )}
                    </div>
                    <div className="history-item__left">
                      <div className="history-item__plan">{getItemType(item)}</div>
                      <div className="history-item__date">{item.date}</div>
                    </div>
                    <div className="history-item__right">
                      {item.type === "purchase" ? (
                        <div className="history-item__stars"><span>{item.stars}</span><img src={starsIcon} alt="Stars" width="16" height="16" /></div>
                      ) : (
                        <div className="history-item__bonus">+{item.days} {t("bonus_days_short")}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {history.length > 3 && (
                <button className="history-section__show-more" type="button" onClick={() => setShowAllHistory(!showAllHistory)}>
                  {showAllHistory ? t("show_less") : t("show_more")}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: showAllHistory ? "rotate(180deg)" : "none" }}><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              )}
            </>
          ) : (
            <div className="history-empty">
              <span className="history-empty__icon"><svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18M7 15l4-4 3 3 5-6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
              <div><strong>{t("no_purchases_title")}</strong><small>{t("no_purchases_text")}</small></div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
