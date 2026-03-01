import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import { validate } from '../middleware/validate.js';

function mockReq(body: unknown): Request {
  return { body, query: {}, params: {} } as unknown as Request;
}

function mockRes(): Response {
  return {} as Response;
}

describe('validate middleware', () => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  it('should pass valid data and set parsed body', () => {
    const next: NextFunction = vi.fn();
    const req = mockReq({ email: 'test@test.com', password: '12345678' });

    validate(schema)(req, mockRes(), next);

    expect(next).toHaveBeenCalledWith();
    expect(req.body).toEqual({ email: 'test@test.com', password: '12345678' });
  });

  it('should call next with ZodError for invalid data', () => {
    const next: NextFunction = vi.fn();
    const req = mockReq({ email: 'not-email', password: '123' });

    validate(schema)(req, mockRes(), next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ issues: expect.any(Array) }));
  });

  it('should validate query params when source is query', () => {
    const querySchema = z.object({ page: z.coerce.number().min(1) });
    const next: NextFunction = vi.fn();
    const req = { body: {}, query: { page: '3' }, params: {} } as unknown as Request;

    validate(querySchema, 'query')(req, mockRes(), next);

    expect(next).toHaveBeenCalledWith();
    expect(req.query).toEqual({ page: 3 });
  });
});
