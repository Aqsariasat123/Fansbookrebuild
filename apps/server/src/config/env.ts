import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(10),
  JWT_REFRESH_SECRET: z.string().min(10),
  SENTRY_DSN: z.string().optional().default(''),
  CLIENT_URL: z.string().url().default('http://localhost:5173'),
  // Redis (optional — Socket.IO + BullMQ disabled without it)
  REDIS_URL: z.string().optional().default('redis://localhost:6379'),
  // S3 (optional — falls back to local uploads)
  AWS_REGION: z.string().optional().default(''),
  AWS_BUCKET: z.string().optional().default(''),
  AWS_ACCESS_KEY_ID: z.string().optional().default(''),
  AWS_SECRET_ACCESS_KEY: z.string().optional().default(''),
  UPLOAD_PROVIDER: z.enum(['local', 's3']).optional().default('local'),
  // Email (optional — logs to console when disabled)
  SMTP_HOST: z.string().optional().default(''),
  SMTP_PORT: z.coerce.number().optional().default(587),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.string().optional().default(''),
  SMTP_FROM: z.string().optional().default('noreply@fansbook.com'),
  EMAIL_ENABLED: z.string().optional().default('false'),
});

function loadEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.format();
    throw new Error(`Environment validation failed:\n${JSON.stringify(formatted, null, 2)}`);
  }

  return result.data;
}

export const env = loadEnv();
