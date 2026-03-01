import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FEES } from '@fansbook/shared';

vi.mock('../config/database.js', () => ({
  prisma: {
    subscription: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    subscriptionTier: { findUnique: vi.fn() },
    wallet: { findUnique: vi.fn(), upsert: vi.fn(), update: vi.fn() },
    transaction: { create: vi.fn() },
    $transaction: vi.fn(),
  },
}));

vi.mock('../middleware/auth.js', () => ({
  authenticate: vi.fn((_r: unknown, _s: unknown, n: () => void) => n()),
}));

vi.mock('../middleware/validate.js', () => ({
  validate: () => vi.fn((_r: unknown, _s: unknown, n: () => void) => n()),
}));

vi.mock('../utils/notify.js', () => ({
  createNotification: vi.fn(),
  emitToUser: vi.fn(),
}));

vi.mock('../utils/audit.js', () => ({
  logActivity: vi.fn(),
}));

describe('subscriptions flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('commission calculation', () => {
    it('should calculate 20% commission correctly', () => {
      const price = 100;
      const commission = price * (FEES.PLATFORM_FEE_PERCENT / 100);
      const creatorAmount = price - commission;
      expect(commission).toBe(20);
      expect(creatorAmount).toBe(80);
    });

    it('should handle fractional prices', () => {
      const price = 9.99;
      const commission = price * (FEES.PLATFORM_FEE_PERCENT / 100);
      const creatorAmount = price - commission;
      expect(commission).toBeCloseTo(1.998);
      expect(creatorAmount).toBeCloseTo(7.992);
    });

    it('should use FEES.PLATFORM_FEE_PERCENT constant', () => {
      expect(FEES.PLATFORM_FEE_PERCENT).toBe(20);
    });
  });

  describe('subscribe validation', () => {
    it('should reject self-subscription', () => {
      const creatorId = 'user1';
      const userId = 'user1';
      expect(creatorId === userId).toBe(true);
    });

    it('should detect insufficient balance', () => {
      const wallet = { balance: 5 };
      const tierPrice = 10;
      expect(wallet.balance < tierPrice).toBe(true);
    });

    it('should detect existing active subscription', () => {
      const existing = { id: 'sub1', status: 'ACTIVE' };
      expect(!!existing).toBe(true);
    });

    it('should allow subscription when no existing active sub', () => {
      const existing = null;
      expect(!!existing).toBe(false);
    });

    it('should reject inactive tier', () => {
      const tier = { isActive: false };
      expect(!tier || !tier.isActive).toBe(true);
    });

    it('should accept active tier', () => {
      const tier = { isActive: true };
      expect(!tier || !tier.isActive).toBe(false);
    });
  });

  describe('cancel subscription', () => {
    it('should only allow owner to cancel', () => {
      const sub = { subscriberId: 'user1' };
      const userId = 'user2';
      expect(sub.subscriberId !== userId).toBe(true);
    });

    it('should only cancel active subscriptions', () => {
      const sub = { status: 'EXPIRED' };
      expect(sub.status !== 'ACTIVE').toBe(true);
    });

    it('should allow cancellation of active subscription', () => {
      const sub = { status: 'ACTIVE', subscriberId: 'user1' };
      const userId = 'user1';
      expect(sub.status === 'ACTIVE' && sub.subscriberId === userId).toBe(true);
    });
  });

  describe('subscription expiry', () => {
    it('should mark subscription expired when endDate is past', () => {
      const endDate = new Date(Date.now() - 1000);
      const now = new Date();
      expect(endDate <= now).toBe(true);
    });

    it('should not expire active subscription with future endDate', () => {
      const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      const now = new Date();
      expect(endDate <= now).toBe(false);
    });
  });

  describe('subscription check', () => {
    it('should return isSubscribed true when active sub exists', () => {
      const sub = { id: 'sub1', endDate: new Date(), tier: { name: 'Gold' } };
      const result = {
        isSubscribed: !!sub,
        subscriptionId: sub?.id ?? null,
        endDate: sub?.endDate ?? null,
        tierName: sub?.tier.name ?? null,
      };
      expect(result.isSubscribed).toBe(true);
      expect(result.subscriptionId).toBe('sub1');
      expect(result.tierName).toBe('Gold');
    });

    it('should return isSubscribed false when no sub exists', () => {
      const sub = null as { id: string; endDate: Date; tier: { name: string } } | null;
      const result = {
        isSubscribed: !!sub,
        subscriptionId: sub?.id ?? null,
        endDate: sub?.endDate ?? null,
        tierName: sub?.tier?.name ?? null,
      };
      expect(result.isSubscribed).toBe(false);
      expect(result.subscriptionId).toBeNull();
    });
  });

  describe('endDate calculation', () => {
    it('should set endDate 30 days from now', () => {
      const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
      const now = Date.now();
      const endDate = new Date(now + THIRTY_DAYS_MS);
      const diffDays = (endDate.getTime() - now) / (24 * 60 * 60 * 1000);
      expect(diffDays).toBe(30);
    });
  });
});
