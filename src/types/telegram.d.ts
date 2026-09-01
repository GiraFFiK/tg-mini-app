interface TelegramWebAppUser {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
}

interface TelegramHapticFeedback {
  impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
  selectionChanged?: () => void;
}

interface TelegramWebApp {
  platform?: string;
  initData?: string;
  initDataUnsafe?: { user?: TelegramWebAppUser };
  HapticFeedback?: TelegramHapticFeedback;
  disableVerticalSwipes?: () => void;
  requestFullscreen?: () => Promise<void>;
  expand: () => void;
  ready?: () => void;
  openTelegramLink?: (url: string) => void;
  openInvoice: (
    url: string,
    callback: (status: "paid" | "failed" | "cancelled" | "pending") => void,
  ) => void;
}

interface Window {
  Telegram?: {
    WebApp: TelegramWebApp;
  };
}
