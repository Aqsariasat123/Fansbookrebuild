export type CategoryFilter = '' | 'TIP_RECEIVED' | 'SUBSCRIPTION' | 'PPV_EARNING';

interface EarningsFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  startDate: string;
  onStartDateChange: (value: string) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
  category: CategoryFilter;
  onCategoryChange: (value: CategoryFilter) => void;
}

export function EarningsFilterBar({
  search,
  onSearchChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  category,
  onCategoryChange,
}: EarningsFilterBarProps) {
  return (
    <div className="flex flex-col gap-[10px] rounded-[22px] bg-[#0e1012] p-[12px] md:flex-row md:items-center md:gap-[16px] md:p-[16px]">
      {/* Search */}
      <div className="flex flex-1 items-center gap-[10px] rounded-[52px] bg-[#15191c] px-4 py-2">
        <img src="/icons/dashboard/search.svg" alt="" className="size-[20px] shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search earnings..."
          className="flex-1 bg-transparent text-[13px] text-[#f8f8f8] placeholder-[#5d5d5d] outline-none md:text-[14px]"
        />
      </div>

      {/* Start Date */}
      <input
        type="date"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        className="rounded-[52px] bg-[#15191c] px-4 py-2 text-[13px] text-[#f8f8f8] outline-none md:text-[14px] [&::-webkit-calendar-picker-indicator]:invert"
      />

      {/* End Date */}
      <input
        type="date"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        className="rounded-[52px] bg-[#15191c] px-4 py-2 text-[13px] text-[#f8f8f8] outline-none md:text-[14px] [&::-webkit-calendar-picker-indicator]:invert"
      />

      {/* Category Select */}
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value as CategoryFilter)}
        className="rounded-[52px] bg-[#15191c] px-4 py-2 text-[13px] text-[#f8f8f8] outline-none md:text-[14px]"
      >
        <option value="">All</option>
        <option value="TIP_RECEIVED">Tip Received</option>
        <option value="SUBSCRIPTION">Subscription</option>
        <option value="PPV_EARNING">PPV Earning</option>
      </select>
    </div>
  );
}
