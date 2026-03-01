type SortOption = 'createdAt' | 'followers' | 'price';
const SORT_LABELS: Record<SortOption, string> = {
  createdAt: 'Newest',
  followers: 'Most Followers',
  price: 'Price Low-High',
};
const SORT_OPTIONS: SortOption[] = ['createdAt', 'followers', 'price'];

export default function SearchAndSort({
  search,
  onSearch,
  placeholder,
  showSort,
  sortBy,
  sortOpen,
  onSortToggle,
  onSortChange,
}: {
  search: string;
  onSearch: (v: string) => void;
  placeholder: string;
  showSort: boolean;
  sortBy: SortOption;
  sortOpen: boolean;
  onSortToggle: () => void;
  onSortChange: (s: SortOption) => void;
}) {
  return (
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
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-[52px] border border-border bg-card py-[12px] pl-[44px] pr-[16px] font-outfit text-[14px] text-foreground placeholder-muted-foreground outline-none focus:border-[#01adf1]"
        />
      </div>
      {showSort && (
        <div className="relative">
          <button
            onClick={onSortToggle}
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
                  onClick={() => onSortChange(opt)}
                  className={`block w-full whitespace-nowrap px-[20px] py-[10px] text-left font-outfit text-[14px] transition-colors ${sortBy === opt ? 'text-primary' : 'text-foreground hover:text-primary'}`}
                >
                  {SORT_LABELS[opt]}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
