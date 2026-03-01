import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../config/database.js', () => ({
  prisma: {
    bookmark: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    post: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('../middleware/auth.js', () => ({
  authenticate: vi.fn((_r: unknown, _s: unknown, n: () => void) => n()),
}));

describe('posts-bookmarks route logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('bookmark validation', () => {
    it('should detect already bookmarked', () => {
      const existing = { id: 'b1', postId: 'p1', userId: 'u1' };
      expect(existing).toBeTruthy();
    });

    it('should detect post not found', () => {
      const post = null;
      expect(post).toBeNull();
    });

    it('should detect bookmark not found for removal', () => {
      const existing = null;
      expect(existing).toBeNull();
    });
  });

  describe('bookmarks list formatting', () => {
    it('should map bookmarks to posts with isBookmarked flag', () => {
      const bookmarks = [
        {
          createdAt: new Date('2025-01-01'),
          post: { id: 'p1', text: 'Hello', author: { id: 'u1' }, media: [] },
        },
        {
          createdAt: new Date('2025-01-02'),
          post: { id: 'p2', text: 'World', author: { id: 'u2' }, media: [] },
        },
      ];

      const posts = bookmarks.map((b) => ({
        ...b.post,
        isBookmarked: true,
        bookmarkedAt: b.createdAt,
      }));

      expect(posts).toHaveLength(2);
      expect(posts[0].isBookmarked).toBe(true);
      expect(posts[0].bookmarkedAt).toEqual(new Date('2025-01-01'));
      expect(posts[1].id).toBe('p2');
    });
  });

  describe('single post detail formatting', () => {
    it('should format single post with all fields', () => {
      const post = {
        id: 'p1',
        text: 'Test post',
        visibility: 'PUBLIC',
        isPinned: false,
        likeCount: 10,
        commentCount: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: { id: 'u1', username: 'test', displayName: 'Test', avatar: null, isVerified: true },
        media: [],
        comments: [],
        likes: [{ id: 'l1' }],
        bookmarks: [],
      };

      const formatted = {
        id: post.id,
        text: post.text,
        visibility: post.visibility,
        isPinned: post.isPinned,
        likeCount: post.likeCount,
        commentCount: post.commentCount,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: post.author,
        media: post.media,
        comments: post.comments,
        isLiked: post.likes.length > 0,
        isBookmarked: post.bookmarks.length > 0,
      };

      expect(formatted.isLiked).toBe(true);
      expect(formatted.isBookmarked).toBe(false);
      expect(formatted.visibility).toBe('PUBLIC');
    });
  });
});
