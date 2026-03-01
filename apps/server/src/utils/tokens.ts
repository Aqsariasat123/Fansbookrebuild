import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';
import { env } from '../config/env.js';

export const REFRESH_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

export function generateTokens(userId: string, role: string, refreshExpiryMs?: number) {
  const expiryMs = refreshExpiryMs || REFRESH_EXPIRY_MS;
  const expirySeconds = Math.floor(expiryMs / 1000);
  const accessToken = jwt.sign({ userId, role }, env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId, role }, env.JWT_REFRESH_SECRET, {
    expiresIn: expirySeconds,
  });
  return { accessToken, refreshToken };
}

export async function storeRefreshToken(userId: string, token: string, expiryMs?: number) {
  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt: new Date(Date.now() + (expiryMs || REFRESH_EXPIRY_MS)),
    },
  });
}

export async function generateAndStoreTokens(
  userId: string,
  role: string,
  refreshExpiryMs?: number,
) {
  const tokens = generateTokens(userId, role, refreshExpiryMs);
  await storeRefreshToken(userId, tokens.refreshToken, refreshExpiryMs);
  return tokens;
}

export const ME_SELECT = {
  id: true,
  username: true,
  email: true,
  displayName: true,
  firstName: true,
  lastName: true,
  mobileNumber: true,
  secondaryEmail: true,
  role: true,
  status: true,
  avatar: true,
  cover: true,
  bio: true,
  location: true,
  website: true,
  emailVerified: true,
  twoFactorEnabled: true,
  onboardingStep: true,
  notifSettings: true,
  privacySettings: true,
  createdAt: true,
} as const;
