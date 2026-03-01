import { Router, Request } from 'express';
import { prisma } from '../config/database.js';

const router = Router();

const CREATOR_SELECT = {
  id: true,
  username: true,
  displayName: true,
  avatar: true,
  isVerified: true,
  _count: { select: { followers: true } },
};

function mapCreators(creators: { _count: { followers: number } }[]) {
  return creators.map((c) => ({
    ...c,
    followersCount: (c._count as { followers: number }).followers,
    _count: undefined,
  }));
}

async function getPopularCreators(limit: number, excludeIds: string[] = []) {
  const where: Record<string, unknown> = { role: 'CREATOR', status: 'ACTIVE' };
  if (excludeIds.length) where.id = { notIn: excludeIds };
  const creators = await prisma.user.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: CREATOR_SELECT,
  });
  return mapCreators(creators);
}

async function getBlockedIds(userId: string) {
  const blocks = await prisma.block.findMany({
    where: { OR: [{ blockerId: userId }, { blockedId: userId }] },
    select: { blockerId: true, blockedId: true },
  });
  const ids = new Set<string>();
  for (const b of blocks) {
    if (b.blockerId !== userId) ids.add(b.blockerId);
    if (b.blockedId !== userId) ids.add(b.blockedId);
  }
  return ids;
}

async function extractUserId(req: Request): Promise<string | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return null;
  try {
    const jwt = (await import('jsonwebtoken')).default;
    const { env } = await import('../config/env.js');
    const payload = jwt.verify(authHeader.slice(7), env.JWT_SECRET) as { userId: string };
    return payload.userId;
  } catch {
    return null;
  }
}

function countFollowsOfFollows(
  fofFollows: { followingId: string }[],
  userId: string,
  myFollowIds: Set<string>,
  blockedIds: Set<string>,
) {
  const counts = new Map<string, number>();
  for (const f of fofFollows) {
    const id = f.followingId;
    if (id === userId || myFollowIds.has(id) || blockedIds.has(id)) continue;
    counts.set(id, (counts.get(id) || 0) + 1);
  }
  return counts;
}

async function getSuggestionsForUser(userId: string, limit: number) {
  const myFollows = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  const myFollowIds = new Set(myFollows.map((f) => f.followingId));
  const blockedIds = await getBlockedIds(userId);

  const fofFollows = await prisma.follow.findMany({
    where: { followerId: { in: Array.from(myFollowIds) } },
    select: { followingId: true },
  });
  const counts = countFollowsOfFollows(fofFollows, userId, myFollowIds, blockedIds);

  const sortedIds = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id);
  if (sortedIds.length === 0) {
    return getPopularCreators(limit, [...myFollowIds, ...blockedIds, userId]);
  }

  const creators = await prisma.user.findMany({
    where: { id: { in: sortedIds }, role: 'CREATOR', status: 'ACTIVE' },
    select: CREATOR_SELECT,
  });
  const idOrder = new Map(sortedIds.map((id, i) => [id, i]));
  creators.sort((a, b) => (idOrder.get(a.id) ?? 0) - (idOrder.get(b.id) ?? 0));
  return mapCreators(creators);
}

router.get('/', async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 20);
    const userId = await extractUserId(req);

    if (!userId) {
      return res.json({ success: true, data: await getPopularCreators(limit) });
    }

    const data = await getSuggestionsForUser(userId, limit);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

export default router;
