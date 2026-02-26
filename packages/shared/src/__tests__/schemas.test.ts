import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema, searchSchema } from '../schemas';

describe('shared/schemas', () => {
  describe('loginSchema', () => {
    it('validates correct login data', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'not-an-email',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('rejects short password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: '123',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('searchSchema', () => {
    it('validates search query', () => {
      const result = searchSchema.safeParse({ query: 'test' });
      expect(result.success).toBe(true);
    });

    it('rejects empty query', () => {
      const result = searchSchema.safeParse({ query: '' });
      expect(result.success).toBe(false);
    });
  });
});
