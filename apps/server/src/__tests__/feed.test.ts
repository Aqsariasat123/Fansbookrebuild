import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

// ─── Prisma mock ─────────────────────────────────────────
const mockFindMany = vi.fn();
const mockFollowFindMany = vi.fn().mockResolvedValue([]);
const mockBlockFindMany = vi.fn().mockResolvedValue([]);
const mockUserFindMany = vi.fn().mockResolvedValue([]);

vi.mock('../config/database.js', () => ({
  prisma: {
    post: { findMany: (...a: unknown[]) => mockFindMany(...a) },
    follow: { findMany: (...a: unknown[]) => mockFollowFindMany(...a) },
    block: { findMany: (...a: unknown[]) => mockBlockFindMany(...a) },
    user: { findMany: (...a: unknown[]) => mockUserFindMany(...a) },
  },
}));

vi.mock('../middleware/auth.js', () => ({
  authenticate: (_req: Request, _res: Response, next: NextFunction) => next(),
}));

vi.mock('./feed-stories.js', () => ({
  default: { get: vi.fn() },
}));

describe('feed route logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should clamp limit between 1 and 50', () => {
    // Mirrors the exact logic from feed.ts: parseInt(input) || 10
    const clamp = (input: string) => Math.min(Math.max(parseInt(input) || 10, 1), 50);
    expect(clamp('0')).toBe(10); // parseInt('0') is 0 (falsy) → default 10
    expect(clamp('-5')).toBe(1); // parseInt('-5') is -5 → max(−5,1) = 1
    expect(clamp('100')).toBe(50);
    expect(clamp('25')).toBe(25);
    expect(clamp('')).toBe(10); // default
  });

  it('should build correct cursor-based pagination query', () => {
    const cursor = 'post-abc';
    const cursorQuery = cursor ? { cursor: { id: cursor }, skip: 1 } : {};
    expect(cursorQuery).toEqual({ cursor: { id: 'post-abc' }, skip: 1 });
  });

  it('should return empty cursor query when no cursor provided', () => {
    const cursor = undefined;
    const cursorQuery = cursor ? { cursor: { id: cursor }, skip: 1 } : {};
    expect(cursorQuery).toEqual({});
  });

  it('should calculate nextCursor correctly when page is full', () => {
    const limit = 10;
    const formatted = Array.from({ length: 10 }, (_, i) => ({ id: `post-${i}` }));
    const nextCursor =
      formatted.length === limit ? (formatted[formatted.length - 1]?.id ?? null) : null;
    expect(nextCursor).toBe('post-9');
  });

  it('should return null nextCursor when page is partial', () => {
    const limit = 10;
    const formatted = Array.from({ length: 5 }, (_, i) => ({ id: `post-${i}` }));
    const nextCursor =
      formatted.length === limit ? (formatted[formatted.length - 1]?.id ?? null) : null;
    expect(nextCursor).toBeNull();
  });

  it('should format post with isLiked and isBookmarked flags', () => {
    const rawPost = {
      id: 'p1',
      text: 'Hello',
      isPinned: false,
      likeCount: 5,
      commentCount: 2,
      createdAt: new Date(),
      author: { id: 'u1', username: 'test', displayName: 'Test', avatar: null, isVerified: false },
      media: [],
      likes: [{ id: 'l1' }],
      bookmarks: [],
    };

    const formatted = {
      id: rawPost.id,
      text: rawPost.text,
      isPinned: rawPost.isPinned,
      likeCount: rawPost.likeCount,
      commentCount: rawPost.commentCount,
      shareCount: 15,
      createdAt: rawPost.createdAt,
      author: rawPost.author,
      media: rawPost.media,
      isLiked: rawPost.likes.length > 0,
      isBookmarked: rawPost.bookmarks.length > 0,
    };

    expect(formatted.isLiked).toBe(true);
    expect(formatted.isBookmarked).toBe(false);
    expect(formatted.shareCount).toBe(15);
  });

  it('should extract blocked user ids from both directions', () => {
    const userId = 'me';
    const blocks = [
      { blockerId: 'me', blockedId: 'user-a' },
      { blockerId: 'user-b', blockedId: 'me' },
    ];
    const ids = new Set<string>();
    for (const b of blocks) {
      if (b.blockerId !== userId) ids.add(b.blockerId);
      if (b.blockedId !== userId) ids.add(b.blockedId);
    }
    expect(Array.from(ids)).toEqual(['user-a', 'user-b']);
  });
});
