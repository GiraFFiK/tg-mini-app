import { useLanguage } from "./LanguageContext";
import { useTheme } from "./ThemeContext";
import "./Settings.css";

interface SettingsProps {
  isMobile?: boolean;
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Settings({ isMobile = true }: SettingsProps) {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  const vibrate = () => {
    window.Telegram?.WebApp?.HapticFeedback?.selectionChanged?.();
  };

  const selectTheme = (nextTheme: "dark" | "light") => {
    vibrate();
    setTheme(nextTheme);
  };

  const selectLanguage = (nextLanguage: "ru" | "en") => {
    vibrate();
    setLanguage(nextLanguage);
  };

  return (
    <div
      className="settings-page"
      style={{ paddingTop: isMobile ? "calc(env(safe-area-inset-top) + 76px)" : "32px" }}
    >
      <div className="container">
        <header className="page-heading">
          <span className="page-heading__eyebrow">AuraVPN</span>
          <h1 className="page-heading__title">{t("settings")}</h1>
          <p className="page-heading__subtitle">{t("settings_subtitle")}</p>
        </header>

        <div className="settings-board">
          <section className="settings-row">
            <div className="settings-row__lead">
              <span className="settings-row__icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" strokeLinecap="round" />
                </svg>
              </span>
              <span>
                <strong>{t("appearance")}</strong>
                <small>{t("appearance_description")}</small>
              </span>
            </div>
            <div className="settings-segment" role="group" aria-label={t("appearance")}>
              <button
                className={theme === "dark" ? "settings-segment__button settings-segment__button--active" : "settings-segment__button"}
                type="button"
                onClick={() => selectTheme("dark")}
              >
                {theme === "dark" && <CheckIcon />}
                {t("theme_dark")}
              </button>
              <button
                className={theme === "light" ? "settings-segment__button settings-segment__button--active" : "settings-segment__button"}
                type="button"
                onClick={() => selectTheme("light")}
              >
                {theme === "light" && <CheckIcon />}
                {t("theme_light")}
              </button>
            </div>
          </section>

          <section className="settings-row">
            <div className="settings-row__lead">
              <span className="settings-row__icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9S14.5 18.5 12 21M12 3c-2.5 2.5-3.8 5.5-3.8 9s1.3 6.5 3.8 9" />
                </svg>
              </span>
              <span>
                <strong>{t("language")}</strong>
                <small>{t("language_description")}</small>
              </span>
            </div>
            <div className="settings-segment" role="group" aria-label={t("language")}>
              <button
                className={language === "ru" ? "settings-segment__button settings-segment__button--active" : "settings-segment__button"}
                type="button"
                onClick={() => selectLanguage("ru")}
              >
                {language === "ru" && <CheckIcon />}
                RU
              </button>
              <button
                className={language === "en" ? "settings-segment__button settings-segment__button--active" : "settings-segment__button"}
                type="button"
                onClick={() => selectLanguage("en")}
              >
                {language === "en" && <CheckIcon />}
                EN
              </button>
            </div>
          </section>
        </div>

        <section className="settings-group">
          <button className="settings-link" type="button" disabled>
            <span className="settings-row__icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
                <path d="M8 9h8M8 13h5" strokeLinecap="round" />
              </svg>
            </span>
            <span className="settings-link__copy">
              <strong>{t("support")}</strong>
              <small>{t("support_description")}</small>
            </span>
            <span className="settings-link__status">{t("support_soon")}</span>
          </button>
        </section>

        <section className="settings-about">
          <div>
            <span>{t("about_app")}</span>
            <strong>{t("app_name")}</strong>
          </div>
          <div>
            <span>{t("app_version")}</span>
            <strong>1.0.0</strong>
          </div>
        </section>
      </div>
    </div>
  );
}
