import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { AppError } from '../middleware/errorHandler.js';
import { generatePresignedUrl, isS3Enabled } from '../utils/upload.js';
import path from 'path';

const router = Router();

const ALLOWED_CATEGORIES = [
  'avatars',
  'covers',
  'posts',
  'messages',
  'stories',
  'marketplace',
  'documents',
];
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/quicktime',
];

const presignedSchema = z.object({
  category: z.string().min(1),
  contentType: z.string().min(1),
  fileName: z.string().min(1),
});

router.post('/presigned', authenticate, validate(presignedSchema), async (req, res, next) => {
  try {
    if (!isS3Enabled()) {
      throw new AppError(400, 'S3 uploads not configured. Use local upload endpoint.');
    }

    const { category, contentType, fileName } = req.body;

    if (!ALLOWED_CATEGORIES.includes(category)) {
      throw new AppError(400, `Invalid category. Allowed: ${ALLOWED_CATEGORIES.join(', ')}`);
    }
    if (!ALLOWED_TYPES.includes(contentType)) {
      throw new AppError(400, `Invalid content type. Allowed: ${ALLOWED_TYPES.join(', ')}`);
    }

    const ext = path.extname(fileName) || '.jpg';
    const result = await generatePresignedUrl(category, contentType, ext);

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

export default router;
