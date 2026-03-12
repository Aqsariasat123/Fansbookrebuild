import { useState, useRef, useEffect } from 'react';

const SORT_OPTIONS = [
  { label: 'Newest', sortBy: 'createdAt', sortOrder: 'desc' },
  { label: 'Most Followed', sortBy: 'followers', sortOrder: 'desc' },
  { label: 'Lowest Price', sortBy: 'price', sortOrder: 'asc' },
  { label: 'Highest Price', sortBy: 'price', sortOrder: 'desc' },
];

function getSortLabel(sortBy: string | undefined, sortOrder: string | undefined): string {
  if (!sortBy) return 'Sort By';
  const match = SORT_OPTIONS.find((o) => o.sortBy === sortBy && o.sortOrder === sortOrder);
  return match ? match.label : 'Sort By';
}

interface SortDropdownProps {
  sortBy: string | undefined;
  sortOrder: string | undefined;
  onMultiFilterChange: (updates: Record<string, string>) => void;
}

export function SortDropdown({ sortBy, sortOrder, onMultiFilterChange }: SortDropdownProps) {
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
      <button onClick={() => setOpen(!open)} className="flex items-center gap-[5px]">
        <span className="font-outfit text-[16px] font-normal text-foreground">
          {getSortLabel(sortBy, sortOrder)}
        </span>
        <img src="/icons/creators/arrow_drop_down.svg" alt="" className="h-[24px] w-[24px]" />
      </button>
      {open && (
        <div className="absolute top-full left-0 z-50 mt-[4px] min-w-[160px] rounded-[8px] bg-muted py-[8px] shadow-lg">
          <button
            onClick={() => {
              onMultiFilterChange({ sortBy: '', sortOrder: '' });
              setOpen(false);
            }}
            className="block w-full px-[16px] py-[8px] text-left font-outfit text-[14px] text-muted-foreground hover:bg-muted"
          >
            Default
          </button>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => {
                onMultiFilterChange({ sortBy: opt.sortBy, sortOrder: opt.sortOrder });
                setOpen(false);
              }}
              className={`block w-full px-[16px] py-[8px] text-left font-outfit text-[14px] hover:bg-muted ${
                sortBy === opt.sortBy && sortOrder === opt.sortOrder
                  ? 'text-primary'
                  : 'text-foreground'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
