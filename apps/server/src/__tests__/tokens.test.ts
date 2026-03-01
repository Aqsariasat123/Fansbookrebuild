import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../config/env.js', () => ({
  env: {
    JWT_SECRET: 'test-secret-key-minimum-10',
    JWT_REFRESH_SECRET: 'test-refresh-key-minimum-10',
  },
}));

vi.mock('../config/database.js', () => ({
  prisma: {
    refreshToken: {
      create: vi.fn().mockResolvedValue({ id: 'rt-1' }),
    },
  },
}));

import { generateTokens, REFRESH_EXPIRY_MS } from '../utils/tokens.js';
import jwt from 'jsonwebtoken';

describe('tokens utility', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should have 7-day default refresh expiry', () => {
    expect(REFRESH_EXPIRY_MS).toBe(7 * 24 * 60 * 60 * 1000);
  });

  it('should generate both access and refresh tokens', () => {
    const tokens = generateTokens('user-1', 'FAN');
    expect(tokens.accessToken).toBeDefined();
    expect(tokens.refreshToken).toBeDefined();
    expect(typeof tokens.accessToken).toBe('string');
    expect(typeof tokens.refreshToken).toBe('string');
  });

  it('should include userId and role in access token payload', () => {
    const tokens = generateTokens('user-1', 'CREATOR');
    const decoded = jwt.verify(tokens.accessToken, 'test-secret-key-minimum-10') as {
      userId: string;
      role: string;
    };
    expect(decoded.userId).toBe('user-1');
    expect(decoded.role).toBe('CREATOR');
  });

  it('should include userId and role in refresh token payload', () => {
    const tokens = generateTokens('user-2', 'FAN');
    const decoded = jwt.verify(tokens.refreshToken, 'test-refresh-key-minimum-10') as {
      userId: string;
      role: string;
    };
    expect(decoded.userId).toBe('user-2');
    expect(decoded.role).toBe('FAN');
  });

  it('should accept custom refresh expiry', () => {
    const customExpiry = 60 * 1000; // 1 minute
    const tokens = generateTokens('user-1', 'FAN', customExpiry);
    const decoded = jwt.verify(tokens.refreshToken, 'test-refresh-key-minimum-10') as {
      exp: number;
      iat: number;
    };
    // Check that expiry is roughly 60 seconds from iat
    expect(decoded.exp - decoded.iat).toBe(60);
  });
});
