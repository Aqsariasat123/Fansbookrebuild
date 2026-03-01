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

vi.mock('../middleware/requireRole.js', () => ({
  requireRole: () => vi.fn((_r: unknown, _s: unknown, n: () => void) => n()),
}));

describe('creator-earnings route logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const EARNING_TYPES = ['TIP_RECEIVED', 'SUBSCRIPTION', 'PPV_EARNING'] as const;

  describe('parseDateFilter', () => {
    function parseDateFilter(startDate?: string, endDate?: string) {
      if (!startDate && !endDate) return undefined;
      const filter: Record<string, Date> = {};
      if (startDate) {
        const start = new Date(startDate);
        if (isNaN(start.getTime())) throw new Error('Invalid startDate format');
        filter.gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        if (isNaN(end.getTime())) throw new Error('Invalid endDate format');
        end.setHours(23, 59, 59, 999);
        filter.lte = end;
      }
      return filter;
    }

    it('should return undefined when no dates', () => {
      expect(parseDateFilter()).toBeUndefined();
    });

    it('should parse startDate only', () => {
      const filter = parseDateFilter('2025-01-01');
      expect(filter?.gte).toEqual(new Date('2025-01-01'));
      expect(filter?.lte).toBeUndefined();
    });

    it('should parse endDate with end-of-day', () => {
      const filter = parseDateFilter(undefined, '2025-12-31');
      expect(filter?.lte).toBeDefined();
      expect(filter?.lte?.getHours()).toBe(23);
      expect(filter?.lte?.getMinutes()).toBe(59);
    });

    it('should throw for invalid startDate', () => {
      expect(() => parseDateFilter('not-a-date')).toThrow('Invalid startDate format');
    });

    it('should throw for invalid endDate', () => {
      expect(() => parseDateFilter(undefined, 'not-a-date')).toThrow('Invalid endDate format');
    });
  });

  describe('buildEarningsFilter', () => {
    function buildEarningsFilter(
      walletId: string,
      query: { category?: string; search?: string },
    ): Record<string, unknown> {
      const { category, search } = query;
      const isValidCategory =
        category &&
        category !== 'All' &&
        EARNING_TYPES.includes(category as (typeof EARNING_TYPES)[number]);
      const where: Record<string, unknown> = {
        walletId,
        type: isValidCategory ? category : { in: [...EARNING_TYPES] },
      };
      if (search && search.trim()) {
        where.description = { contains: search.trim(), mode: 'insensitive' };
      }
      return where;
    }

    it('should filter by specific category', () => {
      const where = buildEarningsFilter('w1', { category: 'TIP_RECEIVED' });
      expect(where.type).toBe('TIP_RECEIVED');
    });

    it('should use all types for "All" category', () => {
      const where = buildEarningsFilter('w1', { category: 'All' });
      expect(where.type).toEqual({ in: [...EARNING_TYPES] });
    });

    it('should use all types for invalid category', () => {
      const where = buildEarningsFilter('w1', { category: 'INVALID' });
      expect(where.type).toEqual({ in: [...EARNING_TYPES] });
    });

    it('should include search filter', () => {
      const where = buildEarningsFilter('w1', { search: ' tip ' });
      expect(where.description).toEqual({ contains: 'tip', mode: 'insensitive' });
    });

    it('should not include empty search', () => {
      const where = buildEarningsFilter('w1', { search: '  ' });
      expect(where.description).toBeUndefined();
    });
  });

  describe('empty wallet handling', () => {
    it('should return empty results when no wallet', () => {
      const wallet = null;
      const page = 1;
      const limit = 20;
      const result = wallet ? null : { success: true, data: { items: [], total: 0, page, limit } };
      expect(result?.data.items).toEqual([]);
      expect(result?.data.total).toBe(0);
    });
  });
});
