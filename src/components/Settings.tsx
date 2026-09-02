import { useLanguage } from "./LanguageContext";
import { useTheme } from "./ThemeContext";
import "./Settings.css";

interface SettingsProps {
  isMobile?: boolean;
  onOpenInstruction?: (instruction: "region" | "setup") => void;
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Settings({ isMobile = true, onOpenInstruction }: SettingsProps) {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  const vibrate = () => {
    const feedback = window.Telegram?.WebApp?.HapticFeedback;
    if (feedback) {
      feedback.selectionChanged?.();
      return;
    }
    navigator.vibrate?.(20);
  };

  const selectTheme = (nextTheme: "dark" | "light") => {
    vibrate();
    setTheme(nextTheme);
  };

  const selectLanguage = (nextLanguage: "ru" | "en") => {
    vibrate();
    setLanguage(nextLanguage);
  };

  const openInstruction = (instruction: "region" | "setup") => {
    vibrate();
    onOpenInstruction?.(instruction);
  };

  return (
    <div
      className="settings-page settings-dashboard"
      style={{ paddingTop: isMobile ? "calc(env(safe-area-inset-top) + 76px)" : "32px" }}
    >
      <div className="container">
        <header className="page-heading settings-dashboard__header">
          <span className="page-heading__eyebrow">AuraVPN</span>
          <h1 className="page-heading__title">{t("settings")}</h1>
          <p className="page-heading__subtitle">{t("settings_subtitle")}</p>
        </header>

        <section className="settings-panel">
          <div className="settings-panel__heading">
            <span className="settings-panel__icon settings-panel__icon--violet" aria-hidden="true">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3a9 9 0 1 0 9 9c0-1.2-.8-2-2-2h-1.2a2 2 0 0 1-2-2V6.8c0-2.3-1.5-3.8-3.8-3.8Z" />
                <circle cx="7.5" cy="12.5" r="1" fill="currentColor" stroke="none" />
                <circle cx="10" cy="7.5" r="1" fill="currentColor" stroke="none" />
                <circle cx="7.5" cy="17" r="1" fill="currentColor" stroke="none" />
              </svg>
            </span>
            <div><h2>{t("settings_interface_title")}</h2><p>{t("settings_interface_hint")}</p></div>
          </div>

          <div className="preference-block">
            <div className="preference-block__label"><strong>{t("appearance")}</strong><small>{t("appearance_description")}</small></div>
            <div className="settings-segment" role="group" aria-label={t("appearance")}>
              <button className={theme === "dark" ? "settings-segment__button settings-segment__button--active" : "settings-segment__button"} type="button" onClick={() => selectTheme("dark")}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" strokeLinejoin="round" /></svg>
                {t("theme_dark")}
              </button>
              <button className={theme === "light" ? "settings-segment__button settings-segment__button--active" : "settings-segment__button"} type="button" onClick={() => selectTheme("light")}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" /></svg>
                {t("theme_light")}
              </button>
            </div>
          </div>

          <div className="preference-block">
            <div className="preference-block__label"><strong>{t("language")}</strong><small>{t("language_description")}</small></div>
            <div className="language-options" role="group" aria-label={t("language")}>
              <button className={language === "ru" ? "language-option language-option--active" : "language-option"} type="button" onClick={() => selectLanguage("ru")}>
                <span>RU</span><strong>Русский</strong>{language === "ru" && <CheckIcon />}
              </button>
              <button className={language === "en" ? "language-option language-option--active" : "language-option"} type="button" onClick={() => selectLanguage("en")}>
                <span>EN</span><strong>English</strong>{language === "en" && <CheckIcon />}
              </button>
            </div>
          </div>
        </section>

        <section className="settings-help">
          <div className="settings-panel__heading">
            <span className="settings-panel__icon settings-panel__icon--cyan" aria-hidden="true">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.6 2.6 0 0 1 5 .9c0 2-2.5 2.1-2.5 4.1M12 18h.01" strokeLinecap="round" /></svg>
            </span>
            <div><h2>{t("settings_help_title")}</h2><p>{t("settings_help_hint")}</p></div>
          </div>

          <div className="settings-actions">
            <button type="button" onClick={() => openInstruction("setup")}>
              <span className="settings-actions__leading"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12M7 10l5 5 5-5M5 21h14" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
              <span><strong>{t("setup_instruction_button")}</strong><small>{t("setup_instruction_hint")}</small></span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button type="button" onClick={() => openInstruction("region")}>
              <span className="settings-actions__leading"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9S14.5 18.5 12 21M12 3c-2.5 2.5-3.8 5.5-3.8 9s1.3 6.5 3.8 9" /></svg></span>
              <span><strong>{t("region_instruction_button")}</strong><small>{t("region_instruction_hint")}</small></span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </section>

        <footer className="settings-meta">
          <div><span className="settings-meta__logo">A</span><span><strong>{t("app_name")}</strong><small>{t("settings_product_hint")}</small></span></div>
          <span>v1.0.0</span>
        </footer>
      </div>
    </div>
  );
}
