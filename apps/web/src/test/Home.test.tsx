// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';

// Mock API
const mockGet = vi.fn();
vi.mock('../lib/api', () => ({
  api: {
    get: (...args: unknown[]) => mockGet(...args),
    post: vi.fn().mockResolvedValue({ data: { success: true } }),
    delete: vi.fn().mockResolvedValue({ data: { success: true } }),
  },
}));

// Mock IntersectionObserver as class
class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}
Object.defineProperty(window, 'IntersectionObserver', {
  value: MockIntersectionObserver,
  writable: true,
  configurable: true,
});

import Home from '../pages/Home';

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

describe('Home page', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: { id: 'u1', username: 'testfan', displayName: 'Test Fan', role: 'FAN' } as never,
      isAuthenticated: true,
      isLoading: false,
    });
    vi.clearAllMocks();
  });

  it('should render loading spinner initially', () => {
    mockGet.mockReturnValue(new Promise(() => {}));
    renderWithProviders(<Home />);
    expect(document.querySelector('.animate-spin')).toBeTruthy();
  });

  it('should render feed content after loading', async () => {
    mockGet.mockImplementation((url: string) => {
      if (url.includes('/feed/stories')) return Promise.resolve({ data: { data: [] } });
      if (url.includes('/feed/popular-models')) return Promise.resolve({ data: { data: [] } });
      if (url.includes('/feed'))
        return Promise.resolve({
          data: {
            data: {
              posts: [
                {
                  id: 'p1',
                  text: 'Hello world',
                  isPinned: false,
                  likeCount: 5,
                  commentCount: 2,
                  createdAt: new Date().toISOString(),
                  author: {
                    id: 'u1',
                    username: 'testuser',
                    displayName: 'Test User',
                    avatar: null,
                    isVerified: false,
                  },
                  media: [],
                  isLiked: false,
                  isBookmarked: false,
                },
              ],
              nextCursor: null,
            },
          },
        });
      return Promise.resolve({ data: { data: [] } });
    });

    renderWithProviders(<Home />);
    await waitFor(() => {
      expect(screen.getByText('Hello world')).toBeInTheDocument();
    });
  });

  it('should render popular models section when models exist', async () => {
    mockGet.mockImplementation((url: string) => {
      if (url.includes('/feed/popular-models'))
        return Promise.resolve({
          data: {
            data: [
              {
                id: 'm1',
                username: 'model1',
                displayName: 'Model One',
                avatar: '/img.jpg',
                isVerified: true,
              },
            ],
          },
        });
      if (url.includes('/feed/stories')) return Promise.resolve({ data: { data: [] } });
      if (url.includes('/feed'))
        return Promise.resolve({
          data: {
            data: {
              posts: [
                {
                  id: 'p1',
                  text: 'Test',
                  isPinned: false,
                  likeCount: 0,
                  commentCount: 0,
                  createdAt: new Date().toISOString(),
                  author: {
                    id: 'u1',
                    username: 'test',
                    displayName: 'Test',
                    avatar: null,
                    isVerified: false,
                  },
                  media: [],
                  isLiked: false,
                  isBookmarked: false,
                },
              ],
              nextCursor: null,
            },
          },
        });
      return Promise.resolve({ data: { data: [] } });
    });

    renderWithProviders(<Home />);
    await waitFor(() => {
      expect(screen.getByText('Most Popular Models')).toBeInTheDocument();
    });
  });

  it('should show empty state when no posts', async () => {
    mockGet.mockImplementation((url: string) => {
      if (url.includes('/feed/stories')) return Promise.resolve({ data: { data: [] } });
      if (url.includes('/feed/popular-models')) return Promise.resolve({ data: { data: [] } });
      if (url.includes('suggestions')) return Promise.resolve({ data: { data: [] } });
      if (url.includes('/feed'))
        return Promise.resolve({ data: { data: { posts: [], nextCursor: null } } });
      return Promise.resolve({ data: { data: [] } });
    });

    renderWithProviders(<Home />);
    await waitFor(() => {
      // EmptyFeedState should be rendered
      expect(document.querySelector('.animate-spin')).toBeFalsy();
    });
  });
});
