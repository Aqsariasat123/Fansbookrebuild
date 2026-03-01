// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the explore data hook
vi.mock('../hooks/useExploreData', () => ({
  useExploreData: vi.fn().mockReturnValue({
    creators: [],
    suggested: [],
    trendingPosts: [],
    trendingHashtags: [],
    filters: {
      categories: ['Model', 'Artist'],
      genders: [],
      countries: [],
      priceRange: { min: 0, max: 100 },
    },
    loading: false,
    loadingMore: false,
    postsLoading: false,
    hashtagsLoading: false,
    observerRef: { current: null },
  }),
}));

// Mock IntersectionObserver
vi.stubGlobal(
  'IntersectionObserver',
  vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    disconnect: vi.fn(),
    unobserve: vi.fn(),
  })),
);

import Explore from '../pages/Explore';

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

describe('Explore page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render search input', () => {
    renderWithProviders(<Explore />);
    expect(screen.getByPlaceholderText('Search creators...')).toBeInTheDocument();
  });

  it('should render tab navigation', () => {
    renderWithProviders(<Explore />);
    // "All" appears in both tabs and category chips, use getAllByText
    expect(screen.getAllByText('All').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Creators')).toBeInTheDocument();
    expect(screen.getByText('Posts')).toBeInTheDocument();
    expect(screen.getByText('Hashtags')).toBeInTheDocument();
  });

  it('should switch tabs on click', () => {
    renderWithProviders(<Explore />);
    fireEvent.click(screen.getByText('Posts'));
    // After switching to Posts tab, placeholder should change
    expect(screen.getByPlaceholderText('Search posts...')).toBeInTheDocument();
  });

  it('should show hashtags placeholder when hashtags tab active', () => {
    renderWithProviders(<Explore />);
    fireEvent.click(screen.getByText('Hashtags'));
    expect(screen.getByPlaceholderText('Search hashtags...')).toBeInTheDocument();
  });
});
