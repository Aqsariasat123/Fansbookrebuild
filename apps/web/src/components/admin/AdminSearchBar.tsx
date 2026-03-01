interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  onAdd?: () => void;
  addLabel?: string;
  children?: React.ReactNode;
}

export function AdminSearchBar({
  value,
  onChange,
  placeholder = 'Search',
  onAdd,
  addLabel = 'Add',
  children,
}: Props) {
  return (
    <div className="mb-[16px] rounded-[22px] bg-[#f8f8f8] px-[22px] py-[29px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
      <div className="flex items-center gap-[5px] rounded-[6px] border border-[#15191c] px-[10px] py-[6px]">
        <img src="/icons/admin/search.svg" alt="" className="size-[24px]" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent font-outfit text-[16px] font-normal text-black outline-none placeholder:text-[#5d5d5d]"
        />
      </div>
      <div className="mt-[12px] flex flex-wrap items-center gap-[35px]">
        {children}
        {onAdd && (
          <button
            onClick={onAdd}
            className="ml-auto rounded-[8px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[20px] py-[8px] font-outfit text-[14px] font-normal text-[#f8f8f8]"
          >
            {addLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export function AdminFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex h-[32px] items-center rounded-[6px] border border-[#15191c] pl-[13px] pr-[10px]">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent font-outfit text-[16px] font-normal text-[#5d5d5d] outline-none"
      >
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <img src="/icons/admin/arrow-drop-down-dark.svg" alt="" className="ml-[4px] size-[24px]" />
    </div>
  );
}

export function AdminDateRange({
  from,
  to,
  onFromChange,
  onToChange,
  onClear,
}: {
  from: string;
  to: string;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="flex items-center gap-[12px]">
      <div className="flex items-center gap-[6px]">
        <span className="font-outfit text-[16px] font-normal text-[#15191c]">From:</span>
        <input
          type="date"
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
          className="rounded-[6px] border border-[#15191c] bg-transparent px-[10px] py-[6px] font-outfit text-[16px] text-[#5d5d5d] outline-none"
        />
      </div>
      <div className="flex items-center gap-[6px]">
        <span className="font-outfit text-[16px] font-normal text-[#15191c]">To:</span>
        <input
          type="date"
          value={to}
          onChange={(e) => onToChange(e.target.value)}
          className="rounded-[6px] border border-[#15191c] bg-transparent px-[10px] py-[6px] font-outfit text-[16px] text-[#5d5d5d] outline-none"
        />
      </div>
      <button
        onClick={onClear}
        className="flex h-[32px] items-center rounded-[26px] bg-[#5d5d5d] px-[8px] font-outfit text-[10px] text-[#f8f8f8]"
      >
        Clear Dates
      </button>
    </div>
  );
}
