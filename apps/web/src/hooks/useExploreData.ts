import { useState, useEffect, useRef, useCallback } from 'react';
import type { CreatorCard as CreatorCardType, CreatorFiltersResponse } from '@fansbook/shared';
import { api } from '../lib/api';
import type { ExploreTab } from '../components/explore/ExploreTabs';

type SortOption = 'createdAt' | 'followers' | 'price';

interface CreatorsResponse {
  items: CreatorCardType[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

interface TrendingPost {
  id: string;
  text: string | null;
  likeCount: number;
  commentCount: number;
  media: { id: string; url: string; type: string; thumbnail?: string | null }[];
}

function buildParams(pg: number, sort: SortOption, search: string, cat: string) {
  const p = new URLSearchParams({
    page: String(pg),
    limit: '12',
    sortBy: sort,
    sortOrder: sort === 'price' ? 'asc' : 'desc',
  });
  if (search) p.set('search', search);
  if (cat) p.set('category', cat);
  return p.toString();
}

const FALLBACK_HASHTAGS = [
  { tag: 'streaming', count: 0 },
  { tag: 'gaming', count: 0 },
  { tag: 'modeling', count: 0 },
  { tag: 'fitness', count: 0 },
];

export function useExploreData(
  tab: ExploreTab,
  debouncedSearch: string,
  category: string,
  sortBy: SortOption,
) {
  const [filters, setFilters] = useState<CreatorFiltersResponse | null>(null);
  const [creators, setCreators] = useState<CreatorCardType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [trendingPosts, setTrendingPosts] = useState<TrendingPost[]>([]);
  const [trendingHashtags, setTrendingHashtags] = useState<{ tag: string; count: number }[]>([]);
  const [suggested, setSuggested] = useState<CreatorCardType[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [hashtagsLoading, setHashtagsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // One-time loads
  useEffect(() => {
    api
      .get<{ data: CreatorFiltersResponse }>('/creators/filters')
      .then((r) => setFilters(r.data.data))
      .catch(() => {});
    api
      .get('/creators/suggestions?limit=8')
      .then((r) => setSuggested(r.data.data || []))
      .catch(() => {});
    api
      .get('/hashtags/trending')
      .then((r) => setTrendingHashtags(r.data.data || []))
      .catch(() => setTrendingHashtags(FALLBACK_HASHTAGS));
  }, []);

  // Creators fetch
  useEffect(() => {
    if (tab !== 'all' && tab !== 'creators') return;
    setPage(1);
    setLoading(true);
    api
      .get<{ data: CreatorsResponse }>(
        `/creators?${buildParams(1, sortBy, debouncedSearch, category)}`,
      )
      .then((r) => {
        setCreators(r.data.data.items);
        setHasMore(r.data.data.hasMore);
      })
      .catch(() => setCreators([]))
      .finally(() => setLoading(false));
  }, [debouncedSearch, category, sortBy, tab]);

  // Posts tab
  useEffect(() => {
    if (tab !== 'posts') return;
    setPostsLoading(true);
    api
      .get('/feed/explore?limit=20')
      .then((r) => setTrendingPosts(r.data.data?.posts || r.data.data || []))
      .catch(() => setTrendingPosts([]))
      .finally(() => setPostsLoading(false));
  }, [tab]);

  // Hashtags tab
  useEffect(() => {
    if (tab !== 'hashtags') return;
    setHashtagsLoading(true);
    api
      .get('/hashtags/trending')
      .then((r) => setTrendingHashtags(r.data.data || []))
      .catch(() => {})
      .finally(() => setHashtagsLoading(false));
  }, [tab]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    const next = page + 1;
    setLoadingMore(true);
    api
      .get<{ data: CreatorsResponse }>(
        `/creators?${buildParams(next, sortBy, debouncedSearch, category)}`,
      )
      .then((r) => {
        setCreators((p) => [...p, ...r.data.data.items]);
        setHasMore(r.data.data.hasMore);
        setPage(next);
      })
      .finally(() => setLoadingMore(false));
  }, [loadingMore, hasMore, page, sortBy, debouncedSearch, category]);

  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting) loadMore();
      },
      { rootMargin: '200px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  return {
    filters,
    creators,
    loading,
    loadingMore,
    observerRef,
    trendingPosts,
    trendingHashtags,
    suggested,
    postsLoading,
    hashtagsLoading,
  };
}
