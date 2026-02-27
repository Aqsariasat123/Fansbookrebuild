import { LockIcon, VisibilityIcon } from './SettingsIcons';

export function SmallBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-[#15191c] p-[10px] rounded-[9px] text-[12px] text-[#f8f8f8] hover:opacity-80 transition-opacity"
    >
      {label}
    </button>
  );
}

export function FieldInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-[8px] flex-1 max-w-[332px]">
      <p className="text-[12px] text-[#5d5d5d]">{label}</p>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-[#15191c] rounded-[8px] px-[10px] py-[10px] bg-transparent text-[12px] text-[#f8f8f8] outline-none focus:border-[#5d5d5d]"
      />
    </div>
  );
}

export function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex flex-col gap-[9px] flex-1 max-w-[332px]">
      <p className="text-[12px] text-[#5d5d5d]">{label}</p>
      <div className="border border-[#15191c] rounded-[8px] p-[10px] flex items-center justify-between">
        <div className="flex items-center gap-[10px] flex-1">
          <LockIcon />
          <input
            type={show ? 'text' : 'password'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="••••••••"
            className="bg-transparent text-[12px] text-[#f8f8f8] outline-none w-full placeholder:text-[#5d5d5d]"
          />
        </div>
        <button onClick={onToggle} className="opacity-60 hover:opacity-100">
          <VisibilityIcon />
        </button>
      </div>
    </div>
  );
}

export function Divider() {
  return <div className="bg-[#15191c] h-px w-full my-[16px]" />;
}
