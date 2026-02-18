import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем initData в каждый запрос
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const tg = (window as any).Telegram?.WebApp;
  if (tg?.initData) {
    config.headers['X-Telegram-Init-Data'] = tg.initData;
  }
  return config;
});

// Аутентификация при загрузке приложения
export const authenticate = async () => {
  const tg = (window as any).Telegram?.WebApp;
  if (!tg?.initData) {
    console.error('No Telegram initData');
    return null;
  }

  try {
    const response = await api.post('/auth', { 
      initData: tg.initData 
    });
    return response.data;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
};

// Пользователь
export const getUser = async (telegramId: string) => {
  const response = await api.get(`/users/${telegramId}`);
  return response.data;
};

// Подписка
export const getSubscription = async (telegramId: string) => {
  const response = await api.get(`/subscription/${telegramId}`);
  return response.data;
};

export const purchaseSubscription = async (telegramId: string, plan: string, stars: number) => {
  const response = await api.post(`/subscription/${telegramId}/purchase`, { plan, stars });
  return response.data;
};

// Рефералы
export const getReferralInfo = async (telegramId: string) => {
  const response = await api.get(`/referral/${telegramId}`);
  return response.data;
};

// Код активации
export const getActivationCode = async (telegramId: string) => {
  const response = await api.get(`/activation/${telegramId}`);
  return response.data;
};

export const regenerateActivationCode = async (telegramId: string) => {
  const response = await api.post(`/activation/${telegramId}/regenerate`);
  return response.data;
};

export default api;