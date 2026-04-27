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
    purchase_history: "История покупок и бонусов",
    total: "всего",
    show_more: "Показать еще",
    show_less: "Скрыть",
    expired: "Истек",
    activation_code: "Конфиг VPN",
    replace_code: "Заменить конфиг",
    no_subscription_code: "Оформите подписку для получения конфига",
    copied_to_clipboard: "Скопировано в буфер обмена",
    config_changed: "Конфиг изменен",
    choose_device: "Выберите устройство",
    device_instructions:
      "Выберите устройство для просмотра инструкции по подключению",
    device_status_instruction: "Инструкция",
    device_instruction_title: "инструкция по подключению",
    instruction_download_title: "Скачайте приложение",
    instruction_download_description_prefix: "Установите V2RayTun по",
    instruction_download_link: "этой ссылке",
    instruction_copy_config_title: "Скопируйте конфиг",
    instruction_copy_config_description:
      'Нажмите на кнопку "Копировать" выше, чтобы скопировать конфигурацию VPN',
    instruction_paste_title: "Вставьте в приложение",
    instruction_paste_plus: 'на кнопку "+" в верхнем правом углу',
    instruction_paste_clipboard: "Из буфера обмена",
    instruction_connect_title: "Подключитесь",
    instruction_connect_description:
      "Нажмите кнопку подключения в приложении и наслаждайтесь интернетом без ограничений",
    instructions: "Инструкции",
    close: "Закрыть",
    instructions_subtitle:
      "Если приложение недоступно в App Store, сначала смените регион. Затем установите клиент и импортируйте конфиг.",
    region_instruction_button: "Сменить регион App Store",
    region_instruction_hint: "Для iPhone и iPad, если приложение недоступно",
    setup_instruction_button: "Установить и запустить VPN",
    setup_instruction_hint: "Ссылки на приложения и подключение конфига",
    region_instruction_title: "Смена региона App Store на США",
    setup_instruction_title: "Установка приложения и запуск VPN",
    region_step_account_title: "Откройте настройки Apple ID",
    region_step_account_description:
      "Откройте App Store, нажмите на аватар профиля, затем на имя аккаунта. При необходимости войдите в Apple ID.",
    region_step_country_title: "Перейдите в страну или регион",
    region_step_country_description:
      "Откройте Country/Region или Страна/регион и выберите Change Country or Region.",
    region_step_usa_title: "Выберите United States",
    region_step_usa_description:
      "В списке стран выберите United States и примите условия App Store.",
    region_step_address_title: "Заполните платежные данные",
    region_step_address_description:
      "В способе оплаты выберите Нет. В поле Адрес (обязательное поле), укажите So, в поле Город (обязательное поле), укажите So, Штат - Нью-Йорк, Индекс - 10025, Номер телефона - 552 525-55-22.",
    region_step_download_title: "Скачайте приложение",
    region_step_download_description:
      "Вернитесь в App Store, найдите V2RayTun и установите приложение. После установки можно открыть инструкцию по запуску VPN.",
    setup_step_download_title: "Скачайте приложение",
    setup_step_download_description:
      "Выберите свою платформу выше и установите V2RayTun. Для iOS и macOS используется App Store, для Android - Google Play, для Windows - установщик.",
    setup_step_copy_title: "Скопируйте конфиг",
    setup_step_copy_description:
      "На вкладке Home нажмите кнопку Копировать рядом с VPN-конфигом.",
    setup_step_import_title: "Импортируйте конфиг",
    setup_step_import_description:
      "Откройте V2RayTun, нажмите + в правом верхнем углу и выберите импорт из буфера обмена.",
    setup_step_connect_title: "Запустите VPN",
    setup_step_connect_description:
      "Выберите добавленный профиль и нажмите кнопку подключения. Если соединение не появилось, замените конфиг и импортируйте его заново.",
    instructions_soon: "Скоро",
    instructions_placeholder:
      "Инструкция по настройке появится здесь. Это временное сообщение.",
    no_purchases_title: "История покупок пуста",
    no_purchases_text:
      "У вас пока нет покупок или бонусов.",
    go_to_topup: "Перейти к покупке",
    subscription_inactive: "Подписка не активирована. Оформите её, чтобы получить доступ к VPN.",

    // НОВЫЕ ПЕРЕВОДЫ ДЛЯ ИСТОРИИ
    welcome_bonus: "🎁 Бонус за первый вход",
    referral_bonus: "👥 Реферальный бонус",
    bonus_days_short: "дн",
    purchase: "Покупка",
    bonus: "Бонус",

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
    telegram_connect_error: "Не удалось подключиться к Telegram",
    payment_success: "Оплата прошла успешно. Подписка активирована.",
    payment_failed: "Оплата не прошла. Попробуйте позже.",
    stars_payment_title: "Оплата Telegram Stars",
    stars_payment_description:
      "Для оформления подписки используются Telegram Stars. Если у вас недостаточно звезд, вы можете пополнить баланс, нажав на кнопку ниже.",
    processing: "Обработка...",
    payment_create_error: "Не удалось создать платеж. Попробуйте позже.",

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
    purchase_history: "Purchase history & bonuses",
    total: "total",
    show_more: "Show more",
    show_less: "Show less",
    expired: "Expired",
    activation_code: "VPN config",
    replace_code: "Replace config",
    no_subscription_code: "Subscribe to get a config",
    copied_to_clipboard: "Copied to clipboard",
    config_changed: "Config changed",
    choose_device: "Choose device",
    device_instructions: "Select a device to view setup instructions",
    device_status_instruction: "Guide",
    device_instruction_title: "connection guide",
    instruction_download_title: "Download the app",
    instruction_download_description_prefix: "Install V2RayTun using",
    instruction_download_link: "this link",
    instruction_copy_config_title: "Copy the config",
    instruction_copy_config_description:
      'Tap the "Copy" button above to copy your VPN configuration',
    instruction_paste_title: "Paste it into the app",
    instruction_paste_plus: 'the "+" button in the top-right corner',
    instruction_paste_clipboard: "From clipboard",
    instruction_connect_title: "Connect",
    instruction_connect_description:
      "Tap the connect button in the app and enjoy unrestricted internet access",
    instructions: "Instructions",
    close: "Close",
    instructions_subtitle:
      "If the app is unavailable in the App Store, change your region first. Then install the client and import your config.",
    region_instruction_button: "Change App Store region",
    region_instruction_hint: "For iPhone and iPad if the app is unavailable",
    setup_instruction_button: "Install and start VPN",
    setup_instruction_hint: "App links and config setup",
    region_instruction_title: "Change App Store region to the United States",
    setup_instruction_title: "Install the app and start VPN",
    region_step_account_title: "Open Apple ID settings",
    region_step_account_description:
      "Open the App Store, tap your profile avatar, then tap your account name. Sign in to Apple ID if needed.",
    region_step_country_title: "Open country or region",
    region_step_country_description:
      "Open Country/Region and choose Change Country or Region.",
    region_step_usa_title: "Select United States",
    region_step_usa_description:
      "Select United States from the country list and accept the App Store terms.",
    region_step_address_title: "Fill in payment details",
    region_step_address_description:
      "In the payment method, select None. In the Address field (required field), enter So, in the City field (required field), enter So, State - New York, Zip code - 10025, Phone number - 552 525-55-22.",
    region_step_download_title: "Download the app",
    region_step_download_description:
      "Return to the App Store, search for V2RayTun, and install it. After installation, open the VPN setup guide.",
    setup_step_download_title: "Download the app",
    setup_step_download_description:
      "Choose your platform above and install V2RayTun. iOS and macOS use the App Store, Android uses Google Play, and Windows uses the installer.",
    setup_step_copy_title: "Copy the config",
    setup_step_copy_description:
      "On the Home tab, tap Copy next to your VPN config.",
    setup_step_import_title: "Import the config",
    setup_step_import_description:
      "Open V2RayTun, tap + in the top-right corner, and choose import from clipboard.",
    setup_step_connect_title: "Start VPN",
    setup_step_connect_description:
      "Select the added profile and tap the connect button. If the connection does not appear, replace the config and import it again.",
    instructions_soon: "Soon",
    instructions_placeholder:
      "Setup instructions will appear here. This is a temporary message.",
    no_purchases_title: "Purchase history is empty",
    no_purchases_text:
      "You have no purchases or bonuses yet.",
    go_to_topup: "Go to plans",
    subscription_inactive: "Subscription is not active. Subscribe to get access to VPN.",

    // НОВЫЕ ПЕРЕВОДЫ ДЛЯ ИСТОРИИ
    welcome_bonus: "🎁 Welcome bonus",
    referral_bonus: "👥 Referral bonus",
    bonus_days_short: "d",
    purchase: "Purchase",
    bonus: "Bonus",

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
    telegram_connect_error: "Could not connect to Telegram",
    payment_success: "Payment completed successfully. Subscription activated.",
    payment_failed: "Payment failed. Please try again later.",
    stars_payment_title: "Telegram Stars payment",
    stars_payment_description:
      "Telegram Stars are used to purchase subscriptions. If you do not have enough Stars, you can top up your balance with the button below.",
    processing: "Processing...",
    payment_create_error: "Could not create the payment. Please try again later.",

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
