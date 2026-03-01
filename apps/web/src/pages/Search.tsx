import { useState, useEffect, useRef } from 'react';
import { api } from '../lib/api';
import {
  RecentSearches,
  CreatorResults,
  PostResults,
  HashtagResults,
  type Creator,
  type PostResult,
  type HashtagResult,
} from '../components/search/SearchResults';

type TabType = 'creators' | 'posts' | 'hashtags';
const TABS: { label: string; value: TabType }[] = [
  { label: 'Creators', value: 'creators' },
  { label: 'Posts', value: 'posts' },
  { label: 'Hashtags', value: 'hashtags' },
];

export default function Search() {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<TabType>('creators');
  const [results, setResults] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
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
