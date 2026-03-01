import { z } from 'zod';

// ─── Auth Schemas ────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  twoFactorCode: z.string().length(6).optional(),
});

export const registerSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must be at most 30 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    displayName: z.string().min(1, 'Display name is required').max(50),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    dateOfBirth: z.string().refine(
      (val) => {
        const age = Math.floor(
          (Date.now() - new Date(val).getTime()) / (365.25 * 24 * 60 * 60 * 1000),
        );
        return age >= 18;
      },
      { message: 'You must be at least 18 years old' },
    ),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms of service' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// ─── Post Schemas ────────────────────────────────────────

export const createPostSchema = z.object({
  content: z.string().max(5000, 'Post content must be at most 5000 characters').optional(),
  visibility: z.enum(['PUBLIC', 'SUBSCRIBERS_ONLY', 'PPV', 'TIER_LOCKED']),
  ppvPrice: z.number().min(1).max(500).optional(),
  tierIds: z.array(z.string().uuid()).optional(),
  mediaIds: z.array(z.string().uuid()).max(20, 'Maximum 20 media files per post').optional(),
  scheduledAt: z.string().datetime().optional(),
});

export const updatePostSchema = createPostSchema.partial();

// ─── Profile Schemas ─────────────────────────────────────

export const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  firstName: z.string().max(50).optional().or(z.literal('')),
  lastName: z.string().max(50).optional().or(z.literal('')),
  mobileNumber: z.string().max(20).optional().or(z.literal('')),
  bio: z.string().max(1000).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().max(200).optional().or(z.literal('')),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// ─── Subscription Schemas ────────────────────────────────

export const createSubscriptionTierSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(500).optional(),
  price: z.number().min(1).max(1000),
  benefits: z.array(z.string().max(200)).max(10),
});

// ─── Subscribe Schema ────────────────────────────────────

export const subscribeSchema = z.object({
  tierId: z.string().uuid('Invalid tier ID'),
});

// ─── Withdrawal Schema ──────────────────────────────────

export const withdrawalSchema = z.object({
  amount: z.number().min(20, 'Minimum withdrawal is $20'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
});

// ─── Chat Schemas ────────────────────────────────────────

export const sendMessageSchema = z.object({
  text: z.string().min(1).max(5000),
});

// ─── Report Schema ───────────────────────────────────────

export const createReportSchema = z.object({
  reason: z.enum(['SPAM', 'HARASSMENT', 'INAPPROPRIATE', 'COPYRIGHT', 'UNDERAGE', 'OTHER']),
  description: z.string().max(1000).optional(),
  entityId: z.string().uuid(),
  entityType: z.enum(['USER', 'POST', 'COMMENT', 'MESSAGE']),
});

// ─── Search Schema ───────────────────────────────────────

export const searchSchema = z.object({
  query: z.string().min(1).max(100),
  type: z.enum(['users', 'posts', 'tags']).optional(),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().min(1).max(50).optional().default(20),
});

// ─── Type Exports ────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type CreateSubscriptionTierInput = z.infer<typeof createSubscriptionTierSchema>;
export type SubscribeInput = z.infer<typeof subscribeSchema>;
export type WithdrawalInput = z.infer<typeof withdrawalSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type CreateReportInput = z.infer<typeof createReportSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
