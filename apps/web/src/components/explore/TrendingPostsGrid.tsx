import { useRef, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useGridColumns } from '../../hooks/useGridColumns';
import { TrendingPostCell } from './TrendingPostCell';

interface TrendingPost {
  id: string;
  text: string | null;
  likeCount: number;
  commentCount: number;
  media: { id: string; url: string; type: string; thumbnail?: string | null }[];
}

interface Props {
  posts: TrendingPost[];
  loading: boolean;
}

const ROW_HEIGHT = 200;
const GAP = 12;

export function TrendingPostsGrid({ posts, loading }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cols = useGridColumns({ sm: 2, md: 3 });

  const rows = useMemo(() => {
    const result: TrendingPost[][] = [];
    for (let i = 0; i < posts.length; i += cols) {
      result.push(posts.slice(i, i + cols));
    }
    return result;
  }, [posts, cols]);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT + GAP,
    overscan: 3,
  });

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-[12px] md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-square animate-pulse rounded-[12px] bg-card" />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center py-[60px]">
        <p className="text-[16px] text-muted-foreground">No trending posts</p>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="max-h-[70vh] overflow-y-auto scrollbar-hide">
      <div className="relative w-full" style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.key}
            className="absolute left-0 top-0 w-full"
            style={{
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <div
              className="grid gap-[12px]"
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
              {rows[virtualRow.index].map((post) => (
                <TrendingPostCell key={post.id} post={post} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
