// ─── Creator Dashboard Types ─────────────────────────────

export interface SubscriptionTierData {
  id: string;
  name: string;
  price: number;
  description: string | null;
  benefits: string[];
  isActive: boolean;
}

export interface EarningRecord {
  id: string;
  type: string;
  amount: number;
  description: string | null;
  status: string;
  createdAt: string;
}

export interface BookingData {
  id: string;
  fan: { id: string; username: string; displayName: string; avatar: string | null };
  date: string;
  timeSlot: string;
  status: string;
  notes: string | null;
  createdAt: string;
}

export interface ReferralData {
  id: string;
  referred: { id: string; username: string; displayName: string; avatar: string | null };
  earnings: number;
  createdAt: string;
}

export interface WithdrawalData {
  id: string;
  amount: number;
  paymentMethod: string;
  status: string;
  processedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
}

export interface CreatorWalletData {
  balance: number;
  pendingBalance: number;
  totalEarned: number;
  eurEquivalent: number;
}
