// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';

const mockGet = vi.fn();
const mockPost = vi.fn();
vi.mock('../lib/api', () => ({
  api: {
    get: (...args: unknown[]) => mockGet(...args),
    post: (...args: unknown[]) => mockPost(...args),
  },
}));

import Messages from '../pages/Messages';

function renderWithProviders(ui: React.ReactElement, initialEntries = ['/messages']) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('Messages page', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: {
        id: 'u1',
        username: 'testfan',
        displayName: 'Test Fan',
        role: 'FAN',
        avatar: null,
      } as never,
      isAuthenticated: true,
      isLoading: false,
    });
    vi.clearAllMocks();
  });

  it('should show loading spinner initially', () => {
    mockGet.mockReturnValue(new Promise(() => {}));
    renderWithProviders(<Messages />);
    expect(document.querySelector('.animate-spin')).toBeTruthy();
  });

  it('should render empty state when no conversations', async () => {
    mockGet.mockResolvedValue({ data: { success: true, data: [] } });
    renderWithProviders(<Messages />);
    await waitFor(() => {
      expect(screen.getByText('No conversations yet')).toBeInTheDocument();
    });
  });

  it('should render conversations list', async () => {
    mockGet.mockResolvedValue({
      data: {
        success: true,
        data: [
          {
            id: 'c1',
            other: { id: 'u2', username: 'jimmy', displayName: 'Jimmy Fox', avatar: null },
            lastMessage: 'Hey there!',
            lastMessageAt: new Date().toISOString(),
            unreadCount: 2,
          },
        ],
      },
    });
    renderWithProviders(<Messages />);
    await waitFor(() => {
      expect(screen.getByText('Jimmy Fox')).toBeInTheDocument();
      expect(screen.getByText('Hey there!')).toBeInTheDocument();
    });
  });

  it('should render search input', async () => {
    mockGet.mockResolvedValue({ data: { success: true, data: [] } });
    renderWithProviders(<Messages />);
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });
  });

  it('should filter conversations by search', async () => {
    mockGet.mockResolvedValue({
      data: {
        success: true,
        data: [
          {
            id: 'c1',
            other: { id: 'u2', username: 'jimmy', displayName: 'Jimmy Fox', avatar: null },
            lastMessage: 'Hello',
            lastMessageAt: new Date().toISOString(),
            unreadCount: 0,
          },
          {
            id: 'c2',
            other: { id: 'u3', username: 'sarah', displayName: 'Sarah Jones', avatar: null },
            lastMessage: 'Hi',
            lastMessageAt: new Date().toISOString(),
            unreadCount: 0,
          },
        ],
      },
    });
    renderWithProviders(<Messages />);
    await waitFor(() => {
      expect(screen.getByText('Jimmy Fox')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'Sarah' } });
    expect(screen.queryByText('Jimmy Fox')).not.toBeInTheDocument();
    expect(screen.getByText('Sarah Jones')).toBeInTheDocument();
  });

  it('should show "Find and invite people" bar', async () => {
    mockGet.mockResolvedValue({ data: { success: true, data: [] } });
    renderWithProviders(<Messages />);
    await waitFor(() => {
      expect(screen.getByText('Find and invite people')).toBeInTheDocument();
    });
  });
});
