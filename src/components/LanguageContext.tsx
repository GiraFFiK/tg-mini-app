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
    purchase_history: "История покупок",
    total: "всего",
    show_more: "Показать еще",
    show_less: "Скрыть",
    expired: "Истек",
    activation_code: "Код активации",
    replace_code: "Заменить код",
    no_subscription_code: "Оформите подписку для получения кода активации",
    choose_device: "Выберите устройство",
    device_instructions:
      "Выберите устройство для просмотра инструкции по подключению",
    instructions_soon: "Скоро",
    instructions_placeholder:
      "Инструкция по настройке появится здесь. Это временное сообщение.",
    no_purchases_title: "История покупок пуста",
    no_purchases_text:
      "Вы еще ничего не купили. Пора это исправить! Выберите подходящий пакет и получите доступ ко всем функциям.",
    go_to_topup: "Перейти к покупке",
    subscription_inactive: "Подписка не активирована. Оформите её, чтобы получить доступ к VPN.",

    // Top Up
    subscription_title: "Оформление подписки",
    subscription_subtitle: "Выберите пакет и получите доступ к VPN",
    month: "1 месяц",
    months_3: "3 месяца",
    months_6: "6 месяцев",
    year: "1 год",
    days: "дня",
    popular: "Популярное",
    economy: "Экономия",
    per_day: "₽/день",
    subscribe: "Оформить подписку",
    terms:
      "Нажимая кнопку, вы соглашаетесь с условиями подписки. Списание будет произведено сразу. Можно отменить в любой момент.",
    full_access: "Полное шифрование данных",
    priority_support: "Современные сервера",
    unlimited: "Скорость без ограничений",
    stars_balance: "Баланс звёзд",
    top_up: "Пополнить",
    day: "день",
    insufficient_balance: "Недостаточно средств.",
    please_top_up: "Пожалуйста, пополните баланс",

    //Referral
    referral_title: "Реферальная система",
    referral_subtitle: "Приглашайте друзей и получайте бонусы",
    invited: "Приглашено",
    bonus_days: "Бонусных дней",
    your_link: "Ваша реферальная ссылка",
    link_description:
      "Отправьте эту ссылку друзьям. Когда они перейдут по ней и оформят подписку, вы оба получите по 3 дня бесплатно!",
    copy: "Копировать",
    copied: "Скопировано!",
    share: "Поделиться",
    bonus_info: "За каждого активного друга вы получаете +3 дня к подписке",
    invited_friends: "Приглашенные друзья",
    pending: "Ожидание",
    no_referrals: "У вас пока нет приглашенных друзей",
    share_link_hint: "Поделитесь ссылкой и получите бонусы!",
    share_text:
      "Присоединяйся по моей реферальной ссылке и получи 3 дня бесплатного доступа!",
    total_invited: "Всего приглашено",
    activated: "Активировано",
    bonus_title: "Мгновенный бонус!",
    bonus_description:
      "Как только друг перейдет по ссылке и запустит бота, вы оба получите по 3 дня бесплатно. Даже без покупки подписки!",

    // Settings
    settings: "Настройки",
    language: "Язык",
    support: "Поддержка",
    contact_support: "Поддержка",
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
    purchase_history: "Purchase history",
    total: "total",
    show_more: "Show more",
    show_less: "Show less",
    expired: "Expired",
    activation_code: "Activation code",
    replace_code: "Replace code",
    no_subscription_code: "Subscribe to get an activation code",
    choose_device: "Choose device",
    device_instructions: "Select a device to view setup instructions",
    instructions_soon: "Soon",
    instructions_placeholder:
      "Setup instructions will appear here. This is a temporary message.",
    no_purchases_title: "Purchase history is empty",
    no_purchases_text:
      "You haven't purchased anything yet. Time to fix that! Choose a suitable plan and get access to all features.",
    go_to_topup: "Go to plans",
    subscription_inactive: "Subscription is not active. Subscribe to get access to VPN.",

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

    //Referral
    referral_title: "Referral System",
    referral_subtitle: "Invite friends and get bonuses",
    invited: "Invited",
    bonus_days: "Bonus days",
    your_link: "Your referral link",
    link_description:
      "Share this link with friends. When they follow it and subscribe, you both get 3 free days!",
    copy: "Copy",
    copied: "Copied!",
    share: "Share",
    bonus_info: "For each active friend you get +3 days to your subscription",
    invited_friends: "Invited friends",
    pending: "Pending",
    no_referrals: "You have no invited friends yet",
    share_link_hint: "Share the link and get bonuses!",
    share_text: "Join via my referral link and get 3 days of free access!",
    total_invited: "Total invited",
    activated: "Activated",
    bonus_title: "Instant bonus!",
    bonus_description:
      "As soon as a friend follows the link and starts the bot, you both get 3 free days. Even without purchasing a subscription!",

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
