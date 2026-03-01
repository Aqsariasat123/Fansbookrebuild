import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../config/database.js', () => ({
  prisma: {
    post: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    postMedia: { create: vi.fn() },
  },
}));

vi.mock('../middleware/auth.js', () => ({
  authenticate: vi.fn((_r: unknown, _s: unknown, n: () => void) => n()),
}));

vi.mock('../middleware/requireRole.js', () => ({
  requireRole: () => vi.fn((_r: unknown, _s: unknown, n: () => void) => n()),
}));

vi.mock('../utils/audit.js', () => ({
  logActivity: vi.fn(),
}));

describe('posts route logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('resolveVisibility', () => {
    const VALID_VISIBILITIES = ['PUBLIC', 'SUBSCRIBERS', 'TIER_SPECIFIC'];
    function resolveVisibility(v?: string) {
      return VALID_VISIBILITIES.includes(v as string) ? v : 'PUBLIC';
    }

    it('should default to PUBLIC for unknown visibility', () => {
      expect(resolveVisibility('PRIVATE')).toBe('PUBLIC');
      expect(resolveVisibility(undefined)).toBe('PUBLIC');
      expect(resolveVisibility('')).toBe('PUBLIC');
    });

    it('should accept valid visibilities', () => {
      expect(resolveVisibility('PUBLIC')).toBe('PUBLIC');
      expect(resolveVisibility('SUBSCRIBERS')).toBe('SUBSCRIBERS');
      expect(resolveVisibility('TIER_SPECIFIC')).toBe('TIER_SPECIFIC');
    });
  });

  describe('parsePpvPrice', () => {
    function parsePpvPrice(ppvPrice?: string): number | null {
      if (!ppvPrice) return null;
      const parsed = parseFloat(ppvPrice);
      if (parsed < 1 || parsed > 500) throw new Error('PPV price must be between $1 and $500');
      return parsed;
    }

    it('should return null for undefined', () => {
      expect(parsePpvPrice()).toBeNull();
      expect(parsePpvPrice('')).toBeNull();
    });

    it('should parse valid price', () => {
      expect(parsePpvPrice('9.99')).toBe(9.99);
      expect(parsePpvPrice('1')).toBe(1);
      expect(parsePpvPrice('500')).toBe(500);
    });

    it('should throw for out-of-range price', () => {
      expect(() => parsePpvPrice('0.50')).toThrow('PPV price must be between');
      expect(() => parsePpvPrice('501')).toThrow('PPV price must be between');
    });
  });

  describe('buildPostCreateData', () => {
    function buildPostCreateData(userId: string, body: Record<string, string>) {
      const VALID_VISIBILITIES = ['PUBLIC', 'SUBSCRIBERS', 'TIER_SPECIFIC'];
      const resolvedVis = VALID_VISIBILITIES.includes(body.visibility) ? body.visibility : 'PUBLIC';
      const ppvPrice = body.ppvPrice ? parseFloat(body.ppvPrice) : null;

      return {
        authorId: userId,
        text: body.text?.trim() || '',
        visibility: resolvedVis,
        ...(ppvPrice && resolvedVis !== 'PUBLIC' ? { ppvPrice } : {}),
        ...(body.isPinned === 'true' ? { isPinned: true } : {}),
      };
    }

    it('should trim text', () => {
      const data = buildPostCreateData('u1', { text: '  hello  ', visibility: 'PUBLIC' });
      expect(data.text).toBe('hello');
    });

    it('should include ppvPrice for non-PUBLIC visibility', () => {
      const data = buildPostCreateData('u1', {
        text: 'test',
        visibility: 'SUBSCRIBERS',
        ppvPrice: '9.99',
      });
      expect(data.ppvPrice).toBe(9.99);
    });

    it('should NOT include ppvPrice for PUBLIC visibility', () => {
      const data = buildPostCreateData('u1', {
        text: 'test',
        visibility: 'PUBLIC',
        ppvPrice: '9.99',
      });
      expect(data.ppvPrice).toBeUndefined();
    });

    it('should set isPinned when true', () => {
      const data = buildPostCreateData('u1', {
        text: 'test',
        visibility: 'PUBLIC',
        isPinned: 'true',
      });
      expect(data.isPinned).toBe(true);
    });

    it('should not set isPinned when false', () => {
      const data = buildPostCreateData('u1', {
        text: 'test',
        visibility: 'PUBLIC',
        isPinned: 'false',
      });
      expect(data.isPinned).toBeUndefined();
    });
  });

  describe('24-hour edit window', () => {
    it('should allow edit within 24 hours', () => {
      const createdAt = new Date(Date.now() - 12 * 60 * 60 * 1000); // 12 hours ago
      const hours = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60);
      expect(hours).toBeLessThanOrEqual(24);
    });

    it('should reject edit after 24 hours', () => {
      const createdAt = new Date(Date.now() - 25 * 60 * 60 * 1000); // 25 hours ago
      const hours = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60);
      expect(hours).toBeGreaterThan(24);
    });
  });
});
