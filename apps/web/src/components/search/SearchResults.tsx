import { Link } from 'react-router-dom';

interface Creator {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  isVerified: boolean;
  aboutMe?: string;
  _count?: { followers: number };
}
interface PostResult {
  id: string;
  text: string | null;
  createdAt: string;
  author: { displayName: string; username: string; avatar: string | null };
}
interface HashtagResult {
  tag: string;
  postCount: number;
}

export type { Creator, PostResult, HashtagResult };

export function RecentSearches({
  recent,
  onSelect,
  onClear,
}: {
  recent: string[];
  onSelect: (s: string) => void;
  onClear: () => void;
}) {
  if (recent.length === 0)
    return (
      <p className="py-[40px] text-center text-[14px] text-muted-foreground">
        Start typing to search
      </p>
    );
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-muted-foreground">Recent Searches</p>
        <button onClick={onClear} className="text-[12px] text-[#01adf1]">
          Clear All
        </button>
      </div>
      <div className="mt-[8px] flex flex-wrap gap-[8px]">
        {recent.map((s) => (
          <button
            key={s}
            onClick={() => onSelect(s)}
            className="rounded-[50px] bg-muted px-[12px] py-[6px] text-[13px] text-foreground hover:bg-muted/80"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CreatorResults({ items }: { items: Creator[] }) {
  return (
    <div className="flex flex-col gap-[12px]">
      {items.map((c) => (
        <Link
          key={c.id}
          to={`/u/${c.username}`}
          className="flex items-center gap-[12px] rounded-[12px] p-[8px] hover:bg-muted"
        >
          <div className="size-[48px] shrink-0 overflow-hidden rounded-full">
            {c.avatar ? (
              <img src={c.avatar} alt="" className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center bg-gradient-to-br from-[#01adf1] to-[#a61651] text-[16px] font-medium text-white">
                {c.displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-[4px]">
              <span className="text-[14px] font-medium text-foreground">{c.displayName}</span>
              {c.isVerified && (
                <img src="/icons/dashboard/verified.svg" alt="" className="size-[14px]" />
              )}
            </div>
            <p className="text-[12px] text-muted-foreground">@{c.username}</p>
          </div>
          <span className="text-[12px] text-muted-foreground">
            {c._count?.followers || 0} followers
          </span>
        </Link>
      ))}
    </div>
  );
}

export function PostResults({ items }: { items: PostResult[] }) {
  return (
    <div className="flex flex-col gap-[12px]">
      {items.map((p) => (
        <Link
          key={p.id}
          to={`/post/${p.id}`}
          className="rounded-[12px] bg-muted p-[12px] hover:bg-muted/80"
        >
          <div className="flex items-center gap-[8px]">
            <div className="size-[32px] shrink-0 overflow-hidden rounded-full">
              {p.author.avatar ? (
                <img src={p.author.avatar} alt="" className="size-full object-cover" />
              ) : (
                <div className="flex size-full items-center justify-center bg-gradient-to-br from-[#01adf1] to-[#a61651] text-[10px] text-white">
                  {p.author.displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <span className="text-[13px] font-medium text-foreground">{p.author.displayName}</span>
          </div>
          <p className="mt-[6px] line-clamp-2 text-[13px] text-foreground">{p.text}</p>
        </Link>
      ))}
    </div>
  );
}

export function HashtagResults({ items }: { items: HashtagResult[] }) {
  return (
    <div className="flex flex-col gap-[8px]">
      {items.map((h) => (
        <Link
          key={h.tag}
          to={`/hashtag/${h.tag.replace('#', '')}`}
          className="flex items-center justify-between rounded-[12px] p-[12px] hover:bg-muted"
        >
          <span className="text-[14px] font-medium text-[#01adf1]">{h.tag}</span>
          <span className="text-[12px] text-muted-foreground">{h.postCount} posts</span>
        </Link>
      ))}
    </div>
  );
}
