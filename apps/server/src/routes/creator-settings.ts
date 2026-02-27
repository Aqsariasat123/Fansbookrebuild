import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// All routes require auth + CREATOR role
router.use(authenticate, requireRole('CREATOR'));

function validateStringField(value: unknown, fieldName: string): string {
  if (typeof value !== 'string') throw new AppError(400, `${fieldName} must be a string`);
  return value.trim();
}

function buildBasicUpdate(body: Record<string, unknown>): Record<string, unknown> {
  const updateData: Record<string, unknown> = {};
  const stringFields = [
    'firstName',
    'lastName',
    'location',
    'profileType',
    'timezone',
    'aboutMe',
  ] as const;

  for (const field of stringFields) {
    if (body[field] !== undefined) {
      updateData[field] = validateStringField(body[field], field);
    }
  }

  // Auto-update displayName if both names provided
  if (updateData.firstName && updateData.lastName) {
    updateData.displayName = `${updateData.firstName} ${updateData.lastName}`;
  }

  return updateData;
}

function buildStatsUpdate(body: Record<string, unknown>): Record<string, unknown> {
  const updateData: Record<string, unknown> = {};

  if (body.dateOfBirth !== undefined) {
    const dob = new Date(body.dateOfBirth as string);
    if (isNaN(dob.getTime())) throw new AppError(400, 'Invalid dateOfBirth format');
    updateData.dateOfBirth = dob;

    // Auto-calculate age from dateOfBirth
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    updateData.age = age;
  }

  if (body.gender !== undefined) {
    updateData.gender = validateStringField(body.gender, 'gender');
  }

  if (body.region !== undefined) {
    updateData.region = validateStringField(body.region, 'region');
  }

  return updateData;
}

// ─── PUT /api/creator/profile/basic ── update basic info ────
router.put('/basic', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const updateData = buildBasicUpdate(req.body);

    const select = {
      id: true,
      username: true,
      displayName: true,
      firstName: true,
      lastName: true,
      location: true,
      profileType: true,
      timezone: true,
      aboutMe: true,
    };
    const user = await prisma.user.update({ where: { id: userId }, data: updateData, select });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/creator/profile/stats ── update stats info ────
router.put('/stats', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const updateData = buildStatsUpdate(req.body);

    const select = { id: true, dateOfBirth: true, age: true, gender: true, region: true };
    const user = await prisma.user.update({ where: { id: userId }, data: updateData, select });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/creator/profile/social-links ── update social links
router.put('/social-links', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { socialLinks } = req.body;

    if (!Array.isArray(socialLinks)) {
      throw new AppError(400, 'socialLinks must be an array');
    }

    for (const link of socialLinks) {
      if (!link.platform || typeof link.platform !== 'string') {
        throw new AppError(400, 'Each social link must have a platform string');
      }
      if (!link.url || typeof link.url !== 'string') {
        throw new AppError(400, 'Each social link must have a url string');
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { socialLinks },
      select: { id: true, socialLinks: true },
    });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/creator/profile/bank ── update bank info ──────
router.put('/bank', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { bankCountry, bankDetails } = req.body;

    const updateData: Record<string, unknown> = {};

    if (bankCountry !== undefined) {
      updateData.bankCountry = validateStringField(bankCountry, 'bankCountry');
    }

    if (bankDetails !== undefined) {
      if (typeof bankDetails !== 'object' || bankDetails === null || Array.isArray(bankDetails)) {
        throw new AppError(400, 'bankDetails must be an object');
      }
      updateData.bankDetails = bankDetails;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { id: true, bankCountry: true, bankDetails: true },
    });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/creator/profile/blocked-countries ── update blocked countries
router.put('/blocked-countries', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { blockedCountries } = req.body;

    if (!Array.isArray(blockedCountries)) {
      throw new AppError(400, 'blockedCountries must be an array');
    }

    for (const country of blockedCountries) {
      if (typeof country !== 'string') {
        throw new AppError(400, 'Each blocked country must be a string');
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { blockedCountries },
      select: { id: true, blockedCountries: true },
    });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/creator/profile/deactivate ── deactivate account
router.put('/deactivate', async (req, res, next) => {
  try {
    const userId = req.user!.userId;

    await prisma.user.update({
      where: { id: userId },
      data: { status: 'DEACTIVATED' },
    });

    res.json({ success: true, message: 'Account deactivated' });
  } catch (err) {
    next(err);
  }
});

export default router;
