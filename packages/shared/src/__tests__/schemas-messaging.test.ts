import { describe, it, expect } from 'vitest';
import {
  createSubscriptionTierSchema,
  sendMessageSchema,
  createReportSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../schemas';

describe('createSubscriptionTierSchema', () => {
  it('should accept valid tier', () => {
    const result = createSubscriptionTierSchema.safeParse({
      name: 'Gold',
      price: 9.99,
      benefits: ['Exclusive content'],
    });
    expect(result.success).toBe(true);
  });

  it('should require name', () => {
    expect(createSubscriptionTierSchema.safeParse({ price: 9.99, benefits: [] }).success).toBe(
      false,
    );
  });

  it('should reject price below 1', () => {
    expect(
      createSubscriptionTierSchema.safeParse({ name: 'Test', price: 0, benefits: [] }).success,
    ).toBe(false);
  });

  it('should reject price above 1000', () => {
    expect(
      createSubscriptionTierSchema.safeParse({ name: 'Test', price: 1001, benefits: [] }).success,
    ).toBe(false);
  });

  it('should reject more than 10 benefits', () => {
    const benefits = Array.from({ length: 11 }, (_, i) => `Benefit ${i}`);
    expect(
      createSubscriptionTierSchema.safeParse({ name: 'Test', price: 5, benefits }).success,
    ).toBe(false);
  });
});

describe('sendMessageSchema', () => {
  it('should accept text message', () => {
    expect(sendMessageSchema.safeParse({ text: 'Hello!' }).success).toBe(true);
  });

  it('should reject content over 5000 chars', () => {
    expect(sendMessageSchema.safeParse({ text: 'a'.repeat(5001) }).success).toBe(false);
  });

  it('should reject empty text', () => {
    expect(sendMessageSchema.safeParse({ text: '' }).success).toBe(false);
  });

  it('should reject missing text', () => {
    expect(sendMessageSchema.safeParse({}).success).toBe(false);
  });
});

describe('createReportSchema', () => {
  it('should accept valid report', () => {
    const result = createReportSchema.safeParse({
      reason: 'SPAM',
      entityId: '00000000-0000-0000-0000-000000000000',
      entityType: 'POST',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid reason', () => {
    expect(
      createReportSchema.safeParse({
        reason: 'INVALID',
        entityId: '00000000-0000-0000-0000-000000000000',
        entityType: 'POST',
      }).success,
    ).toBe(false);
  });

  it('should accept all valid entity types', () => {
    for (const type of ['USER', 'POST', 'COMMENT', 'MESSAGE']) {
      const result = createReportSchema.safeParse({
        reason: 'SPAM',
        entityId: '00000000-0000-0000-0000-000000000000',
        entityType: type,
      });
      expect(result.success).toBe(true);
    }
  });

  it('should require entityId as UUID', () => {
    expect(
      createReportSchema.safeParse({
        reason: 'SPAM',
        entityId: 'not-a-uuid',
        entityType: 'POST',
      }).success,
    ).toBe(false);
  });
});

describe('forgotPasswordSchema', () => {
  it('should accept valid email', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'test@test.com' }).success).toBe(true);
  });

  it('should reject invalid email', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'bad' }).success).toBe(false);
  });
});

describe('resetPasswordSchema', () => {
  it('should accept valid reset data', () => {
    const result = resetPasswordSchema.safeParse({
      token: 'abc123',
      password: 'NewPass1',
      confirmPassword: 'NewPass1',
    });
    expect(result.success).toBe(true);
  });

  it('should reject mismatched passwords', () => {
    expect(
      resetPasswordSchema.safeParse({
        token: 'abc',
        password: 'NewPass1',
        confirmPassword: 'Other1',
      }).success,
    ).toBe(false);
  });
});
