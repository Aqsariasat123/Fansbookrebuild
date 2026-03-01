import { describe, it, expect } from 'vitest';
import { RATE_LIMITS } from '@fansbook/shared';

describe('rate limiter configuration', () => {
  it('should define API rate limit at 500 per 15 minutes', () => {
    expect(RATE_LIMITS.API.max).toBe(500);
    expect(RATE_LIMITS.API.windowMs).toBe(15 * 60 * 1000);
  });

  it('should define AUTH rate limit at 5 per 15 minutes', () => {
    expect(RATE_LIMITS.AUTH.max).toBe(5);
    expect(RATE_LIMITS.AUTH.windowMs).toBe(15 * 60 * 1000);
  });

  it('should define UPLOAD rate limit at 50 per hour', () => {
    expect(RATE_LIMITS.UPLOAD.max).toBe(50);
    expect(RATE_LIMITS.UPLOAD.windowMs).toBe(60 * 60 * 1000);
  });

  it('should define all three rate limit categories', () => {
    expect(RATE_LIMITS).toHaveProperty('API');
    expect(RATE_LIMITS).toHaveProperty('AUTH');
    expect(RATE_LIMITS).toHaveProperty('UPLOAD');
  });

  it('should have windowMs and max on each category', () => {
    for (const key of ['API', 'AUTH', 'UPLOAD'] as const) {
      expect(RATE_LIMITS[key]).toHaveProperty('windowMs');
      expect(RATE_LIMITS[key]).toHaveProperty('max');
      expect(typeof RATE_LIMITS[key].windowMs).toBe('number');
      expect(typeof RATE_LIMITS[key].max).toBe('number');
    }
  });
});
