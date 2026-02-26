import { useState, useCallback, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MarketingNav } from '../components/marketing/MarketingNav';
import { useCreators, useCreatorFilters } from '../hooks/useCreators';
import type { CreatorCard as CreatorCardType, CreatorsFilterParams } from '@fansbook/shared';

/* ─── Category → Icon mapping ─── */
const CATEGORY_ICONS: Record<string, string> = {
  Artist: 'palette',
  Model: 'photo_camera',
  'Adult Creator': '18_up_rating',
  'Personal Trainer': 'sports_gymnastics',
  Comedian: 'comedy_mask',
  Musician: 'comedy_mask',
  Chef: 'palette',
};

/* ─── Badge Component ─── */
type BadgeType = 'live' | 'verified' | 'top' | 'new';

function Badge({ type }: { type: BadgeType }) {
  if (type === 'live') {
    return (
      <span className="flex items-center gap-[5px] rounded-[4px] bg-[#e02a2a] px-[8px] py-[4px]">
        <img src="/icons/creators/live_dot.svg" alt="" className="h-[4px] w-[4px]" />
        <span className="font-outfit text-[12px] font-normal text-[#f8f8f8]">Live</span>
      </span>
    );
  }
  if (type === 'verified') {
    return (
      <span className="flex items-center gap-[5px] rounded-[4px] bg-[#15191c] px-[5px] py-[4px]">
        <span className="font-outfit text-[12px] font-normal text-[#f8f8f8]">Verified</span>
        <img src="/icons/creators/verified.svg" alt="" className="h-[16px] w-[16px]" />
      </span>
    );
  }
  if (type === 'top') {
    return (
      <span className="rounded-[4px] bg-[#15191c] px-[10px] py-[5px] font-outfit text-[12px] font-normal text-[#f8f8f8]">
        Top
      </span>
    );
  }
  return (
    <span className="rounded-[4px] bg-[#15191c] px-[10px] py-[5px] font-outfit text-[12px] font-normal text-[#f8f8f8]">
      New
    </span>
  );
}

