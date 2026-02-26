import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(10),
  JWT_REFRESH_SECRET: z.string().min(10),
  SENTRY_DSN: z.string().optional().default(''),
  CLIENT_URL: z.string().url().default('http://localhost:5173'),
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
