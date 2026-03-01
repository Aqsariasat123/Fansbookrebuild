import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

type TabType = 'creators' | 'posts' | 'hashtags';
const TABS: { label: string; value: TabType }[] = [
  { label: 'Creators', value: 'creators' },
  { label: 'Posts', value: 'posts' },
  { label: 'Hashtags', value: 'hashtags' },
];

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

export default function Search() {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<TabType>('creators');
  const [results, setResults] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const [recent, setRecent] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('recentSearches') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setLoading(true);
      api
        .get(`/search?q=${encodeURIComponent(query)}&type=${tab}`)
        .then(({ data: r }) => setResults(r.data.items))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
      // Save to recent
      setRecent((prev) => {
        const updated = [query, ...prev.filter((s) => s !== query)].slice(0, 10);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
        return updated;
      });
    }, 300);
    return () => clearTimeout(timerRef.current);
  }, [query, tab]);

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="rounded-[22px] bg-card p-[16px] md:p-[22px]">
        {/* Search input */}
        <div className="flex items-center gap-[10px] rounded-[52px] bg-muted py-[10px] pl-[15px] pr-[10px]">
          <img src="/icons/dashboard/search.svg" alt="" className="size-[24px] shrink-0" />
          <input
            autoFocus
            placeholder="Search creators, posts, hashtags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-[14px] text-foreground outline-none placeholder:text-muted-foreground md:text-[16px]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-muted-foreground hover:text-foreground"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="mt-[12px] flex gap-[8px]">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`rounded-[50px] px-[16px] py-[6px] text-[12px] font-medium transition-colors md:text-[14px] ${
                tab === t.value
                  ? 'bg-gradient-to-r from-[#01adf1] to-[#a61651] text-white'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-[16px]">
          {loading ? (
            <div className="flex justify-center py-[40px]">
              <div className="size-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
            </div>
          ) : !query.trim() ? (
            <RecentSearches
              recent={recent}
              onSelect={setQuery}
              onClear={() => {
                setRecent([]);
                localStorage.removeItem('recentSearches');
              }}
            />
          ) : results.length === 0 ? (
            <p className="py-[40px] text-center text-[14px] text-muted-foreground">
              No results found
            </p>
          ) : tab === 'creators' ? (
            <CreatorResults items={results as Creator[]} />
          ) : tab === 'posts' ? (
            <PostResults items={results as PostResult[]} />
          ) : (
            <HashtagResults items={results as HashtagResult[]} />
          )}
        </div>
      </div>
    </div>
  );
}

function RecentSearches({
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

function CreatorResults({ items }: { items: Creator[] }) {
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

function PostResults({ items }: { items: PostResult[] }) {
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

function HashtagResults({ items }: { items: HashtagResult[] }) {
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
