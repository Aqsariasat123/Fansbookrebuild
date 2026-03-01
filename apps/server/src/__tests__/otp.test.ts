import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockBcryptHash = vi.fn().mockResolvedValue('hashed-otp');
const mockBcryptCompare = vi.fn();
vi.mock('bcryptjs', () => ({
  default: {
    hash: (...args: unknown[]) => mockBcryptHash(...args),
    compare: (...args: unknown[]) => mockBcryptCompare(...args),
  },
  hash: (...args: unknown[]) => mockBcryptHash(...args),
  compare: (...args: unknown[]) => mockBcryptCompare(...args),
}));

const mockUpdateMany = vi.fn().mockResolvedValue({ count: 0 });
const mockCreate = vi.fn().mockResolvedValue({ id: 'otp-1' });
const mockFindMany = vi.fn().mockResolvedValue([]);
const mockUpdate = vi.fn().mockResolvedValue({});
vi.mock('../config/database.js', () => ({
  prisma: {
    otpCode: {
      updateMany: (...args: unknown[]) => mockUpdateMany(...args),
      create: (...args: unknown[]) => mockCreate(...args),
      findMany: (...args: unknown[]) => mockFindMany(...args),
      update: (...args: unknown[]) => mockUpdate(...args),
    },
    user: { findUnique: vi.fn().mockResolvedValue(null) },
  },
}));

vi.mock('../utils/email.js', () => ({
  sendEmail: vi.fn(),
}));

vi.mock('../utils/logger.js', () => ({
  logger: { info: vi.fn(), error: vi.fn() },
}));

import { maskEmail, generateOtp, verifyOtp } from '../utils/otp.js';

describe('OTP utility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('maskEmail', () => {
    it('should mask standard email', () => {
      // "john" has length 4 → first 2 chars + min(4-2, 5)=2 asterisks
      expect(maskEmail('john@example.com')).toBe('jo**@example.com');
    });

    it('should mask short local part', () => {
      // "ab" has length 2 → only first char visible
      expect(maskEmail('ab@test.com')).toBe('a***@test.com');
    });

    it('should mask single char local', () => {
      expect(maskEmail('a@test.com')).toBe('a***@test.com');
    });

    it('should mask long local part', () => {
      // "verylongemail" has length 13 → first 2 + min(13-2, 5)=5 asterisks
      const masked = maskEmail('verylongemail@domain.com');
      expect(masked).toBe('ve*****@domain.com');
    });
  });

  describe('generateOtp', () => {
    it('should invalidate existing OTPs before creating new one', async () => {
      await generateOtp('user-1', 'EMAIL_VERIFY');
      expect(mockUpdateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-1', type: 'EMAIL_VERIFY', used: false },
          data: { used: true },
        }),
      );
    });

    it('should create hashed OTP in database', async () => {
      await generateOtp('user-1', 'EMAIL_VERIFY');
      expect(mockBcryptHash).toHaveBeenCalled();
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'user-1',
            code: 'hashed-otp',
            type: 'EMAIL_VERIFY',
          }),
        }),
      );
    });

    it('should return 6-digit string', async () => {
      const otp = await generateOtp('user-1', 'PASSWORD_RESET');
      expect(otp).toMatch(/^\d{6}$/);
    });
  });

  describe('verifyOtp', () => {
    it('should return false when no matching OTPs exist', async () => {
      mockFindMany.mockResolvedValueOnce([]);
      const result = await verifyOtp('user-1', '123456', 'EMAIL_VERIFY');
      expect(result).toBe(false);
    });

    it('should return true and mark as used when OTP matches', async () => {
      mockFindMany.mockResolvedValueOnce([{ id: 'otp-1', code: 'hashed' }]);
      mockBcryptCompare.mockResolvedValueOnce(true);

      const result = await verifyOtp('user-1', '123456', 'EMAIL_VERIFY');
      expect(result).toBe(true);
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'otp-1' },
          data: { used: true },
        }),
      );
    });

    it('should return false when OTP does not match', async () => {
      mockFindMany.mockResolvedValueOnce([{ id: 'otp-1', code: 'hashed' }]);
      mockBcryptCompare.mockResolvedValueOnce(false);

      const result = await verifyOtp('user-1', '000000', 'EMAIL_VERIFY');
      expect(result).toBe(false);
    });
  });
});
