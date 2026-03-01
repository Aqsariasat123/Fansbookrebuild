// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';

vi.mock('../lib/api', () => ({
  api: {
    post: vi.fn().mockResolvedValue({ data: { success: true } }),
    get: vi.fn().mockResolvedValue({ data: { data: {} } }),
  },
}));

import CreatePost from '../pages/CreatePost';

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

describe('CreatePost page', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: {
        id: 'u1',
        username: 'testcreator',
        displayName: 'Test Creator',
        role: 'CREATOR',
        avatar: null,
      } as never,
      isAuthenticated: true,
      isLoading: false,
    });
    vi.clearAllMocks();
  });

  it('should render Create Post heading', () => {
    renderWithProviders(<CreatePost />);
    expect(screen.getByText('Create Post')).toBeInTheDocument();
  });

  it('should render Post button', () => {
    renderWithProviders(<CreatePost />);
    expect(screen.getByText('Post')).toBeInTheDocument();
  });

  it('should render textarea placeholder', () => {
    renderWithProviders(<CreatePost />);
    expect(screen.getByPlaceholderText('Say Something about this photo...')).toBeInTheDocument();
  });

  it('should disable Post button when no content', () => {
    renderWithProviders(<CreatePost />);
    const postBtn = screen.getByText('Post');
    expect(postBtn).toBeDisabled();
  });

  it('should enable Post button when text is entered', () => {
    renderWithProviders(<CreatePost />);
    const textarea = screen.getByPlaceholderText('Say Something about this photo...');
    fireEvent.change(textarea, { target: { value: 'Hello world!' } });
    const postBtn = screen.getByText('Post');
    expect(postBtn).not.toBeDisabled();
  });

  it('should render pin checkbox', () => {
    renderWithProviders(<CreatePost />);
    expect(screen.getByText('Pin to top')).toBeInTheDocument();
  });

  it('should show upload area when no images', () => {
    renderWithProviders(<CreatePost />);
    expect(screen.getByText('Click to add photos or videos')).toBeInTheDocument();
  });
});
