import { describe, it, expect } from 'vitest';
import {
  registerSchema,
  createPostSchema,
  updateProfileSchema,
  changePasswordSchema,
  updatePostSchema,
} from '../schemas';

describe('registerSchema', () => {
  const validData = {
    email: 'user@test.com',
    username: 'validuser',
    displayName: 'Test User',
    password: 'Password1',
    confirmPassword: 'Password1',
    dateOfBirth: '1990-01-01',
    acceptTerms: true as const,
  };

  it('should accept valid registration data', () => {
    expect(registerSchema.safeParse(validData).success).toBe(true);
  });

  it('should reject short username', () => {
    expect(registerSchema.safeParse({ ...validData, username: 'ab' }).success).toBe(false);
  });

  it('should reject username with special chars', () => {
    expect(registerSchema.safeParse({ ...validData, username: 'user@name' }).success).toBe(false);
  });

  it('should reject password without uppercase', () => {
    expect(
      registerSchema.safeParse({
        ...validData,
        password: 'password1',
        confirmPassword: 'password1',
      }).success,
    ).toBe(false);
  });

  it('should reject password without number', () => {
    expect(
      registerSchema.safeParse({ ...validData, password: 'Password', confirmPassword: 'Password' })
        .success,
    ).toBe(false);
  });

  it('should reject mismatched passwords', () => {
    expect(registerSchema.safeParse({ ...validData, confirmPassword: 'Different1' }).success).toBe(
      false,
    );
  });

  it('should reject underage user', () => {
    const recent = new Date();
    recent.setFullYear(recent.getFullYear() - 17);
    expect(
      registerSchema.safeParse({ ...validData, dateOfBirth: recent.toISOString().split('T')[0] })
        .success,
    ).toBe(false);
  });

  it('should reject when terms not accepted', () => {
    expect(registerSchema.safeParse({ ...validData, acceptTerms: false }).success).toBe(false);
  });
});

describe('createPostSchema', () => {
  it('should accept valid post', () => {
    const result = createPostSchema.safeParse({ visibility: 'PUBLIC', content: 'Hello world' });
    expect(result.success).toBe(true);
  });

  it('should require visibility', () => {
    expect(createPostSchema.safeParse({ content: 'test' }).success).toBe(false);
  });

  it('should reject invalid visibility', () => {
    expect(createPostSchema.safeParse({ visibility: 'PRIVATE', content: 'test' }).success).toBe(
      false,
    );
  });

  it('should accept PPV visibility with price', () => {
    expect(createPostSchema.safeParse({ visibility: 'PPV', ppvPrice: 9.99 }).success).toBe(true);
  });

  it('should reject ppvPrice below 1', () => {
    expect(createPostSchema.safeParse({ visibility: 'PPV', ppvPrice: 0.5 }).success).toBe(false);
  });

  it('should reject ppvPrice above 500', () => {
    expect(createPostSchema.safeParse({ visibility: 'PPV', ppvPrice: 501 }).success).toBe(false);
  });

  it('should reject content over 5000 chars', () => {
    expect(
      createPostSchema.safeParse({ visibility: 'PUBLIC', content: 'a'.repeat(5001) }).success,
    ).toBe(false);
  });

  it('should accept max 20 media IDs', () => {
    const mediaIds = Array.from({ length: 20 }, () => '00000000-0000-0000-0000-000000000000');
    expect(createPostSchema.safeParse({ visibility: 'PUBLIC', mediaIds }).success).toBe(true);
  });

  it('should reject more than 20 media IDs', () => {
    const mediaIds = Array.from({ length: 21 }, () => '00000000-0000-0000-0000-000000000000');
    expect(createPostSchema.safeParse({ visibility: 'PUBLIC', mediaIds }).success).toBe(false);
  });
});

describe('updatePostSchema', () => {
  it('should accept partial updates', () => {
    expect(updatePostSchema.safeParse({ content: 'Updated' }).success).toBe(true);
    expect(updatePostSchema.safeParse({}).success).toBe(true);
  });
});

describe('updateProfileSchema', () => {
  it('should accept valid profile data', () => {
    expect(updateProfileSchema.safeParse({ displayName: 'New Name', bio: 'Hello!' }).success).toBe(
      true,
    );
  });

  it('should reject displayName over 50 chars', () => {
    expect(updateProfileSchema.safeParse({ displayName: 'a'.repeat(51) }).success).toBe(false);
  });

  it('should accept empty string for optional fields', () => {
    expect(updateProfileSchema.safeParse({ firstName: '', lastName: '' }).success).toBe(true);
  });

  it('should reject invalid website URL', () => {
    expect(updateProfileSchema.safeParse({ website: 'not-a-url' }).success).toBe(false);
  });

  it('should accept valid website URL', () => {
    expect(updateProfileSchema.safeParse({ website: 'https://example.com' }).success).toBe(true);
  });

  it('should accept empty website', () => {
    expect(updateProfileSchema.safeParse({ website: '' }).success).toBe(true);
  });
});

describe('changePasswordSchema', () => {
  it('should accept valid password change', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'OldPass123',
      newPassword: 'NewPass123',
      confirmPassword: 'NewPass123',
    });
    expect(result.success).toBe(true);
  });

  it('should reject mismatched new passwords', () => {
    expect(
      changePasswordSchema.safeParse({
        currentPassword: 'OldPass123',
        newPassword: 'NewPass123',
        confirmPassword: 'Different1',
      }).success,
    ).toBe(false);
  });

  it('should reject weak new password', () => {
    expect(
      changePasswordSchema.safeParse({
        currentPassword: 'OldPass123',
        newPassword: 'weak',
        confirmPassword: 'weak',
      }).success,
    ).toBe(false);
  });

  it('should require current password', () => {
    expect(
      changePasswordSchema.safeParse({
        currentPassword: '',
        newPassword: 'NewPass123',
        confirmPassword: 'NewPass123',
      }).success,
    ).toBe(false);
  });
});
