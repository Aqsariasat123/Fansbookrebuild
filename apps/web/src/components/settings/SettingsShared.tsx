import { LockIcon, VisibilityIcon } from './SettingsIcons';

export function SmallBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-muted p-[10px] rounded-[9px] text-[12px] text-foreground hover:opacity-80 transition-opacity"
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
      <p className="text-[12px] text-muted-foreground">{label}</p>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-muted rounded-[8px] px-[10px] py-[10px] bg-transparent text-[12px] text-foreground outline-none focus:border-border"
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
      <p className="text-[12px] text-muted-foreground">{label}</p>
      <div className="border border-muted rounded-[8px] p-[10px] flex items-center justify-between">
        <div className="flex items-center gap-[10px] flex-1">
          <LockIcon />
          <input
            type={show ? 'text' : 'password'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="••••••••"
            className="bg-transparent text-[12px] text-foreground outline-none w-full placeholder:text-muted-foreground"
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
  return <div className="bg-muted h-px w-full my-[16px]" />;
}
