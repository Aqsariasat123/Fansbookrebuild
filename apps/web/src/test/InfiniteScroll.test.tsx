// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';

// Track observer callbacks
let observerCallback: (entries: { isIntersecting: boolean }[]) => void;
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

// Must use class syntax for `new IntersectionObserver()`
class MockIntersectionObserver {
  constructor(callback: (entries: { isIntersecting: boolean }[]) => void) {
    observerCallback = callback;
  }
  observe = mockObserve;
  disconnect = mockDisconnect;
  unobserve = vi.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  value: MockIntersectionObserver,
  writable: true,
  configurable: true,
});

import InfiniteScroll from '../components/shared/InfiniteScroll';

describe('InfiniteScroll component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children', () => {
    render(
      <InfiniteScroll onLoadMore={vi.fn()} hasMore={true} loading={false}>
        <div>Content here</div>
      </InfiniteScroll>,
    );
    expect(screen.getByText('Content here')).toBeInTheDocument();
  });

  it('should show loading spinner when loading', () => {
    render(
      <InfiniteScroll onLoadMore={vi.fn()} hasMore={true} loading={true}>
        <div>Content</div>
      </InfiniteScroll>,
    );
    expect(document.querySelector('.animate-spin')).toBeTruthy();
  });

  it('should show "No more items" when hasMore is false and not loading', () => {
    render(
      <InfiniteScroll onLoadMore={vi.fn()} hasMore={false} loading={false}>
        <div>Content</div>
      </InfiniteScroll>,
    );
    expect(screen.getByText('No more items')).toBeInTheDocument();
  });

  it('should NOT show "No more items" when still loading', () => {
    render(
      <InfiniteScroll onLoadMore={vi.fn()} hasMore={false} loading={true}>
        <div>Content</div>
      </InfiniteScroll>,
    );
    expect(screen.queryByText('No more items')).not.toBeInTheDocument();
  });

  it('should create IntersectionObserver when hasMore is true', () => {
    render(
      <InfiniteScroll onLoadMore={vi.fn()} hasMore={true} loading={false}>
        <div>Content</div>
      </InfiniteScroll>,
    );
    expect(mockObserve).toHaveBeenCalled();
  });

  it('should call onLoadMore when sentinel becomes visible', () => {
    const onLoadMore = vi.fn();
    render(
      <InfiniteScroll onLoadMore={onLoadMore} hasMore={true} loading={false}>
        <div>Content</div>
      </InfiniteScroll>,
    );
    // Simulate intersection
    observerCallback([{ isIntersecting: true }]);
    expect(onLoadMore).toHaveBeenCalled();
  });

  it('should NOT call onLoadMore when loading', () => {
    const onLoadMore = vi.fn();
    render(
      <InfiniteScroll onLoadMore={onLoadMore} hasMore={true} loading={true}>
        <div>Content</div>
      </InfiniteScroll>,
    );
    observerCallback([{ isIntersecting: true }]);
    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it('should cleanup observer on unmount', () => {
    const { unmount } = render(
      <InfiniteScroll onLoadMore={vi.fn()} hasMore={true} loading={false}>
        <div>Content</div>
      </InfiniteScroll>,
    );
    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
