import { Router } from 'express';
import multer from 'multer';
import { prisma } from '../../config/database.js';
import { decodeUserIdFromImage } from '../../utils/lsbWatermark.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

// POST /api/admin/watermark/investigate — upload image, decode embedded userId
router.post('/investigate', upload.single('image'), async (req, res, next) => {
  try {
    const adminId = req.user!.userId;
    if (!req.file) {
      res.status(400).json({ success: false, message: 'Image file required' });
      return;
    }

    const decoded = await decodeUserIdFromImage(req.file.buffer);

    if (!decoded) {
      await prisma.watermarkInvestigation.create({
        data: { adminId, filename: req.file.originalname, decodedUserId: null },
      });
      res.json({
        success: true,
        data: { found: false, message: 'No watermark found in this image' },
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded },
      select: { id: true, username: true, displayName: true, email: true, avatar: true },
    });

    await prisma.watermarkInvestigation.create({
      data: {
        adminId,
        filename: req.file.originalname,
        decodedUserId: decoded,
        username: user?.username ?? null,
        displayName: user?.displayName ?? null,
      },
    });

    res.json({ success: true, data: { found: true, userId: decoded, user: user ?? null } });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/watermark/stats — summary counts + recent investigations
router.get('/stats', async (_req, res, next) => {
  try {
    const [total, found, recent] = await Promise.all([
      prisma.watermarkInvestigation.count(),
      prisma.watermarkInvestigation.count({ where: { decodedUserId: { not: null } } }),
      prisma.watermarkInvestigation.findMany({
        orderBy: { foundAt: 'desc' },
        take: 20,
        include: { admin: { select: { username: true, displayName: true } } },
      }),
    ]);

    res.json({ success: true, data: { total, found, notFound: total - found, recent } });
  } catch (err) {
    next(err);
  }
});

export default router;
