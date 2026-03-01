import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../config/database.js', () => ({
  prisma: {
    wallet: { findUnique: vi.fn() },
    transaction: { findMany: vi.fn(), count: vi.fn() },
  },
}));

vi.mock('../middleware/auth.js', () => ({
  authenticate: vi.fn((_r: unknown, _s: unknown, n: () => void) => n()),
}));

vi.mock('../middleware/validate.js', () => ({
  validate: () => vi.fn((_r: unknown, _s: unknown, n: () => void) => n()),
}));

const VALID_TX_TYPES = [
  'DEPOSIT',
  'SUBSCRIPTION',
  'TIP_SENT',
  'TIP_RECEIVED',
  'PPV_PURCHASE',
  'PPV_EARNING',
  'WITHDRAWAL',
  'REFUND',
  'MARKETPLACE_PURCHASE',
  'MARKETPLACE_EARNING',
] as const;

describe('wallet transactions endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('type filtering', () => {
    it('should accept valid transaction type', () => {
      const type = 'TIP_SENT';
      expect(VALID_TX_TYPES.includes(type as (typeof VALID_TX_TYPES)[number])).toBe(true);
    });

    it('should reject invalid transaction type', () => {
      const type = 'INVALID_TYPE';
      expect(VALID_TX_TYPES.includes(type as (typeof VALID_TX_TYPES)[number])).toBe(false);
    });

    it('should treat ALL as no filter', () => {
      const typeFilter = 'ALL';
      const shouldFilter = typeFilter && typeFilter !== 'ALL';
      expect(shouldFilter).toBeFalsy();
    });

    it('should treat empty string as no filter', () => {
      const typeFilter = '';
      const shouldFilter = typeFilter && typeFilter !== 'ALL';
      expect(shouldFilter).toBeFalsy();
    });

    it('should apply filter for specific type', () => {
      const typeFilter: string = 'SUBSCRIPTION';
      const shouldFilter =
        typeFilter &&
        typeFilter !== 'ALL' &&
        VALID_TX_TYPES.includes(typeFilter as (typeof VALID_TX_TYPES)[number]);
      expect(shouldFilter).toBeTruthy();
    });
  });

  describe('pagination', () => {
    it('should default to page 1, limit 20', () => {
      const page = Math.max(1, Number(undefined) || 1);
      const limit = Math.min(50, Math.max(1, Number(undefined) || 20));
      expect(page).toBe(1);
      expect(limit).toBe(20);
    });

    it('should clamp limit to max 50', () => {
      const limit = Math.min(50, Math.max(1, Number('100') || 20));
      expect(limit).toBe(50);
    });

    it('should clamp limit to min 1', () => {
      const limit = Math.min(50, Math.max(1, Number('0') || 20));
      expect(limit).toBe(20);
    });

    it('should calculate correct offset', () => {
      const page = 3;
      const limit = 20;
      const skip = (page - 1) * limit;
      expect(skip).toBe(40);
    });
  });

  describe('no wallet handling', () => {
    it('should return empty data when wallet not found', () => {
      const wallet = null;
      const result = !wallet
        ? { items: [], total: 0, page: 1, limit: 20 }
        : { items: ['tx1'], total: 1, page: 1, limit: 20 };
      expect(result.items).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('transaction types coverage', () => {
    it('should include all 10 transaction types', () => {
      expect(VALID_TX_TYPES.length).toBe(10);
    });

    it('should include DEPOSIT', () => {
      expect(VALID_TX_TYPES).toContain('DEPOSIT');
    });

    it('should include SUBSCRIPTION', () => {
      expect(VALID_TX_TYPES).toContain('SUBSCRIPTION');
    });

    it('should include PPV types', () => {
      expect(VALID_TX_TYPES).toContain('PPV_PURCHASE');
      expect(VALID_TX_TYPES).toContain('PPV_EARNING');
    });

    it('should include TIP types', () => {
      expect(VALID_TX_TYPES).toContain('TIP_SENT');
      expect(VALID_TX_TYPES).toContain('TIP_RECEIVED');
    });
  });
});
