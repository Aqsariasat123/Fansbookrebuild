import { Router } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import {
  AUTHOR_SELECT,
  tryExtractViewer,
  checkIsSubscriber,
  buildPostsWhere,
} from './creator-profile-helpers.js';

const router = Router();

// ─── GET /api/creator-profile/:username/posts ── paginated posts
router.get('/:username/posts', async (req, res, next) => {
  try {
    const { username } = req.params;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const tab = (req.query.tab as string) || 'feed';
    const skip = (page - 1) * limit;

    const creator = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });
    if (!creator) throw new AppError(404, 'Creator not found');

    const viewerUserId = await tryExtractViewer(req);
    const isSubscriber = viewerUserId ? await checkIsSubscriber(viewerUserId, creator.id) : false;

    const where = buildPostsWhere({ creatorId: creator.id, isSubscriber, tab });

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
        include: {
          author: { select: AUTHOR_SELECT },
          media: {
            orderBy: { order: 'asc' },
            select: {
              id: true,
              url: true,
              type: true,
              order: true,
              thumbnail: true,
            },
          },
          ...(viewerUserId
            ? {
                likes: {
                  where: { userId: viewerUserId },
                  select: { id: true },
                  take: 1,
                },
              }
            : {}),
        },
      }),
      prisma.post.count({ where }),
    ]);

    const items = posts.map((post) => ({
      id: post.id,
      text: post.text,
      visibility: post.visibility,
      isPinned: post.isPinned,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      shareCount: 15,
      isLiked: 'likes' in post ? (post.likes as { id: string }[]).length > 0 : false,
      createdAt: post.createdAt,
      author: post.author,
      media: post.media,
    }));

    res.json({
      success: true,
      data: {
        items,
        total,
        page,
        limit,
        hasMore: skip + limit < total,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
