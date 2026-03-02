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
    <div className="mb-[12px] rounded-[16px] bg-[#f8f8f8] px-[14px] py-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] md:mb-[16px] md:rounded-[22px] md:px-[22px] md:py-[29px]">
      <div className="flex items-center gap-[5px] rounded-[6px] border border-[#15191c] px-[10px] py-[6px]">
        <img src="/icons/admin/search.svg" alt="" className="size-[20px] md:size-[24px]" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent font-outfit text-[14px] font-normal text-black outline-none placeholder:text-[#5d5d5d] md:text-[16px]"
        />
      </div>
      <div className="mt-[12px] flex flex-wrap items-center gap-[10px] md:gap-[35px]">
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
    <div className="flex h-[32px] items-center rounded-[6px] border border-[#15191c] pl-[10px] pr-[8px] md:pl-[13px] md:pr-[10px]">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent font-outfit text-[13px] font-normal text-[#5d5d5d] outline-none md:text-[16px]"
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
    <div className="flex flex-col gap-[8px] md:flex-row md:items-center md:gap-[12px]">
      <div className="grid grid-cols-2 gap-[8px] md:flex md:items-center md:gap-[12px]">
        <div className="flex items-center gap-[4px]">
          <span className="font-outfit text-[13px] font-normal text-[#15191c] md:text-[16px]">
            From:
          </span>
          <input
            type="date"
            value={from}
            onChange={(e) => onFromChange(e.target.value)}
            className="w-full rounded-[6px] border border-[#15191c] bg-transparent px-[6px] py-[6px] font-outfit text-[12px] text-[#5d5d5d] outline-none md:w-auto md:px-[10px] md:text-[16px]"
          />
        </div>
        <div className="flex items-center gap-[4px]">
          <span className="font-outfit text-[13px] font-normal text-[#15191c] md:text-[16px]">
            To:
          </span>
          <input
            type="date"
            value={to}
            onChange={(e) => onToChange(e.target.value)}
            className="w-full rounded-[6px] border border-[#15191c] bg-transparent px-[6px] py-[6px] font-outfit text-[12px] text-[#5d5d5d] outline-none md:w-auto md:px-[10px] md:text-[16px]"
          />
        </div>
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
