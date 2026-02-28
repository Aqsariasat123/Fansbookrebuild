import { useState, useEffect, useRef, useCallback } from 'react';
import type { CreatorCard as CreatorCardType, CreatorFiltersResponse } from '@fansbook/shared';
import { api } from '../lib/api';
import { CreatorCard } from '../components/explore/CreatorCard';
import { CategoryChips } from '../components/explore/CategoryChips';

type SortOption = 'createdAt' | 'followers' | 'price';
const SORT_LABELS: Record<SortOption, string> = {
  createdAt: 'Newest',
  followers: 'Most Followers',
  price: 'Price Low-High',
};
const SORT_OPTIONS: SortOption[] = ['createdAt', 'followers', 'price'];

interface CreatorsResponse {
  items: CreatorCardType[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

function buildParams(pg: number, sort: SortOption, search: string, cat: string) {
  const params = new URLSearchParams({
    page: String(pg),
    limit: '12',
    sortBy: sort,
    sortOrder: sort === 'price' ? 'asc' : 'desc',
  });
  if (search) params.set('search', search);
  if (cat) params.set('category', cat);
  return params.toString();
}

export default function Explore() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('createdAt');
  const [sortOpen, setSortOpen] = useState(false);
  const [filters, setFilters] = useState<CreatorFiltersResponse | null>(null);
  const [creators, setCreators] = useState<CreatorCardType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    api
      .get<{ data: CreatorFiltersResponse }>('/creators/filters')
      .then((res) => setFilters(res.data.data))
      .catch(() => {
        /* silent */
      });
  }, []);

  useEffect(() => {
    setPage(1);
    setLoading(true);
    const qs = buildParams(1, sortBy, debouncedSearch, category);
    api
      .get<{ data: CreatorsResponse }>(`/creators?${qs}`)
      .then((res) => {
        setCreators(res.data.data.items);
        setHasMore(res.data.data.hasMore);
      })
      .catch(() => setCreators([]))
      .finally(() => setLoading(false));
  }, [debouncedSearch, category, sortBy]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    const next = page + 1;
    setLoadingMore(true);
    const qs = buildParams(next, sortBy, debouncedSearch, category);
    api
      .get<{ data: CreatorsResponse }>(`/creators?${qs}`)
      .then((res) => {
        setCreators((prev) => [...prev, ...res.data.data.items]);
        setHasMore(res.data.data.hasMore);
        setPage(next);
      })
      .finally(() => setLoadingMore(false));
  }, [loadingMore, hasMore, page, sortBy, debouncedSearch, category]);

  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: '200px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  return (
    <div className="space-y-[20px]">
      <div className="flex flex-col gap-[12px] sm:flex-row sm:items-center sm:gap-[16px]">
        <div className="relative flex-1">
          <img
            src="/icons/creators/search.svg"
            alt=""
            className="absolute left-[16px] top-1/2 h-[18px] w-[18px] -translate-y-1/2 opacity-50"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search creators..."
            className="w-full rounded-[52px] border border-border bg-card py-[12px] pl-[44px] pr-[16px] font-outfit text-[14px] text-foreground placeholder-muted-foreground outline-none focus:border-[#01adf1]"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-[8px] rounded-[52px] border border-border bg-card px-[20px] py-[12px] font-outfit text-[14px] text-foreground"
          >
            {SORT_LABELS[sortBy]}
            <img
              src="/icons/dashboard/arrow-drop-down.svg"
              alt=""
              className={`h-[16px] w-[16px] transition-transform ${sortOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {sortOpen && (
            <div className="absolute right-0 z-10 mt-[4px] rounded-[12px] border border-border bg-card py-[4px] shadow-lg">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setSortBy(opt);
                    setSortOpen(false);
                  }}
                  className={`block w-full whitespace-nowrap px-[20px] py-[10px] text-left font-outfit text-[14px] transition-colors ${
                    sortBy === opt ? 'text-primary' : 'text-foreground hover:text-primary'
                  }`}
                >
                  {SORT_LABELS[opt]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {filters && (
        <CategoryChips categories={filters.categories} selected={category} onSelect={setCategory} />
      )}

      {loading ? (
        <div className="grid grid-cols-2 gap-[16px] md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-[260px] animate-pulse rounded-[16px] bg-card" />
          ))}
        </div>
      ) : creators.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-[60px]">
          <img
            src="/icons/creators/search.svg"
            alt=""
            className="mb-[16px] h-[48px] w-[48px] opacity-30"
          />
          <p className="font-outfit text-[16px] text-muted-foreground">No creators found</p>
          <p className="mt-[4px] font-outfit text-[13px] text-muted-foreground">
            Try a different search or category
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-[16px] md:grid-cols-3 lg:grid-cols-4">
            {creators.map((c) => (
              <CreatorCard key={c.id} creator={c} />
            ))}
          </div>
          {loadingMore && (
            <div className="flex justify-center py-[20px]">
              <div className="h-[24px] w-[24px] animate-spin rounded-full border-[2px] border-border border-t-[#01adf1]" />
            </div>
          )}
          <div ref={observerRef} className="h-[1px]" />
        </>
      )}
    </div>
  );
}
