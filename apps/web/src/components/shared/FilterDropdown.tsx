export function FilterDropdown({
  label,
  value,
  options,
  open,
  onToggle,
  onSelect,
}: {
  label: string;
  value: string;
  options: string[];
  open: boolean;
  onToggle: () => void;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="relative flex-1">
      <button
        onClick={onToggle}
        className="w-full border border-[#5d5d5d] rounded-[6px] px-[30px] py-[10px] flex items-center justify-between"
      >
        <span className="text-[16px] text-[#5d5d5d]">
          {value === 'All' ? label : value.replace('_', ' ')}
        </span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M7 10l5 5 5-5"
            stroke="#5d5d5d"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute z-10 top-full left-0 w-full mt-[4px] bg-[#0e1012] border border-[#5d5d5d] rounded-[6px] overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              className={`w-full text-left px-[30px] py-[10px] text-[14px] hover:bg-[#15191c] transition-colors ${opt === value ? 'text-[#01adf1]' : 'text-[#f8f8f8]'}`}
            >
              {opt === 'All' ? `All ${label}` : opt.replace('_', ' ')}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
