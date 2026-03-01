// ─── Limits ──────────────────────────────────────────────

export const LIMITS = {
  MAX_POST_LENGTH: 5000,
  MAX_BIO_LENGTH: 1000,
  MAX_USERNAME_LENGTH: 30,
  MIN_USERNAME_LENGTH: 3,
  MIN_PASSWORD_LENGTH: 8,
  MAX_DISPLAY_NAME_LENGTH: 50,
  MAX_MEDIA_PER_POST: 20,
  MAX_MEDIA_PER_MESSAGE: 10,
  MAX_SUBSCRIPTION_TIERS: 5,
  MAX_TIER_BENEFITS: 10,
  MAX_FILE_SIZE_IMAGE: 10 * 1024 * 1024, // 10MB
  MAX_FILE_SIZE_VIDEO: 500 * 1024 * 1024, // 500MB
  MAX_FILE_SIZE_AUDIO: 50 * 1024 * 1024, // 50MB
  STORY_DURATION_HOURS: 24,
  STORY_MAX_VIDEO_SECONDS: 60,
  PAGINATION_DEFAULT_LIMIT: 20,
  PAGINATION_MAX_LIMIT: 50,
} as const;

// ─── Fees ────────────────────────────────────────────────

export const FEES = {
  PLATFORM_FEE_PERCENT: 20,
  MIN_SUBSCRIPTION_PRICE: 1,
  MAX_SUBSCRIPTION_PRICE: 1000,
  MIN_TIP_AMOUNT: 1,
  MAX_TIP_AMOUNT: 10000,
  MIN_PPV_PRICE: 1,
  MAX_PPV_PRICE: 500,
  MIN_LISTING_PRICE: 1,
  MAX_LISTING_PRICE: 50000,
  WITHDRAWAL_MIN: 20,
} as const;

// ─── Media Config ────────────────────────────────────────

export const MEDIA_CONFIG = {
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/quicktime', 'video/webm'],
  ALLOWED_AUDIO_TYPES: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  IMAGE_QUALITY: 85,
  THUMBNAIL_WIDTH: 400,
  THUMBNAIL_HEIGHT: 400,
  AVATAR_SIZE: 256,
  COVER_WIDTH: 1200,
  COVER_HEIGHT: 400,
} as const;

// ─── Auth Config ─────────────────────────────────────────

export const AUTH_CONFIG = {
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',
  VERIFICATION_TOKEN_EXPIRY_HOURS: 24,
  RESET_TOKEN_EXPIRY_HOURS: 1,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MINUTES: 30,
  TWO_FACTOR_WINDOW: 1,
} as const;

// ─── Rate Limits ─────────────────────────────────────────

export const RATE_LIMITS = {
  AUTH: { windowMs: 15 * 60 * 1000, max: 5 },
  API: { windowMs: 15 * 60 * 1000, max: 500 },
  UPLOAD: { windowMs: 60 * 60 * 1000, max: 50 },
} as const;

// ─── Regex Patterns ──────────────────────────────────────

export const PATTERNS = {
  USERNAME: /^[a-zA-Z0-9_]+$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
} as const;