/* ─── Creator Card ─── */
function CreatorCard({ creator }: { creator: CreatorCardType }) {
  const badges: BadgeType[] = [];
  if (creator.isLive) badges.push('live');
  if (creator.isVerified) badges.push('verified');
  if (creator.followersCount >= 100) badges.push('top');
  if (creator.isNew) badges.push('new');

  const leftBadges = badges.filter((b) => b === 'live');
  const rightBadges = badges.filter((b) => b !== 'live');

  const categoryIcon = creator.category
    ? CATEGORY_ICONS[creator.category] || 'palette'
    : 'palette';

  return (
    <div className="w-full overflow-hidden rounded-[12px] bg-white sm:rounded-[22px] sm:w-[244px]">
      {/* Image with badges */}
      <div className="relative h-[160px] w-full overflow-hidden bg-[#2a2a2a] sm:h-[243px]">
        {creator.avatar ? (
          <img
            src={creator.avatar}
            alt={creator.displayName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[48px] font-bold text-[#555]">
            {creator.displayName.charAt(0).toUpperCase()}
          </div>
        )}
        {/* Badges overlay */}
        <div className="absolute inset-x-[12px] top-[12px] flex items-start justify-between">
          <div className="flex gap-[6px]">
            {leftBadges.map((b, i) => (
              <Badge key={i} type={b} />
            ))}
          </div>
          <div className="flex gap-[6px]">
            {rightBadges.map((b, i) => (
              <Badge key={i} type={b} />
            ))}
          </div>
        </div>
      </div>

      {/* Info section */}
      <div className="px-[12px] pt-[10px] pb-[12px] sm:px-[22px] sm:pt-[15px] sm:pb-[18px]">
        {/* Name & status */}
        <p className="font-outfit text-[12px] font-normal leading-normal text-black sm:text-[16px]">
          {creator.displayName}
        </p>
        <p className="mt-[2px] font-outfit text-[10px] font-normal leading-normal text-[#5d5d5d] sm:text-[12px]">
          {creator.statusText || 'Available'}
        </p>

        {/* Category */}
        {creator.category && (
          <div className="mt-[8px] flex items-center gap-[6px] sm:mt-[15px] sm:gap-[10px]">
            <img
              src={`/icons/creators/${categoryIcon}.svg`}
              alt=""
              className="h-[16px] w-[16px] sm:h-[20px] sm:w-[20px]"
            />
            <span className="font-outfit text-[12px] font-normal leading-normal text-[#15191c] sm:text-[16px]">
              {creator.category}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mt-[8px] flex items-center gap-[6px] sm:mt-[15px] sm:gap-[10px]">
          <img
            src="/icons/creators/attach_money.svg"
            alt=""
            className="h-[16px] w-[16px] sm:h-[20px] sm:w-[20px]"
          />
          <span className="font-outfit leading-normal">
            <span className="text-[12px] text-[#15191c] sm:text-[16px]">
              {creator.price !== null ? `$${creator.price.toFixed(2)}` : 'Free'}
            </span>
            <span className="text-[10px] text-[#5d5d5d] sm:text-[12px]"> / month</span>
          </span>
        </div>

        {/* Buttons */}
        <div className="mt-[12px] flex w-full sm:mt-[22px] sm:w-[174px]">
          <button className="flex-1 rounded-l-[4px] bg-[#15191c] px-[7px] py-[6px] font-outfit text-[12px] font-normal text-[#f8f8f8] sm:py-[8px] sm:text-[16px]">
            Follow
          </button>
          <button className="rounded-r-[4px] bg-[#01adf1] px-[8px] py-[6px] font-outfit text-[12px] font-normal text-[#f8f8f8] sm:px-[12px] sm:py-[8px] sm:text-[16px]">
            Message
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Dropdown Component ─── */
function Dropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-[5px]"
      >
        <span className="font-outfit text-[16px] font-normal text-[#f8f8f8]">
          {value || label}
        </span>
        <img src="/icons/creators/arrow_drop_down.svg" alt="" className="h-[24px] w-[24px]" />
      </button>
      {open && (
        <div className="absolute top-full left-0 z-50 mt-[4px] min-w-[160px] rounded-[8px] bg-[#252d32] py-[8px] shadow-lg">
          <button
            onClick={() => {
              onChange('');
              setOpen(false);
            }}
            className="block w-full px-[16px] py-[8px] text-left font-outfit text-[14px] text-[#999] hover:bg-[#333]"
          >
            All {label}s
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`block w-full px-[16px] py-[8px] text-left font-outfit text-[14px] hover:bg-[#333] ${
                value === opt ? 'text-[#01adf1]' : 'text-[#f8f8f8]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Filter Bar ─── */
function FilterBar({
  filters,
  onFilterChange,
}: {
  filters: CreatorsFilterParams;
  onFilterChange: (key: string, value: string) => void;
}) {
  const { data: filterOptions } = useCreatorFilters();

  const priceRangeLabel = filters.priceMin || filters.priceMax
    ? `$${filters.priceMin || 0} - $${filters.priceMax || '∞'}`
    : '';

  const priceRanges = [
    { label: '$0 - $10', min: '0', max: '10' },
    { label: '$10 - $20', min: '10', max: '20' },
    { label: '$20 - $30', min: '20', max: '30' },
    { label: '$30+', min: '30', max: '' },
  ];

  const [searchValue, setSearchValue] = useState(filters.search || '');
  const [priceOpen, setPriceOpen] = useState(false);
  const priceRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (priceRef.current && !priceRef.current.contains(e.target as Node)) {
        setPriceOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced live search — fires 400ms after user stops typing
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onFilterChange('search', value);
      }, 400);
    },
    [onFilterChange],
  );

  return (
    <div className="flex items-center justify-center px-[16px] pt-[30px] pb-[30px] md:px-0 md:pt-[55px] md:pb-[50px]">
      <div className="flex w-full flex-col items-stretch md:w-auto md:flex-row md:items-center">
        {/* Left section - dark */}
        <div className="flex flex-wrap items-center gap-[20px] rounded-t-[8px] bg-[#252d32] px-[16px] py-[16px] md:flex-nowrap md:gap-[50px] md:rounded-l-[8px] md:rounded-tr-none md:px-[32px] md:py-[22px]">
          {/* Search */}
          <div className="flex w-full items-center gap-[12px] md:w-auto md:gap-[18px]">
            <img src="/icons/creators/search.svg" alt="" className="h-[24px] w-[24px]" />
            <input
              type="text"
              placeholder="Search creators..."
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-transparent font-outfit text-[16px] font-normal text-[#f8f8f8] placeholder-[#888] outline-none md:w-[120px]"
            />
          </div>

          {/* Gender */}
          <Dropdown
            label="Gender"
            value={filters.gender || ''}
            options={filterOptions?.genders || []}
            onChange={(val) => onFilterChange('gender', val)}
          />

          {/* Country */}
          <Dropdown
            label="Country"
            value={filters.country || ''}
            options={filterOptions?.countries || []}
            onChange={(val) => onFilterChange('country', val)}
          />

          {/* Price Range */}
          <div className="relative" ref={priceRef}>
            <button
              onClick={() => setPriceOpen(!priceOpen)}
              className="flex items-center gap-[5px]"
            >
              <span className="font-outfit text-[16px] font-normal text-[#f8f8f8]">
                {priceRangeLabel || 'Price Range'}
              </span>
              <img src="/icons/creators/arrow_drop_down.svg" alt="" className="h-[24px] w-[24px]" />
            </button>
            {priceOpen && (
              <div className="absolute top-full left-0 z-50 mt-[4px] min-w-[160px] rounded-[8px] bg-[#252d32] py-[8px] shadow-lg">
                <button
                  onClick={() => {
                    onFilterChange('priceMin', '');
                    onFilterChange('priceMax', '');
                    setPriceOpen(false);
                  }}
                  className="block w-full px-[16px] py-[8px] text-left font-outfit text-[14px] text-[#999] hover:bg-[#333]"
                >
                  Any Price
                </button>
                {priceRanges.map((range) => (
                  <button
                    key={range.label}
                    onClick={() => {
                      onFilterChange('priceMin', range.min);
                      onFilterChange('priceMax', range.max);
                      setPriceOpen(false);
                    }}
                    className="block w-full px-[16px] py-[8px] text-left font-outfit text-[14px] text-[#f8f8f8] hover:bg-[#333]"
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right section - Filters button (clears all) */}
        <button
          onClick={() => {
            onFilterChange('gender', '');
            onFilterChange('country', '');
            onFilterChange('priceMin', '');
            onFilterChange('priceMax', '');
            onFilterChange('search', '');
            setSearchValue('');
            if (debounceRef.current) clearTimeout(debounceRef.current);
          }}
          className="flex items-center justify-center gap-[10px] rounded-b-[8px] bg-[#f8f8f8] px-[20px] py-[14px] md:rounded-b-none md:rounded-r-[8px] md:py-[22px]"
        >
          <img src="/icons/creators/filter_list.svg" alt="" className="h-[24px] w-[24px]" />
          <span className="font-outfit text-[16px] font-normal text-[#15191c]">Clear</span>
        </button>
      </div>
    </div>
  );
}

/* ─── Loading Skeleton ─── */
function CreatorCardSkeleton() {
  return (
    <div className="w-full animate-pulse overflow-hidden rounded-[12px] bg-white sm:rounded-[22px] sm:w-[244px]">
      <div className="h-[160px] w-full bg-[#333] sm:h-[243px]" />
      <div className="px-[22px] pt-[15px] pb-[18px]">
        <div className="h-[16px] w-[120px] rounded bg-[#eee]" />
        <div className="mt-[6px] h-[12px] w-[90px] rounded bg-[#eee]" />
        <div className="mt-[15px] h-[20px] w-[140px] rounded bg-[#eee]" />
        <div className="mt-[15px] h-[20px] w-[100px] rounded bg-[#eee]" />
        <div className="mt-[22px] h-[36px] w-[174px] rounded bg-[#eee]" />
      </div>
    </div>
  );
}

/* ─── Main Creators Page ─── */
export default function Creators() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: CreatorsFilterParams = {
    page: Number(searchParams.get('page')) || 1,
    limit: 12,
    search: searchParams.get('search') || undefined,
    gender: searchParams.get('gender') || undefined,
    country: searchParams.get('country') || undefined,
    priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
    priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
  };

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
        // Reset to page 1 on filter change
        if (key !== 'page') {
          next.delete('page');
        }
        return next;
      });
    },
    [setSearchParams],
  );

  const currentPage = filters.page || 1;
  const totalPages = data ? Math.ceil(data.total / (filters.limit || 12)) : 1;

  return (
    <div className="min-h-screen bg-[#15191c] font-outfit">
      {/* Nav area with dark overlay */}
      <div className="relative h-[130px]">
        <MarketingNav />
      </div>

      {/* Filter Bar */}
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />

      {/* Creators Grid */}
      <div className="flex justify-center px-[16px] pb-[40px] md:px-[60px]">
        {isError ? (
          <div className="py-[60px] text-center font-outfit text-[18px] text-[#999]">
            Something went wrong. Please try again.
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-2 gap-[12px] sm:gap-[20px] md:gap-[32px] lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CreatorCardSkeleton key={i} />
            ))}
          </div>
        ) : data && data.items.length > 0 ? (
          <div className="grid grid-cols-2 gap-[12px] sm:gap-[20px] md:gap-[32px] lg:grid-cols-3 xl:grid-cols-4">
            {data.items.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>
        ) : (
          <div className="py-[60px] text-center font-outfit text-[18px] text-[#999]">
            No creators found. Try adjusting your filters.
          </div>
        )}
      </div>

      {/* Pagination */}
      {data && totalPages > 1 && (
        <div className="flex items-center justify-center gap-[12px] pb-[80px]">
          <button
            disabled={currentPage <= 1}
            onClick={() => handleFilterChange('page', String(currentPage - 1))}
            className="rounded-[8px] bg-[#252d32] px-[16px] py-[10px] font-outfit text-[14px] text-[#f8f8f8] disabled:opacity-40"
          >
            Previous
          </button>
          <span className="font-outfit text-[14px] text-[#999]">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={!data.hasMore}
            onClick={() => handleFilterChange('page', String(currentPage + 1))}
            className="rounded-[8px] bg-[#252d32] px-[16px] py-[10px] font-outfit text-[14px] text-[#f8f8f8] disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
