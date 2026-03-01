import { describe, it, expect, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { requireRole } from '../middleware/requireRole.js';

function mockReq(user?: { userId: string; role: string }): Request {
  return { user } as unknown as Request;
}

function mockRes(): Response {
  return {} as Response;
}

describe('requireRole middleware', () => {
  it('should reject unauthenticated request', () => {
    const next: NextFunction = vi.fn();
    requireRole('CREATOR')(mockReq(), mockRes(), next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401, message: 'Authentication required' }),
    );
  });

  it('should reject user with wrong role', () => {
    const next: NextFunction = vi.fn();
    requireRole('CREATOR')(mockReq({ userId: 'u1', role: 'FAN' }), mockRes(), next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 403, message: 'Insufficient permissions' }),
    );
  });

  it('should allow user with matching role', () => {
    const next: NextFunction = vi.fn();
    requireRole('CREATOR')(mockReq({ userId: 'u1', role: 'CREATOR' }), mockRes(), next);
    expect(next).toHaveBeenCalledWith();
  });

  it('should allow user with any of multiple roles', () => {
    const next: NextFunction = vi.fn();
    requireRole('ADMIN', 'MODERATOR')(
      mockReq({ userId: 'u1', role: 'MODERATOR' }),
      mockRes(),
      next,
    );
    expect(next).toHaveBeenCalledWith();
  });

  it('should reject user not in any of multiple roles', () => {
    const next: NextFunction = vi.fn();
    requireRole('ADMIN', 'MODERATOR')(mockReq({ userId: 'u1', role: 'FAN' }), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
  });
});
