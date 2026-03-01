// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const mockApiPost = vi.fn().mockResolvedValue({ data: { success: true } });
const mockApiDelete = vi.fn().mockResolvedValue({ data: { success: true } });

// Mock relative to the component path (../../lib/api from components/shared/)
// vitest resolves relative to test file: ../lib/api from test/
vi.mock('../lib/api', () => ({
  api: {
    post: (...args: unknown[]) => mockApiPost(...args),
    delete: (...args: unknown[]) => mockApiDelete(...args),
  },
}));

import FollowButton from '../components/shared/FollowButton';

function renderButton(props: Partial<Parameters<typeof FollowButton>[0]> = {}) {
  return render(
    <MemoryRouter>
      <FollowButton userId="u2" {...props} />
    </MemoryRouter>,
  );
}

describe('FollowButton component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render "Follow" when not following', () => {
    renderButton({ initialFollowing: false });
    expect(screen.getByText('Follow')).toBeInTheDocument();
  });

  it('should render "Following" when already following', () => {
    renderButton({ initialFollowing: true });
    expect(screen.getByText('Following')).toBeInTheDocument();
  });

  it('should optimistically toggle to "Following" on click', () => {
    renderButton({ initialFollowing: false });
    fireEvent.click(screen.getByText('Follow'));
    expect(screen.getByText('Following')).toBeInTheDocument();
  });

  it('should optimistically toggle to "Follow" on unfollow', () => {
    renderButton({ initialFollowing: true });
    fireEvent.click(screen.getByText('Following'));
    expect(screen.getByText('Follow')).toBeInTheDocument();
  });

  it('should call follow API on click', async () => {
    renderButton({ initialFollowing: false });
    fireEvent.click(screen.getByText('Follow'));
    await waitFor(() => {
      expect(mockApiPost).toHaveBeenCalledWith('/followers/u2');
    });
  });

  it('should call unfollow API on unfollow click', async () => {
    renderButton({ initialFollowing: true });
    fireEvent.click(screen.getByText('Following'));
    await waitFor(() => {
      expect(mockApiDelete).toHaveBeenCalledWith('/followers/u2');
    });
  });

  it('should revert on API error', async () => {
    mockApiPost.mockRejectedValueOnce(new Error('Network error'));
    renderButton({ initialFollowing: false });
    fireEvent.click(screen.getByText('Follow'));
    // Should optimistically show "Following"
    expect(screen.getByText('Following')).toBeInTheDocument();
    // After error, should revert
    await waitFor(() => {
      expect(screen.getByText('Follow')).toBeInTheDocument();
    });
  });

  it('should call onToggle callback', async () => {
    const onToggle = vi.fn();
    renderButton({ initialFollowing: false, onToggle });
    fireEvent.click(screen.getByText('Follow'));
    await waitFor(() => {
      expect(onToggle).toHaveBeenCalledWith(true);
    });
  });

  it('should render small size variant', () => {
    renderButton({ size: 'sm' });
    const btn = screen.getByText('Follow');
    expect(btn.className).toContain('px-[14px]');
  });
});
