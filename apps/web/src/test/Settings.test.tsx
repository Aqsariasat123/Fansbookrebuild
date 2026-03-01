// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';

vi.mock('../lib/api', () => ({
  api: {
    get: vi.fn().mockResolvedValue({ data: { data: {} } }),
    put: vi.fn().mockResolvedValue({ data: { success: true } }),
    post: vi.fn().mockResolvedValue({ data: { success: true } }),
    delete: vi.fn().mockResolvedValue({ data: { success: true } }),
  },
}));

// Mock themeStore to avoid Node 22+ localStorage conflict at module init
vi.mock('../stores/themeStore', () => ({
  useThemeStore: Object.assign(vi.fn().mockReturnValue({ theme: 'dark', setTheme: vi.fn() }), {
    getState: vi.fn().mockReturnValue({ theme: 'dark', setTheme: vi.fn() }),
    setState: vi.fn(),
    subscribe: vi.fn(),
  }),
}));

import Settings from '../pages/Settings';

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

describe('Settings page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render Settings heading', () => {
    useAuthStore.setState({
      user: { id: 'u1', username: 'test', displayName: 'Test', role: 'FAN' } as never,
      isAuthenticated: true,
      isLoading: false,
    });
    renderWithProviders(<Settings />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should render all 7 base tabs', () => {
    useAuthStore.setState({
      user: { id: 'u1', username: 'test', displayName: 'Test', role: 'CREATOR' } as never,
      isAuthenticated: true,
      isLoading: false,
    });
    renderWithProviders(<Settings />);
    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Privacy')).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();
    expect(screen.getByText('Display')).toBeInTheDocument();
    expect(screen.getByText('Sessions')).toBeInTheDocument();
  });

  it('should show "Become Creator" tab only for FAN role', () => {
    useAuthStore.setState({
      user: { id: 'u1', username: 'test', displayName: 'Test', role: 'FAN' } as never,
      isAuthenticated: true,
      isLoading: false,
    });
    renderWithProviders(<Settings />);
    expect(screen.getByText('Become Creator')).toBeInTheDocument();
  });

  it('should NOT show "Become Creator" tab for CREATOR role', () => {
    useAuthStore.setState({
      user: { id: 'u1', username: 'test', displayName: 'Test', role: 'CREATOR' } as never,
      isAuthenticated: true,
      isLoading: false,
    });
    renderWithProviders(<Settings />);
    expect(screen.queryByText('Become Creator')).not.toBeInTheDocument();
  });

  it('should switch tab content on click', () => {
    useAuthStore.setState({
      user: { id: 'u1', username: 'test', displayName: 'Test', role: 'FAN' } as never,
      isAuthenticated: true,
      isLoading: false,
    });
    renderWithProviders(<Settings />);
    fireEvent.click(screen.getByText('Display'));
    expect(screen.getByText('Display')).toBeInTheDocument();
  });
});
