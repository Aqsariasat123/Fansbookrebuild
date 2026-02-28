import { useState, useRef, useEffect, useCallback } from 'react';
import type { CreatorsFilterParams } from '@fansbook/shared';
import { useCreatorFilters } from '../../hooks/useCreators';
import { Dropdown } from './Dropdown';

const PRICE_RANGES = [
  { label: '$0 - $10', min: '0', max: '10' },
  { label: '$10 - $20', min: '10', max: '20' },
  { label: '$20 - $30', min: '20', max: '30' },
  { label: '$30+', min: '30', max: '' },
];

function getPriceLabel(priceMin: number | undefined, priceMax: number | undefined): string {
  if (!priceMin && !priceMax) return 'Price Range';
  return `$${priceMin || 0} - $${priceMax || '∞'}`;
}

function PriceDropdown({
  priceMin,
  priceMax,
  onFilterChange,
}: {
  priceMin: number | undefined;
  priceMax: number | undefined;
  onFilterChange: (key: string, value: string) => void;
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

  const selectRange = (min: string, max: string) => {
    onFilterChange('priceMin', min);
    onFilterChange('priceMax', max);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-[5px]">
        <span className="font-outfit text-[16px] font-normal text-foreground">
          {getPriceLabel(priceMin, priceMax)}
        </span>
        <img src="/icons/creators/arrow_drop_down.svg" alt="" className="h-[24px] w-[24px]" />
      </button>
      {open && (
        <div className="absolute top-full left-0 z-50 mt-[4px] min-w-[160px] rounded-[8px] bg-muted py-[8px] shadow-lg">
          <button
            onClick={() => selectRange('', '')}
            className="block w-full px-[16px] py-[8px] text-left font-outfit text-[14px] text-muted-foreground hover:bg-muted"
          >
            Any Price
          </button>
          {PRICE_RANGES.map((range) => (
            <button
              key={range.label}
              onClick={() => selectRange(range.min, range.max)}
              className="block w-full px-[16px] py-[8px] text-left font-outfit text-[14px] text-foreground hover:bg-muted"
            >
              {range.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface FilterBarProps {
  filters: CreatorsFilterParams;
  onFilterChange: (key: string, value: string) => void;
}

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const { data: filterOptions } = useCreatorFilters();
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

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

  const clearAll = () => {
    onFilterChange('gender', '');
    onFilterChange('country', '');
    onFilterChange('priceMin', '');
    onFilterChange('priceMax', '');
    onFilterChange('search', '');
    setSearchValue('');
    if (debounceRef.current) clearTimeout(debounceRef.current);
  };

  return (
    <div className="flex items-center justify-center px-[16px] pt-[30px] pb-[30px] md:px-0 md:pt-[55px] md:pb-[50px]">
      <div className="flex w-full flex-col items-stretch md:w-auto md:flex-row md:items-center">
        <div className="flex flex-wrap items-center gap-[20px] rounded-t-[52px] bg-card px-[16px] py-[16px] md:flex-nowrap md:gap-[50px] md:rounded-l-[52px] md:rounded-tr-none md:px-[32px] md:py-[22px]">
          {/* Search */}
          <div className="flex w-full items-center gap-[12px] md:w-auto md:gap-[18px]">
            <img src="/icons/creators/search.svg" alt="" className="h-[24px] w-[24px]" />
            <input
              type="text"
              placeholder="Search creators..."
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-transparent font-outfit text-[16px] font-normal text-foreground placeholder-muted-foreground outline-none md:w-[120px]"
            />
          </div>

          <Dropdown
            label="Gender"
            value={filters.gender || ''}
            options={filterOptions?.genders || []}
            onChange={(val) => onFilterChange('gender', val)}
          />

          <Dropdown
            label="Country"
            value={filters.country || ''}
            options={filterOptions?.countries || []}
            onChange={(val) => onFilterChange('country', val)}
          />

          <PriceDropdown
            priceMin={filters.priceMin}
            priceMax={filters.priceMax}
            onFilterChange={onFilterChange}
          />
        </div>

        <button
          onClick={clearAll}
          className="flex items-center justify-center gap-[10px] rounded-b-[52px] bg-card px-[20px] py-[14px] md:rounded-b-none md:rounded-r-[52px] md:py-[22px] border-l border-border"
        >
          <img src="/icons/creators/filter_list.svg" alt="" className="h-[24px] w-[24px]" />
          <span className="font-outfit text-[16px] font-normal text-foreground">Clear</span>
        </button>
      </div>
    </div>
  );
}
