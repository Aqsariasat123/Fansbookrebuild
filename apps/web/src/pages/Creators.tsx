import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MarketingNav } from '../components/marketing/MarketingNav';
import { useCreators } from '../hooks/useCreators';
import type { CreatorsFilterParams } from '@fansbook/shared';
import { CreatorCard } from '../components/creators/CreatorCard';
import { CreatorCardSkeleton } from '../components/creators/CreatorCardSkeleton';
import { FilterBar } from '../components/creators/FilterBar';

function parseFilters(searchParams: URLSearchParams): CreatorsFilterParams {
  const priceMinRaw = searchParams.get('priceMin');
  const priceMaxRaw = searchParams.get('priceMax');
  return {
    page: Number(searchParams.get('page')) || 1,
    limit: 12,
    search: searchParams.get('search') || undefined,
    gender: searchParams.get('gender') || undefined,
    country: searchParams.get('country') || undefined,
    priceMin: priceMinRaw ? Number(priceMinRaw) : undefined,
    priceMax: priceMaxRaw ? Number(priceMaxRaw) : undefined,
  };
}

const GRID_CLASS =
  'grid grid-cols-2 gap-[12px] sm:gap-[20px] md:gap-[32px] lg:grid-cols-3 xl:grid-cols-4';

function CreatorsGrid({
  data,
  isLoading,
  isError,
}: {
  data: ReturnType<typeof useCreators>['data'];
  isLoading: boolean;
  isError: boolean;
}) {
  if (isError) {
    return (
      <div className="py-[60px] text-center font-outfit text-[18px] text-[#999]">
        Something went wrong. Please try again.
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className={GRID_CLASS}>
        {Array.from({ length: 8 }).map((_, i) => (
          <CreatorCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (data && data.items.length > 0) {
    return (
      <div className={GRID_CLASS}>
        {data.items.map((creator) => (
          <CreatorCard key={creator.id} creator={creator} />
        ))}
      </div>
    );
  }
  return (
    <div className="py-[60px] text-center font-outfit text-[18px] text-[#999]">
      No creators found. Try adjusting your filters.
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  hasMore,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  onPageChange: (page: string) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-[12px] pb-[80px]">
      <button
        disabled={currentPage <= 1}
        onClick={() => onPageChange(String(currentPage - 1))}
        className="rounded-[8px] bg-[#252d32] px-[16px] py-[10px] font-outfit text-[14px] text-[#f8f8f8] disabled:opacity-40"
      >
        Previous
      </button>
      <span className="font-outfit text-[14px] text-[#999]">
        Page {currentPage} of {totalPages}
      </span>
      <button
        disabled={!hasMore}
        onClick={() => onPageChange(String(currentPage + 1))}
        className="rounded-[8px] bg-[#252d32] px-[16px] py-[10px] font-outfit text-[14px] text-[#f8f8f8] disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}

export default function Creators() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = parseFilters(searchParams);
  const { data, isLoading, isError } = useCreators(filters);

  const handleFilterChange = useCallback(
    (key: string, value: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        if (key !== 'page') {
          next.delete('page');
        }
        return next;
      });
    },
    [setSearchParams],
  );

  const currentPage = filters.page || 1;
  const totalPages = data ? Math.ceil(data.total / 12) : 1;

  return (
    <div className="min-h-screen bg-[#15191c] font-outfit">
      <div className="relative h-[130px]">
        <MarketingNav />
      </div>
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />
      <div className="flex justify-center px-[16px] pb-[40px] md:px-[60px]">
        <CreatorsGrid data={data} isLoading={isLoading} isError={isError} />
      </div>
      {data && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          hasMore={data.hasMore}
          onPageChange={(page) => handleFilterChange('page', page)}
        />
      )}
    </div>
  );
}
