import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// Ensure uploads/support directory exists
const supportUploadsDir = path.join(process.cwd(), 'uploads', 'support');
if (!fs.existsSync(supportUploadsDir)) {
  fs.mkdirSync(supportUploadsDir, { recursive: true });
}

const MIME_EXT: Record<string, string> = {
  'image/jpeg': '.jpeg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, supportUploadsDir),
  filename: (req, file, cb) => {
    const ext = MIME_EXT[file.mimetype] ?? '.bin';
    cb(null, `ticket-${req.user!.userId}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError(400, 'Only JPEG, PNG, WebP and GIF images are allowed'));
    }
  },
});

// GET /faqs - public, returns all FAQs ordered by `order`
router.get('/faqs', async (_req, res, next) => {
  try {
    const faqs = await prisma.faq.findMany({
      orderBy: { order: 'asc' },
    });
    res.json({ success: true, data: faqs });
  } catch (err) {
    next(err);
  }
});

// POST /report - authenticated, submit a support ticket with optional photo
router.post('/report', authenticate, upload.single('photo'), async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      throw new AppError(400, 'Title and description are required');
    }

    let photoUrl: string | null = null;
    if (req.file) {
      const nameNoExt = path.parse(req.file.filename).name;
      photoUrl = `/api/support/photo/${nameNoExt}`;
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: req.user!.userId,
        title,
        description,
        photoUrl,
      },
    });

    res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
});

// GET /photo/:id - serve uploaded support ticket photos
router.get('/photo/:id', (req, res, next) => {
  try {
    const files = fs.readdirSync(supportUploadsDir);
    const match = files.find((f) => f.startsWith(req.params.id));
    if (!match) throw new AppError(404, 'Photo not found');
    res.sendFile(path.join(supportUploadsDir, match));
  } catch (err) {
    next(err);
  }
});

export default router;
