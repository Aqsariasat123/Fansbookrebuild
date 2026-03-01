import { useState, useEffect } from 'react';
import { CategoryChips } from '../components/explore/CategoryChips';
import { ExploreTabs, type ExploreTab } from '../components/explore/ExploreTabs';
import { TrendingPostsGrid } from '../components/explore/TrendingPostsGrid';
import { HashtagsList } from '../components/explore/HashtagsList';
import { SuggestedCarousel } from '../components/explore/SuggestedCarousel';
import SearchAndSort from '../components/explore/SearchAndSort';
import CreatorsGrid from '../components/explore/CreatorsGrid';
import { useExploreData } from '../hooks/useExploreData';

type SortOption = 'createdAt' | 'followers' | 'price';

const PLACEHOLDERS: Record<ExploreTab, string> = {
  all: 'Search creators...',
  creators: 'Search creators...',
  posts: 'Search posts...',
  hashtags: 'Search hashtags...',
};

export default function Explore() {
  const [tab, setTab] = useState<ExploreTab>('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('createdAt');
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const data = useExploreData(tab, debouncedSearch, category, sortBy);
  const showSort = tab === 'all' || tab === 'creators';

  return (
    <div className="space-y-[20px]">
      <SearchAndSort
        search={search}
        onSearch={setSearch}
        placeholder={PLACEHOLDERS[tab]}
        showSort={showSort}
        sortBy={sortBy}
        sortOpen={sortOpen}
        onSortToggle={() => setSortOpen(!sortOpen)}
        onSortChange={(s) => {
          setSortBy(s as SortOption);
          setSortOpen(false);
        }}
      />
      <ExploreTabs active={tab} onChange={setTab} />
      <ExploreTabContent
        tab={tab}
        data={data}
        debouncedSearch={debouncedSearch}
        category={category}
        setTab={setTab}
        setSearch={setSearch}
        setCategory={setCategory}
        showSort={showSort}
      />
    </div>
  );
}

function ExploreTabContent({
  tab,
  data,
  debouncedSearch,
  category,
  setTab,
  setSearch,
  setCategory,
  showSort,
}: {
  tab: ExploreTab;
  data: ReturnType<typeof useExploreData>;
  debouncedSearch: string;
  category: string;
  setTab: (t: ExploreTab) => void;
  setSearch: (s: string) => void;
  setCategory: (c: string) => void;
  showSort: boolean;
}) {
  return (
    <>
      {tab === 'all' && data.trendingHashtags.length > 0 && (
        <div className="flex gap-[8px] overflow-x-auto scrollbar-hide">
          {data.trendingHashtags.map((h) => (
            <button
              key={h.tag}
              onClick={() => {
                setTab('hashtags');
                setSearch(h.tag);
              }}
              className="shrink-0 rounded-[20px] border border-border bg-card px-[16px] py-[8px] text-[13px] text-muted-foreground transition-colors hover:border-[#01adf1] hover:text-foreground"
            >
              #{h.tag}
            </button>
          ))}
        </div>
      )}
      {tab === 'all' && (
        <SuggestedCarousel creators={data.suggested} onSeeAll={() => setTab('creators')} />
      )}
      {showSort && data.filters && (
        <CategoryChips
          categories={data.filters.categories}
          selected={category}
          onSelect={setCategory}
        />
      )}
      {showSort && (
        <CreatorsGrid
          creators={data.creators}
          loading={data.loading}
          loadingMore={data.loadingMore}
          observerRef={data.observerRef}
        />
      )}
      {tab === 'posts' && (
        <TrendingPostsGrid posts={data.trendingPosts} loading={data.postsLoading} />
      )}
      {tab === 'hashtags' && (
        <HashtagsList
          hashtags={data.trendingHashtags}
          loading={data.hashtagsLoading}
          searchFilter={debouncedSearch}
        />
      )}
    </>
  );
}
