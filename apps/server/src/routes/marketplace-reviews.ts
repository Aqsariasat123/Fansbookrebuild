import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

const BUYER_SELECT = {
  id: true,
  username: true,
  displayName: true,
  avatar: true,
};

// GET /api/marketplace-reviews/:listingId — reviews for a listing
router.get('/:listingId', async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const reviews = await prisma.marketplaceReview.findMany({
      where: { listingId: listingId as string },
      include: { buyer: { select: BUYER_SELECT } },
      orderBy: { createdAt: 'desc' },
    });

    const total = reviews.length;
    const avgRating =
      total > 0 ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / total) * 10) / 10 : 0;

    res.json({ success: true, data: { reviews, avgRating, totalReviews: total } });
  } catch (err) {
    next(err);
  }
});

async function validateReviewRequest(userId: string, listingId: string) {
  if (!listingId) throw new AppError(400, 'listingId is required');
  const listing = await prisma.marketplaceListing.findUnique({
    where: { id: listingId },
  });
  if (!listing) throw new AppError(404, 'Listing not found');
  if (listing.sellerId === userId) throw new AppError(400, 'Cannot review your own listing');
  if (listing.status !== 'SOLD') throw new AppError(400, 'Listing has not been sold yet');
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) throw new AppError(400, 'You did not purchase this listing');
  const purchase = await prisma.transaction.findFirst({
    where: {
      walletId: wallet.id,
      type: 'MARKETPLACE_PURCHASE',
      description: { contains: listing.title },
    },
  });
  if (!purchase) throw new AppError(400, 'You did not purchase this listing');
  return listing;
}

// POST /api/marketplace-reviews — create a review (authenticated)
router.post('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { listingId, rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5)
      throw new AppError(400, 'Rating must be between 1 and 5');
    const listing = await validateReviewRequest(userId, listingId);

    const review = await prisma.marketplaceReview.create({
      data: {
        buyerId: userId,
        sellerId: listing.sellerId,
        listingId: listingId as string,
        rating: Math.round(rating),
        comment: comment?.trim() || null,
      },
      include: { buyer: { select: BUYER_SELECT } },
    });
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    if ((err as { code?: string }).code === 'P2002') {
      return next(new AppError(400, 'You have already reviewed this listing'));
    }
    next(err);
  }
});

// DELETE /api/marketplace-reviews/:id — delete own review
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const review = await prisma.marketplaceReview.findUnique({
      where: { id: req.params.id as string },
    });
    if (!review) throw new AppError(404, 'Review not found');
    if (review.buyerId !== userId) throw new AppError(403, 'Not your review');

    await prisma.marketplaceReview.delete({ where: { id: review.id } });
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
