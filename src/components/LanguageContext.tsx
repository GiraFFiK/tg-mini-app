import { createContext, useState, useContext, useEffect } from "react";

type Language = "ru" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  ru: {
    // Общие
    subscription: "Подписка",
    active: "Активна",
    inactive: "Неактивна",
    days_left: "дней осталось",
    valid_until: "Действует до:",

    // Home
    wallet: "allet",
    days_remaining: "дней осталось",

    // Top Up
    subscription_title: "Оформление подписки",
    subscription_subtitle: "Выберите тариф и получите доступ ко всем функциям",
    month: "1 месяц",
    months_3: "3 месяца",
    months_6: "6 месяцев",
    year: "1 год",
    days: "дней",
    popular: "Популярное",
    economy: "Экономия",
    per_day: "₽/день",
    subscribe: "Оформить подписку",
    terms:
      "Нажимая кнопку, вы соглашаетесь с условиями подписки. Списание будет произведено сразу. Можно отменить в любой момент.",
    full_access: "Полный доступ ко всем функциям",
    priority_support: "Приоритетная поддержка",
    unlimited: "Без ограничений",
    stars_balance: "Баланс звезд",
    top_up: "Пополнить",
    day: "день",
    insufficient_balance: "Недостаточно средств.",
    please_top_up: "Пожалуйста, пополните баланс",

    // Settings
    settings: "Настройки",
    language: "Язык",
    support: "Поддержка",
    contact_support: "Связаться с поддержкой",
    coming_soon: "Скоро",
    notifications: "Уведомления",
    push_notifications: "Push уведомления",
  },
  en: {
    // Common
    subscription: "Subscription",
    active: "Active",
    inactive: "Inactive",
    days_left: "days left",
    valid_until: "Valid until:",

    // Home
    wallet: "Wallet",
    days_remaining: "days remaining",

    // Top Up
    subscription_title: "Subscription Plans",
    subscription_subtitle: "Choose a plan and get access to all features",
    month: "1 month",
    months_3: "3 months",
    months_6: "6 months",
    year: "1 year",
    days: "days",
    popular: "Popular",
    economy: "Save",
    per_day: "₽/day",
    subscribe: "Subscribe",
    terms:
      "By clicking the button, you agree to the subscription terms. Payment will be charged immediately. You can cancel anytime.",
    full_access: "Full access to all features",
    priority_support: "Priority support",
    unlimited: "Unlimited",
    stars_balance: "Stars balance",
    top_up: "Top up",
    day: "day",
    insufficient_balance: "Insufficient funds.",
    please_top_up: "Please top up your balance",

    // Settings
    settings: "Settings",
    language: "Language",
    support: "Support",
    contact_support: "Contact support",
    coming_soon: "Coming soon",
    notifications: "Notifications",
    push_notifications: "Push notifications",
  },
};

// Ключ для хранения в localStorage
const LANGUAGE_STORAGE_KEY = "app_language";

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider = ({ children }: { children: any }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage === "ru" || savedLanguage === "en") {
      return savedLanguage;
    }
    return "ru";
  });

  // Сохраняем язык в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);

    // Опционально: добавляем класс к body для глобальных стилей
    document.body.setAttribute("data-language", language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.ru] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
