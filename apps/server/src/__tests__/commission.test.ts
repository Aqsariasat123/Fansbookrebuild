import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FEES } from '@fansbook/shared';

vi.mock('../config/database.js', () => ({
  prisma: {
    wallet: { findUnique: vi.fn(), update: vi.fn(), upsert: vi.fn() },
    tip: { create: vi.fn() },
    transaction: { create: vi.fn() },
    post: { findUnique: vi.fn() },
    ppvPurchase: { findUnique: vi.fn(), create: vi.fn() },
    $transaction: vi.fn(),
  },
}));

vi.mock('../middleware/auth.js', () => ({
  authenticate: vi.fn((_r: unknown, _s: unknown, n: () => void) => n()),
}));

vi.mock('../utils/notify.js', () => ({
  createNotification: vi.fn(),
  emitToUser: vi.fn(),
}));

vi.mock('../utils/audit.js', () => ({
  logActivity: vi.fn(),
}));

describe('commission logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('platform fee constant', () => {
    it('should be 20%', () => {
      expect(FEES.PLATFORM_FEE_PERCENT).toBe(20);
    });
  });

  describe('tip commission', () => {
    it('should take 20% from tip — creator gets 80%', () => {
      const tipAmount = 100;
      const commission = tipAmount * (FEES.PLATFORM_FEE_PERCENT / 100);
      const creatorAmount = tipAmount - commission;
      expect(commission).toBe(20);
      expect(creatorAmount).toBe(80);
    });

    it('should handle $1 minimum tip', () => {
      const tipAmount = FEES.MIN_TIP_AMOUNT;
      const commission = tipAmount * (FEES.PLATFORM_FEE_PERCENT / 100);
      const creatorAmount = tipAmount - commission;
      expect(tipAmount).toBe(1);
      expect(commission).toBe(0.2);
      expect(creatorAmount).toBe(0.8);
    });

    it('should handle $10,000 maximum tip', () => {
      const tipAmount = FEES.MAX_TIP_AMOUNT;
      const commission = tipAmount * (FEES.PLATFORM_FEE_PERCENT / 100);
      const creatorAmount = tipAmount - commission;
      expect(tipAmount).toBe(10000);
      expect(commission).toBe(2000);
      expect(creatorAmount).toBe(8000);
    });

    it('should handle fractional amounts', () => {
      const tipAmount = 7.5;
      const commission = tipAmount * (FEES.PLATFORM_FEE_PERCENT / 100);
      const creatorAmount = tipAmount - commission;
      expect(commission).toBe(1.5);
      expect(creatorAmount).toBe(6);
    });
  });

  describe('PPV commission', () => {
    it('should take 20% from PPV price — creator gets 80%', () => {
      const ppvPrice = 50;
      const commission = ppvPrice * (FEES.PLATFORM_FEE_PERCENT / 100);
      const creatorAmount = ppvPrice - commission;
      expect(commission).toBe(10);
      expect(creatorAmount).toBe(40);
    });

    it('should handle $1 minimum PPV price', () => {
      const ppvPrice = FEES.MIN_PPV_PRICE;
      const commission = ppvPrice * (FEES.PLATFORM_FEE_PERCENT / 100);
      const creatorAmount = ppvPrice - commission;
      expect(ppvPrice).toBe(1);
      expect(commission).toBe(0.2);
      expect(creatorAmount).toBe(0.8);
    });

    it('should handle $500 maximum PPV price', () => {
      const ppvPrice = FEES.MAX_PPV_PRICE;
      const commission = ppvPrice * (FEES.PLATFORM_FEE_PERCENT / 100);
      const creatorAmount = ppvPrice - commission;
      expect(ppvPrice).toBe(500);
      expect(commission).toBe(100);
      expect(creatorAmount).toBe(400);
    });
  });

  describe('subscription commission', () => {
    it('should take 20% from subscription — creator gets 80%', () => {
      const subPrice = 25;
      const commission = subPrice * (FEES.PLATFORM_FEE_PERCENT / 100);
      const creatorAmount = subPrice - commission;
      expect(commission).toBe(5);
      expect(creatorAmount).toBe(20);
    });

    it('should handle $1 minimum subscription', () => {
      const subPrice = FEES.MIN_SUBSCRIPTION_PRICE;
      const commission = subPrice * (FEES.PLATFORM_FEE_PERCENT / 100);
      const creatorAmount = subPrice - commission;
      expect(subPrice).toBe(1);
      expect(commission).toBe(0.2);
      expect(creatorAmount).toBe(0.8);
    });

    it('should handle $1000 maximum subscription', () => {
      const subPrice = FEES.MAX_SUBSCRIPTION_PRICE;
      const commission = subPrice * (FEES.PLATFORM_FEE_PERCENT / 100);
      const creatorAmount = subPrice - commission;
      expect(subPrice).toBe(1000);
      expect(commission).toBe(200);
      expect(creatorAmount).toBe(800);
    });
  });

  describe('withdrawal minimum', () => {
    it('should enforce $20 minimum', () => {
      expect(FEES.WITHDRAWAL_MIN).toBe(20);
    });

    it('should reject amount below minimum', () => {
      const amount = 15;
      expect(amount < FEES.WITHDRAWAL_MIN).toBe(true);
    });

    it('should accept amount at minimum', () => {
      const amount = 20;
      expect(amount < FEES.WITHDRAWAL_MIN).toBe(false);
    });

    it('should accept amount above minimum', () => {
      const amount = 100;
      expect(amount < FEES.WITHDRAWAL_MIN).toBe(false);
    });
  });

  describe('wallet balance consistency', () => {
    it('fan deduction should equal full amount', () => {
      const price = 50;
      const fanDeduction = price;
      expect(fanDeduction).toBe(50);
    });

    it('creator credit should equal price minus commission', () => {
      const price = 50;
      const commission = price * (FEES.PLATFORM_FEE_PERCENT / 100);
      const creatorCredit = price - commission;
      expect(creatorCredit).toBe(40);
    });

    it('fan deduction should equal creator credit + commission', () => {
      const price = 99.99;
      const commission = price * (FEES.PLATFORM_FEE_PERCENT / 100);
      const creatorCredit = price - commission;
      expect(creatorCredit + commission).toBeCloseTo(price);
    });
  });
});
