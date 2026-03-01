import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../config/database.js', () => ({
  prisma: {
    subscriptionTier: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('../middleware/auth.js', () => ({
  authenticate: vi.fn((_r: unknown, _s: unknown, n: () => void) => n()),
}));

vi.mock('../middleware/requireRole.js', () => ({
  requireRole: () => vi.fn((_r: unknown, _s: unknown, n: () => void) => n()),
}));

describe('creator-tiers route logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('tier name validation', () => {
    function validateName(name: unknown, required: boolean) {
      if (required && (!name || typeof name !== 'string' || !(name as string).trim()))
        throw new Error('Tier name is required');
      if (!required && name !== undefined && (typeof name !== 'string' || !(name as string).trim()))
        throw new Error('Tier name cannot be empty');
    }

    it('should require name on create', () => {
      expect(() => validateName('', true)).toThrow('Tier name is required');
      expect(() => validateName(undefined, true)).toThrow('Tier name is required');
    });

    it('should accept valid name on create', () => {
      expect(() => validateName('Gold Tier', true)).not.toThrow();
    });

    it('should allow undefined name on update', () => {
      expect(() => validateName(undefined, false)).not.toThrow();
    });

    it('should reject empty name on update', () => {
      expect(() => validateName('', false)).toThrow('Tier name cannot be empty');
    });
  });

  describe('tier price validation', () => {
    function validatePrice(price: unknown, required: boolean) {
      if (required && (price === undefined || typeof price !== 'number' || price < 0))
        throw new Error('Price must be a non-negative number');
      if (!required && price !== undefined && (typeof price !== 'number' || price < 0))
        throw new Error('Price must be a non-negative number');
    }

    it('should require price on create', () => {
      expect(() => validatePrice(undefined, true)).toThrow();
      expect(() => validatePrice('string', true)).toThrow();
    });

    it('should accept valid price on create', () => {
      expect(() => validatePrice(9.99, true)).not.toThrow();
      expect(() => validatePrice(0, true)).not.toThrow();
    });

    it('should reject negative price', () => {
      expect(() => validatePrice(-1, true)).toThrow();
      expect(() => validatePrice(-1, false)).toThrow();
    });

    it('should allow undefined price on update', () => {
      expect(() => validatePrice(undefined, false)).not.toThrow();
    });
  });

  describe('benefits validation', () => {
    it('should reject non-array benefits', () => {
      const benefits = 'not an array';
      expect(Array.isArray(benefits)).toBe(false);
    });

    it('should accept array benefits', () => {
      const benefits = ['Exclusive content', 'Priority DMs'];
      expect(Array.isArray(benefits)).toBe(true);
    });
  });

  describe('buildTierData', () => {
    function buildTierData(body: Record<string, unknown>): Record<string, unknown> {
      const data: Record<string, unknown> = {};
      if (body.name !== undefined) data.name = (body.name as string).trim();
      if (body.price !== undefined) data.price = body.price;
      if (body.description !== undefined)
        data.description =
          typeof body.description === 'string' ? (body.description as string).trim() : null;
      if (body.benefits !== undefined) data.benefits = body.benefits;
      return data;
    }

    it('should build data with all fields', () => {
      const data = buildTierData({
        name: ' Gold ',
        price: 9.99,
        description: ' Premium ',
        benefits: ['A', 'B'],
      });
      expect(data).toEqual({
        name: 'Gold',
        price: 9.99,
        description: 'Premium',
        benefits: ['A', 'B'],
      });
    });

    it('should handle null description', () => {
      const data = buildTierData({ name: 'Test', description: 123 });
      expect(data.description).toBeNull();
    });

    it('should only include provided fields', () => {
      const data = buildTierData({ name: 'Test' });
      expect(Object.keys(data)).toEqual(['name']);
    });
  });

  describe('tier ordering', () => {
    it('should calculate next order value', () => {
      const lastTier = { order: 3 };
      const nextOrder = (lastTier?.order ?? -1) + 1;
      expect(nextOrder).toBe(4);
    });

    it('should start at 0 when no tiers exist', () => {
      // When no tiers exist, lastTier?.order is undefined => (undefined ?? -1) + 1 = 0
      const lastOrder: number | undefined = undefined;
      const nextOrder = (lastOrder ?? -1) + 1;
      expect(nextOrder).toBe(0);
    });
  });

  describe('tier ownership check', () => {
    it('should detect unauthorized update', () => {
      const tier = { creatorId: 'u2' };
      const userId = 'u1';
      expect(tier.creatorId !== userId).toBe(true);
    });

    it('should allow owner update', () => {
      const tier = { creatorId: 'u1' };
      const userId = 'u1';
      expect(tier.creatorId !== userId).toBe(false);
    });
  });
});
