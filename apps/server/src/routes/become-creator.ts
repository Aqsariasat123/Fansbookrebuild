import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();
const uploadsDir = path.join(process.cwd(), 'uploads', 'verification');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${req.user!.userId}-${file.fieldname}-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

function buildFileUrl(file?: Express.Multer.File): string | undefined {
  return file ? `/api/auth/verification-file/${file.filename}` : undefined;
}

function buildCreatorUpdateData(
  files: Record<string, Express.Multer.File[]>,
  body: Record<string, string>,
) {
  const { bankCountry, bankName, accountNumber, routing } = body;
  return {
    role: 'CREATOR' as const,
    idDocumentUrl: buildFileUrl(files?.idDocument?.[0]),
    selfieUrl: buildFileUrl(files?.selfie?.[0]),
    bankCountry: bankCountry || undefined,
    bankDetails: bankName ? JSON.stringify({ bankName, accountNumber, routing }) : undefined,
    verificationStatus: 'PENDING' as const,
  };
}

async function ensureWalletExists(userId: string) {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) await prisma.wallet.create({ data: { userId } });
}

const CREATOR_SELECT = {
  id: true,
  username: true,
  displayName: true,
  email: true,
  avatar: true,
  role: true,
  isVerified: true,
};

// POST /api/auth/become-creator
router.post(
  '/become-creator',
  authenticate,
  upload.fields([
    { name: 'idDocument', maxCount: 1 },
    { name: 'selfie', maxCount: 1 },
  ]),
  async (req, res, next) => {
    try {
      const userId = req.user!.userId;
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new AppError(404, 'User not found');
      if (user.role === 'CREATOR') throw new AppError(400, 'Already a creator');

      const files = req.files as Record<string, Express.Multer.File[]>;
      const data = buildCreatorUpdateData(files, req.body);

      const updated = await prisma.user.update({
        where: { id: userId },
        data,
        select: CREATOR_SELECT,
      });

      await ensureWalletExists(userId);
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  },
);

// Serve verification files
router.get('/verification-file/:filename', authenticate, (req, res, next) => {
  try {
    const sanitized = path.basename(req.params.filename as string);
    const filePath = path.join(uploadsDir, sanitized);
    if (!fs.existsSync(filePath)) throw new AppError(404, 'File not found');
    res.sendFile(filePath);
  } catch (err) {
    next(err);
  }
});

export default router;
