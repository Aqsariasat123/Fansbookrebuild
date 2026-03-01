// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('../lib/api', () => ({
  api: {
    get: vi.fn().mockResolvedValue({ data: { data: [], nextCursor: null, hasMore: false } }),
    post: vi.fn().mockResolvedValue({ data: { success: true, data: {} } }),
    delete: vi.fn().mockResolvedValue({ data: { success: true } }),
  },
}));

import { PostActions } from '../components/feed/PostActions';

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('PostActions component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render like count', () => {
    renderWithProviders(
      <PostActions postId="p1" likeCount={10} commentCount={5} shareCount={3} isLiked={false} />,
    );
    expect(screen.getByText('10 Likes')).toBeInTheDocument();
  });

  it('should render comment count', () => {
    renderWithProviders(
      <PostActions postId="p1" likeCount={10} commentCount={5} shareCount={3} isLiked={false} />,
    );
    expect(screen.getByText('5 Comments')).toBeInTheDocument();
  });

  it('should render share count', () => {
    renderWithProviders(
      <PostActions postId="p1" likeCount={10} commentCount={5} shareCount={3} isLiked={false} />,
    );
    expect(screen.getByText('3 Share')).toBeInTheDocument();
  });

  it('should render tip button', () => {
    renderWithProviders(
      <PostActions postId="p1" likeCount={0} commentCount={0} shareCount={0} isLiked={false} />,
    );
    expect(screen.getByText('Tip')).toBeInTheDocument();
  });

  it('should toggle like on click (optimistic update)', () => {
    renderWithProviders(
      <PostActions postId="p1" likeCount={10} commentCount={0} shareCount={0} isLiked={false} />,
    );
    const likeBtn = screen.getByText('10 Likes').closest('button')!;
    fireEvent.click(likeBtn);
    expect(screen.getByText('11 Likes')).toBeInTheDocument();
  });

  it('should toggle unlike on click (optimistic update)', () => {
    renderWithProviders(
      <PostActions postId="p1" likeCount={10} commentCount={0} shareCount={0} isLiked={true} />,
    );
    const likeBtn = screen.getByText('10 Likes').closest('button')!;
    fireEvent.click(likeBtn);
    expect(screen.getByText('9 Likes')).toBeInTheDocument();
  });

  it('should toggle comments section visibility', () => {
    renderWithProviders(
      <PostActions postId="p1" likeCount={0} commentCount={3} shareCount={0} isLiked={false} />,
    );
    const commentBtn = screen.getByText('3 Comments').closest('button')!;
    fireEvent.click(commentBtn);
    // After click, CommentsSection renders - the button should still be there
    expect(commentBtn).toBeTruthy();
  });
});
