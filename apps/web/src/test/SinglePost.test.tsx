// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockGet = vi.fn();
vi.mock('../lib/api', () => ({
  api: {
    get: (...args: unknown[]) => mockGet(...args),
    post: vi.fn().mockResolvedValue({ data: { success: true, data: {} } }),
    delete: vi.fn().mockResolvedValue({ data: { success: true } }),
  },
}));

import SinglePost from '../pages/SinglePost';

function renderWithRoute(postId: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/post/${postId}`]}>
        <Routes>
          <Route path="/post/:id" element={<SinglePost />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

function setupPostMock(postData: Record<string, unknown>) {
  mockGet.mockImplementation((url: string) => {
    // Single post endpoint
    if (url.match(/\/posts\/[^/]+$/) && !url.includes('comments'))
      return Promise.resolve({
        data: {
          data: {
            comments: [],
            ...postData,
          },
        },
      });
    // Comments endpoint
    if (url.includes('/comments'))
      return Promise.resolve({ data: { data: [], nextCursor: null, hasMore: false } });
    // Creator profile posts (related posts)
    if (url.includes('/creator-profile')) return Promise.resolve({ data: { data: [] } });
    return Promise.resolve({ data: { data: [] } });
  });
}

describe('SinglePost page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading spinner initially', () => {
    mockGet.mockReturnValue(new Promise(() => {})); // Never resolves
    renderWithRoute('p1');
    expect(document.querySelector('.animate-spin')).toBeTruthy();
  });

  it('should render post content after loading', async () => {
    setupPostMock({
      id: 'p1',
      text: 'Test post content',
      likeCount: 5,
      commentCount: 2,
      createdAt: new Date().toISOString(),
      author: { id: 'u1', username: 'testuser', displayName: 'Test User', avatar: null },
      media: [],
      isLiked: false,
      isBookmarked: false,
    });

    renderWithRoute('p1');
    await waitFor(() => {
      expect(screen.getByText('Test post content')).toBeInTheDocument();
    });
  });

  it('should show error when post not found', async () => {
    mockGet.mockRejectedValue(new Error('Not found'));

    renderWithRoute('nonexistent');
    await waitFor(() => {
      expect(screen.getByText('Post not found')).toBeInTheDocument();
    });
  });

  it('should render Back to Feed link on error', async () => {
    mockGet.mockRejectedValue(new Error('Not found'));

    renderWithRoute('p1');
    await waitFor(() => {
      expect(screen.getByText('Back to Feed')).toBeInTheDocument();
    });
  });
});
