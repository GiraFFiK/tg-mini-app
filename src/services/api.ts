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
      console.log("Authenticated via Telegram", response.data);
      return response.data;
    } catch (error) {
      console.error("Telegram authentication failed", error);
    }
  }

  const tgUser = tg?.initDataUnsafe?.user;
  if (tgUser) {
    console.log("Using Telegram WebApp user", tgUser);
    return {
      id: tgUser.id,
      telegramId: String(tgUser.id),
      username: tgUser.username || `user_${tgUser.id}`,
      firstName: tgUser.first_name || "User",
      lastName: tgUser.last_name || ""
    };
  }

  console.warn("Telegram auth data is unavailable");
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
  console.log("Fetching stars balance for", telegramId);
  const response = await api.get(`/stars/${telegramId}`);
  console.log("Stars balance response", response.data);
  return response.data;
};

export const getPurchaseHistory = async (telegramId: string) => {
  console.log("Fetching purchase history for", telegramId);
  const response = await api.get(`/purchases/history/${telegramId}`);
  console.log("Purchase history response", response.data);
  return response.data;
};

export const getBonusHistory = async (telegramId: string) => {
  console.log("Fetching bonus history for", telegramId);
  const response = await api.get(`/purchases/bonus/${telegramId}`);
  return response.data;
};

export const getFullHistory = async (telegramId: string) => {
  console.log("Fetching full history for", telegramId);
  const response = await api.get(`/purchases/full/${telegramId}`);
  return response.data;
};

export default api;
