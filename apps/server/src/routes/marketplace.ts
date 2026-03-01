import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { AppError } from '../middleware/errorHandler.js';
import bidsRouter from './marketplace-bids.js';

const router = Router();
const marketDir = path.join(process.cwd(), 'uploads', 'marketplace');
if (!fs.existsSync(marketDir)) fs.mkdirSync(marketDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, marketDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${req.user!.userId}-${Date.now()}-${Math.random().toString(36).slice(2, 5)}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const SELLER_SELECT = {
  id: true,
  username: true,
  displayName: true,
  avatar: true,
  isVerified: true,
};

// Serve files
router.get('/file/:filename', (req, res, next) => {
  try {
    const filePath = path.join(marketDir, path.basename(req.params.filename as string));
    if (!fs.existsSync(filePath)) throw new AppError(404, 'File not found');
    res.sendFile(filePath);
  } catch (err) {
    next(err);
  }
});

function buildListingWhere(query: Record<string, unknown>) {
  const where: Record<string, unknown> = { status: 'ACTIVE' };
  if (query.category) where.category = query.category;
  if (query.type) where.type = query.type;
  const q = ((query.q as string) || '').trim();
  if (q) where.title = { contains: q, mode: 'insensitive' };
  return where;
}

function buildListingOrderBy(sort: string) {
  if (sort === 'price_low') return { price: 'asc' as const };
  if (sort === 'price_high') return { price: 'desc' as const };
  if (sort === 'ending') return { endsAt: 'asc' as const };
  return { createdAt: 'desc' as const };
}

// GET /api/marketplace — Browse listings
router.get('/', authenticate, async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 12));
    const skip = (page - 1) * limit;
    const sort = (req.query.sort as string) || 'newest';

    const where = buildListingWhere(req.query);
    const orderBy = buildListingOrderBy(sort);

    const [items, total] = await Promise.all([
      prisma.marketplaceListing.findMany({
        where,
        include: { seller: { select: SELLER_SELECT }, _count: { select: { bids: true } } },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.marketplaceListing.count({ where }),
    ]);

    res.json({ success: true, data: { items, total, page, limit } });
  } catch (err) {
    next(err);
  }
});

// GET /api/marketplace/:id — Single listing
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const listing = await prisma.marketplaceListing.findUnique({
      where: { id: req.params.id as string },
      include: {
        seller: { select: SELLER_SELECT },
        bids: {
          include: { bidder: { select: SELLER_SELECT } },
          orderBy: { amount: 'desc' },
          take: 20,
        },
      },
    });
    if (!listing) throw new AppError(404, 'Listing not found');
    res.json({ success: true, data: listing });
  } catch (err) {
    next(err);
  }
});

function buildListingData(
  userId: string,
  body: Record<string, string>,
  files: Express.Multer.File[],
) {
  const listingType = body.type === 'AUCTION' ? 'AUCTION' : 'FIXED_PRICE';
  const listingPrice =
    listingType === 'AUCTION' ? parseFloat(body.startingBid || '0') : parseFloat(body.price || '0');

  const data: Record<string, unknown> = {
    sellerId: userId,
    title: body.title.trim(),
    description: body.description?.trim() || '',
    category: body.category || 'DIGITAL_CONTENT',
    type: listingType,
    price: listingPrice,
    images: files.map((f) => `/api/marketplace/file/${f.filename}`),
    status: 'ACTIVE',
  };

  if (listingType === 'AUCTION' && body.duration) {
    data.endsAt = new Date(Date.now() + parseInt(body.duration) * 3600000);
  }
  return data;
}

// POST /api/marketplace — Create listing (CREATOR only)
router.post(
  '/',
  authenticate,
  requireRole('CREATOR'),
  upload.array('images', 10),
  async (req, res, next) => {
    try {
      const userId = req.user!.userId;
      if (!req.body.title?.trim()) throw new AppError(400, 'Title is required');

      const files = (req.files as Express.Multer.File[]) || [];
      const data = buildListingData(userId, req.body, files);

      const listing = await prisma.marketplaceListing.create({
        data: data as Parameters<typeof prisma.marketplaceListing.create>[0]['data'],
        include: { seller: { select: SELLER_SELECT } },
      });

      res.status(201).json({ success: true, data: listing });
    } catch (err) {
      next(err);
    }
  },
);

// Mount bid sub-router
router.use('/', bidsRouter);

// POST /api/marketplace/:id/buy — Buy now
router.post('/:id/buy', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const listingId = req.params.id as string;

    const listing = await prisma.marketplaceListing.findUnique({ where: { id: listingId } });
    if (!listing) throw new AppError(404, 'Listing not found');
    if (listing.type !== 'FIXED_PRICE') throw new AppError(400, 'Not a fixed price listing');
    if (listing.status !== 'ACTIVE') throw new AppError(400, 'Listing not active');
    if (listing.sellerId === userId) throw new AppError(400, 'Cannot buy your own listing');

    const price = listing.price!;
    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet || wallet.balance < price) throw new AppError(400, 'Insufficient balance');

    const sellerWallet = await prisma.wallet.findUnique({ where: { userId: listing.sellerId } });
    if (!sellerWallet) throw new AppError(500, 'Seller wallet not found');

    await prisma.$transaction([
      prisma.wallet.update({ where: { id: wallet.id }, data: { balance: { decrement: price } } }),
      prisma.wallet.update({
        where: { id: sellerWallet.id },
        data: { balance: { increment: price }, totalEarned: { increment: price } },
      }),
      prisma.transaction.create({
        data: {
          walletId: wallet.id,
          type: 'MARKETPLACE_PURCHASE',
          amount: price,
          description: `Purchase: ${listing.title}`,
        },
      }),
      prisma.transaction.create({
        data: {
          walletId: sellerWallet.id,
          type: 'MARKETPLACE_EARNING',
          amount: price,
          description: `Sale: ${listing.title}`,
        },
      }),
      prisma.marketplaceListing.update({ where: { id: listingId }, data: { status: 'SOLD' } }),
    ]);

    res.json({ success: true, message: 'Purchase complete!' });
  } catch (err) {
    next(err);
  }
});

export default router;
