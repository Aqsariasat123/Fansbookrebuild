interface TrendingHashtag {
  tag: string;
  count: number;
}

interface Props {
  hashtags: TrendingHashtag[];
  loading: boolean;
  searchFilter: string;
}

export function HashtagsList({ hashtags, loading, searchFilter }: Props) {
  if (loading) {
    return (
      <div className="space-y-[12px]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-[48px] animate-pulse rounded-[12px] bg-card" />
        ))}
      </div>
    );
  }

  const filtered = hashtags.filter(
    (h) => !searchFilter || h.tag.toLowerCase().includes(searchFilter.toLowerCase()),
  );

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center py-[60px]">
        <p className="text-[16px] text-muted-foreground">No hashtags found</p>
      </div>
    );
  }

  return (
    <div className="space-y-[8px]">
      {filtered.map((h, i) => (
        <div
          key={h.tag}
          className="flex items-center justify-between rounded-[12px] bg-card px-[20px] py-[14px]"
        >
          <div className="flex items-center gap-[16px]">
            <span className="text-[14px] font-medium text-muted-foreground">{i + 1}</span>
            <div>
              <p className="text-[15px] font-medium text-foreground">#{h.tag}</p>
              {h.count > 0 && (
                <p className="text-[12px] text-muted-foreground">
                  {h.count} {h.count === 1 ? 'post' : 'posts'}
                </p>
              )}
            </div>
          </div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-muted-foreground"
          >
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
          </svg>
        </div>
      ))}
    </div>
  );
}
