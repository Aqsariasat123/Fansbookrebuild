import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

// Mock env before importing auth
vi.mock('../config/env.js', () => ({
  env: {
    JWT_SECRET: 'test-secret-key-minimum-10',
    JWT_REFRESH_SECRET: 'test-refresh-key-minimum-10',
  },
}));

// Mock jsonwebtoken
const mockVerify = vi.fn();
vi.mock('jsonwebtoken', () => ({
  default: { verify: (...args: unknown[]) => mockVerify(...args) },
  verify: (...args: unknown[]) => mockVerify(...args),
}));

import { authenticate } from '../middleware/auth.js';

function mockReq(headers: Record<string, string> = {}): Request {
  return { headers } as unknown as Request;
}

function mockRes(): Response {
  return {} as Response;
}

describe('authenticate middleware', () => {
  let next: NextFunction;

  beforeEach(() => {
    next = vi.fn();
    mockVerify.mockReset();
  });

  it('should reject request without Authorization header', () => {
    authenticate(mockReq(), mockRes(), next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401, message: 'Authentication required' }),
    );
  });

  it('should reject request with non-Bearer token', () => {
    authenticate(mockReq({ authorization: 'Basic abc' }), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
  });

  it('should set req.user for valid token', () => {
    const payload = { userId: 'user-123', role: 'FAN' };
    mockVerify.mockReturnValue(payload);

    const req = mockReq({ authorization: 'Bearer valid-token' });
    authenticate(req, mockRes(), next);

    expect(req.user).toEqual(payload);
    expect(next).toHaveBeenCalledWith(); // called with no args = success
  });

  it('should reject expired/invalid token', () => {
    mockVerify.mockImplementation(() => {
      throw new Error('jwt expired');
    });

    authenticate(mockReq({ authorization: 'Bearer expired-token' }), mockRes(), next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401, message: 'Invalid or expired token' }),
    );
  });
});
