import { useState, useRef, useEffect } from 'react';

interface DropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}

export function Dropdown({ label, value, options, onChange }: DropdownProps) {
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
          {value || label}
        </span>
        <img src="/icons/creators/arrow_drop_down.svg" alt="" className="h-[24px] w-[24px]" />
      </button>
      {open && (
        <div className="absolute top-full left-0 z-50 mt-[4px] min-w-[160px] rounded-[8px] bg-muted py-[8px] shadow-lg">
          <button
            onClick={() => {
              onChange('');
              setOpen(false);
            }}
            className="block w-full px-[16px] py-[8px] text-left font-outfit text-[14px] text-muted-foreground hover:bg-muted"
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
              className={`block w-full px-[16px] py-[8px] text-left font-outfit text-[14px] hover:bg-muted ${
                value === opt ? 'text-primary' : 'text-foreground'
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
