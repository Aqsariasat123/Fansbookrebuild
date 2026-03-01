import { useEffect, useRef } from 'react';

interface Props {
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  children: React.ReactNode;
  threshold?: number;
}

export default function InfiniteScroll({
  onLoadMore,
  hasMore,
  loading,
  children,
  threshold = 200,
}: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      { rootMargin: `${threshold}px` },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [onLoadMore, hasMore, loading, threshold]);

  return (
    <>
      {children}
      <div ref={sentinelRef} className="h-px" />
      {loading && (
        <div className="flex justify-center py-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#01adf1] border-t-transparent" />
        </div>
      )}
      {!hasMore && !loading && (
        <p className="py-4 text-center text-[13px] text-muted-foreground">No more items</p>
      )}
    </>
  );
}
