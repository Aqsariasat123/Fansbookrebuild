import { describe, it, expect } from 'vitest';
import { LIMITS, FEES, MEDIA_CONFIG, AUTH_CONFIG, RATE_LIMITS, PATTERNS } from '../constants';

describe('LIMITS', () => {
  it('should define post length limit', () => {
    expect(LIMITS.MAX_POST_LENGTH).toBe(5000);
  });

  it('should define bio length limit', () => {
    expect(LIMITS.MAX_BIO_LENGTH).toBe(1000);
  });

  it('should define username length bounds', () => {
    expect(LIMITS.MIN_USERNAME_LENGTH).toBe(3);
    expect(LIMITS.MAX_USERNAME_LENGTH).toBe(30);
  });

  it('should define password minimum length', () => {
    expect(LIMITS.MIN_PASSWORD_LENGTH).toBe(8);
  });

  it('should define media limits', () => {
    expect(LIMITS.MAX_MEDIA_PER_POST).toBe(20);
    expect(LIMITS.MAX_MEDIA_PER_MESSAGE).toBe(10);
  });

  it('should define file size limits in bytes', () => {
    expect(LIMITS.MAX_FILE_SIZE_IMAGE).toBe(10 * 1024 * 1024);
    expect(LIMITS.MAX_FILE_SIZE_VIDEO).toBe(500 * 1024 * 1024);
    expect(LIMITS.MAX_FILE_SIZE_AUDIO).toBe(50 * 1024 * 1024);
  });

  it('should define subscription tier limits', () => {
    expect(LIMITS.MAX_SUBSCRIPTION_TIERS).toBe(5);
    expect(LIMITS.MAX_TIER_BENEFITS).toBe(10);
  });

  it('should define story limits', () => {
    expect(LIMITS.STORY_DURATION_HOURS).toBe(24);
    expect(LIMITS.STORY_MAX_VIDEO_SECONDS).toBe(60);
  });

  it('should define pagination defaults', () => {
    expect(LIMITS.PAGINATION_DEFAULT_LIMIT).toBe(20);
    expect(LIMITS.PAGINATION_MAX_LIMIT).toBe(50);
  });
});

describe('FEES', () => {
  it('should define 20% platform fee', () => {
    expect(FEES.PLATFORM_FEE_PERCENT).toBe(20);
  });

  it('should define subscription price range', () => {
    expect(FEES.MIN_SUBSCRIPTION_PRICE).toBe(1);
    expect(FEES.MAX_SUBSCRIPTION_PRICE).toBe(1000);
  });

  it('should define tip amount range', () => {
    expect(FEES.MIN_TIP_AMOUNT).toBe(1);
    expect(FEES.MAX_TIP_AMOUNT).toBe(10000);
  });

  it('should define PPV price range', () => {
    expect(FEES.MIN_PPV_PRICE).toBe(1);
    expect(FEES.MAX_PPV_PRICE).toBe(500);
  });

  it('should define withdrawal minimum', () => {
    expect(FEES.WITHDRAWAL_MIN).toBe(20);
  });

  it('should define marketplace listing range', () => {
    expect(FEES.MIN_LISTING_PRICE).toBe(1);
    expect(FEES.MAX_LISTING_PRICE).toBe(50000);
  });
});

describe('MEDIA_CONFIG', () => {
  it('should define allowed image types', () => {
    expect(MEDIA_CONFIG.ALLOWED_IMAGE_TYPES).toContain('image/jpeg');
    expect(MEDIA_CONFIG.ALLOWED_IMAGE_TYPES).toContain('image/png');
    expect(MEDIA_CONFIG.ALLOWED_IMAGE_TYPES).toContain('image/gif');
    expect(MEDIA_CONFIG.ALLOWED_IMAGE_TYPES).toContain('image/webp');
  });

  it('should define allowed video types', () => {
    expect(MEDIA_CONFIG.ALLOWED_VIDEO_TYPES).toContain('video/mp4');
    expect(MEDIA_CONFIG.ALLOWED_VIDEO_TYPES).toContain('video/quicktime');
    expect(MEDIA_CONFIG.ALLOWED_VIDEO_TYPES).toContain('video/webm');
  });

  it('should define allowed audio types', () => {
    expect(MEDIA_CONFIG.ALLOWED_AUDIO_TYPES).toContain('audio/mpeg');
  });

  it('should define image dimensions', () => {
    expect(MEDIA_CONFIG.IMAGE_QUALITY).toBe(85);
    expect(MEDIA_CONFIG.AVATAR_SIZE).toBe(256);
    expect(MEDIA_CONFIG.COVER_WIDTH).toBe(1200);
    expect(MEDIA_CONFIG.COVER_HEIGHT).toBe(400);
  });
});

describe('AUTH_CONFIG', () => {
  it('should define token expiry', () => {
    expect(AUTH_CONFIG.ACCESS_TOKEN_EXPIRY).toBe('15m');
    expect(AUTH_CONFIG.REFRESH_TOKEN_EXPIRY).toBe('7d');
  });

  it('should define verification token expiry in hours', () => {
    expect(AUTH_CONFIG.VERIFICATION_TOKEN_EXPIRY_HOURS).toBe(24);
    expect(AUTH_CONFIG.RESET_TOKEN_EXPIRY_HOURS).toBe(1);
  });

  it('should define login attempt limits', () => {
    expect(AUTH_CONFIG.MAX_LOGIN_ATTEMPTS).toBe(5);
    expect(AUTH_CONFIG.LOCKOUT_DURATION_MINUTES).toBe(30);
  });

  it('should define 2FA window', () => {
    expect(AUTH_CONFIG.TWO_FACTOR_WINDOW).toBe(1);
  });
});

describe('RATE_LIMITS', () => {
  it('should define AUTH rate limit', () => {
    expect(RATE_LIMITS.AUTH.windowMs).toBe(15 * 60 * 1000);
    expect(RATE_LIMITS.AUTH.max).toBe(5);
  });

  it('should define API rate limit', () => {
    expect(RATE_LIMITS.API.windowMs).toBe(15 * 60 * 1000);
    expect(RATE_LIMITS.API.max).toBe(500);
  });

  it('should define UPLOAD rate limit', () => {
    expect(RATE_LIMITS.UPLOAD.windowMs).toBe(60 * 60 * 1000);
    expect(RATE_LIMITS.UPLOAD.max).toBe(50);
  });
});

describe('PATTERNS', () => {
  it('should validate usernames', () => {
    expect(PATTERNS.USERNAME.test('valid_user123')).toBe(true);
    expect(PATTERNS.USERNAME.test('User_Name')).toBe(true);
    expect(PATTERNS.USERNAME.test('user@name')).toBe(false);
    expect(PATTERNS.USERNAME.test('user name')).toBe(false);
  });

  it('should validate slugs', () => {
    expect(PATTERNS.SLUG.test('hello-world')).toBe(true);
    expect(PATTERNS.SLUG.test('test123')).toBe(true);
    expect(PATTERNS.SLUG.test('Hello-World')).toBe(false);
    expect(PATTERNS.SLUG.test('-invalid')).toBe(false);
  });

  it('should validate hex colors', () => {
    expect(PATTERNS.HEX_COLOR.test('#ff0000')).toBe(true);
    expect(PATTERNS.HEX_COLOR.test('#FFF')).toBe(true);
    expect(PATTERNS.HEX_COLOR.test('#AABBCC')).toBe(true);
    expect(PATTERNS.HEX_COLOR.test('ff0000')).toBe(false);
    expect(PATTERNS.HEX_COLOR.test('#GGHHII')).toBe(false);
  });
});
