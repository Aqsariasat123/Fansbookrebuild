import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { upload, USER_SELECT } from './profile-helpers.js';

const router = Router();

function extractFileUrl(files: Record<string, Express.Multer.File[]>, key: string, prefix: string) {
  const file = files?.[key]?.[0];
  return file ? `${prefix}${file.filename}` : undefined;
}

function parseInterestsSafe(raw?: string): unknown | undefined {
  if (!raw) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function buildOnboardingData(
  body: Record<string, string>,
  files: Record<string, Express.Multer.File[]>,
) {
  const data: Record<string, unknown> = { onboardingCompleted: true };
  const avatar = extractFileUrl(files, 'avatar', '/api/profile/avatar/');
  const cover = extractFileUrl(files, 'cover', '/api/profile/cover/');
  if (avatar) data.avatar = avatar;
  if (cover) data.coverImage = cover;
  if (body.bio) data.aboutMe = body.bio.trim();
  if (body.location) data.region = body.location.trim();
  if (body.website) data.socialLinks = JSON.stringify({ website: body.website.trim() });
  const interests = parseInterestsSafe(body.interests);
  if (interests) data.interests = interests;
  return data;
}

// PUT /api/profile/onboarding — Complete onboarding wizard
router.put(
  '/onboarding',
  authenticate,
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
  ]),
  async (req, res, next) => {
    try {
      const userId = req.user!.userId;
      const files = req.files as Record<string, Express.Multer.File[]>;
      const updateData = buildOnboardingData(req.body, files);

      const user = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: USER_SELECT,
      });

      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
