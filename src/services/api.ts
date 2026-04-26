import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const tg = (window as any).Telegram?.WebApp;

  if (tg?.initData) {
    config.headers["X-Telegram-Init-Data"] = tg.initData;
  }

  return config;
});

export const authenticate = async () => {
  const tg = (window as any).Telegram?.WebApp;

  if (tg?.initData) {
    try {
      const response = await api.post("/auth", {
        initData: tg.initData
      });
      console.log("вњ… РђСѓС‚РµРЅС‚РёС„РёРєР°С†РёСЏ С‡РµСЂРµР· Telegram:", response.data);
      return response.data;
    } catch (error) {
      console.error("вќЊ РћС€РёР±РєР° Р°СѓС‚РµРЅС‚РёС„РёРєР°С†РёРё С‡РµСЂРµР· Telegram:", error);
    }
  }

  const tgUser = tg?.initDataUnsafe?.user;
  if (tgUser) {
    console.log("рџ“± Р”Р°РЅРЅС‹Рµ РёР· Telegram WebApp:", tgUser);
    return {
      id: tgUser.id,
      telegramId: String(tgUser.id),
      username: tgUser.username || `user_${tgUser.id}`,
      firstName: tgUser.first_name || "User",
      lastName: tgUser.last_name || ""
    };
  }

  console.warn("вљ пёЏ Telegram auth data is unavailable");
  return null;
};

export const getUser = async (telegramId: string) => {
  const response = await api.get(`/users/${telegramId}`);
  return response.data;
};

export const getSubscription = async (telegramId: string) => {
  const response = await api.get(`/subscription/${telegramId}`);
  return response.data;
};

export const purchaseSubscription = async (telegramId: string, plan: string) => {
  const response = await api.post(`/subscription/${telegramId}/purchase`, { plan });
  return response.data;
};

export const getReferralInfo = async (telegramId: string) => {
  const response = await api.get(`/referral/${telegramId}`);
  return response.data;
};

export const getActivationCode = async (telegramId: string) => {
  const response = await api.get(`/activation/${telegramId}`);
  return response.data;
};

export const regenerateActivationCode = async (telegramId: string) => {
  const response = await api.post(`/activation/${telegramId}/regenerate`);
  return response.data;
};

export const getStarsBalance = async (telegramId: string) => {
  console.log("рџ“¤ Р—Р°РїСЂРѕСЃ Р±Р°Р»Р°РЅСЃР° Р·РІРµР·Рґ РґР»СЏ:", telegramId);
  const response = await api.get(`/stars/${telegramId}`);
  console.log("рџ“Ґ РћС‚РІРµС‚ Р±Р°Р»Р°РЅСЃР°:", response.data);
  return response.data;
};

export const getPurchaseHistory = async (telegramId: string) => {
  console.log("рџ“¤ Р—Р°РїСЂРѕСЃ РёСЃС‚РѕСЂРёРё РїРѕРєСѓРїРѕРє РґР»СЏ:", telegramId);
  const response = await api.get(`/purchases/history/${telegramId}`);
  console.log("рџ“Ґ РћС‚РІРµС‚ РёСЃС‚РѕСЂРёРё:", response.data);
  return response.data;
};

export const getBonusHistory = async (telegramId: string) => {
  console.log("рџ“¤ Р—Р°РїСЂРѕСЃ РёСЃС‚РѕСЂРёРё Р±РѕРЅСѓСЃРѕРІ РґР»СЏ:", telegramId);
  const response = await api.get(`/purchases/bonus/${telegramId}`);
  return response.data;
};

export const getFullHistory = async (telegramId: string) => {
  console.log("рџ“¤ Р—Р°РїСЂРѕСЃ РїРѕР»РЅРѕР№ РёСЃС‚РѕСЂРёРё РґР»СЏ:", telegramId);
  const response = await api.get(`/purchases/full/${telegramId}`);
  return response.data;
};

export default api;
