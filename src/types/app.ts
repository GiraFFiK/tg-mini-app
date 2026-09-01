export interface AppUser {
  id?: string | number;
  telegramId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

export interface SubscriptionData {
  isActive: boolean;
  daysLeft: number;
  subscriptionUntil: string | null;
}

export interface ActivationCodeData {
  hasSubscription: boolean;
  code?: string;
}

export interface HistoryItem {
  id: string;
  date: string;
  type: "purchase" | "welcome_bonus" | "referral_bonus";
  plan: string;
  stars: number;
  days: number;
  description?: string;
  status: "active" | "expired" | string;
}

export interface InvitedUser {
  id: string;
  username?: string;
  firstName?: string;
  photoUrl?: string;
  date: string;
  status: "activated" | "pending" | string;
  bonus: number;
}

export interface ReferralInfo {
  referralCode: string;
  referralLink: string;
  totalInvited: number;
  activatedCount: number;
  totalBonus: number;
  invitedList: InvitedUser[];
}
