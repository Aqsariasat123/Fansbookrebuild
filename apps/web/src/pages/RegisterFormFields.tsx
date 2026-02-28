type AccountType = 'creator' | 'fan';

const INPUT_CLASS =
  'h-[38px] w-full rounded-[46px] border-[0.77px] border-muted bg-transparent px-[12px] text-[10px] font-normal text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#01adf1] lg:h-[49px] lg:rounded-[59px] lg:border lg:px-[12px] lg:py-[17px] lg:text-[12px]';

const PASSWORD_INPUT_CLASS =
  'h-[38px] w-full rounded-[46px] border-[0.77px] border-muted bg-transparent px-[12px] pr-[40px] text-[10px] font-normal text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#01adf1] lg:h-[49px] lg:rounded-[59px] lg:border lg:px-[12px] lg:py-[17px] lg:pr-[48px] lg:text-[12px]';

interface TextFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  className?: string;
}

export function TextField({
  label,
  type,
  value,
  onChange,
  placeholder,
  className,
}: TextFieldProps) {
  return (
    <div className={className}>
      <label className="block text-[12px] font-normal text-foreground lg:text-[16px]">
        {label}
      </label>
      <div className="mt-[6px] lg:mt-[8px]">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={INPUT_CLASS}
          required
        />
      </div>
    </div>
  );
}

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  show: boolean;
  onToggle: () => void;
  className?: string;
}

export function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  show,
  onToggle,
  className,
}: PasswordFieldProps) {
  return (
    <div className={className}>
      <label className="block text-[12px] font-normal text-foreground lg:text-[16px]">
        {label}
      </label>
      <div className="mt-[6px] relative lg:mt-[8px]">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={PASSWORD_INPUT_CLASS}
          required
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-[12px] top-1/2 -translate-y-1/2 lg:right-[15px]"
        >
          <img
            src="/icons/visibility-off.svg"
            alt="Toggle password"
            className="h-[14px] w-[14px] lg:h-[17px] lg:w-[17px]"
          />
        </button>
      </div>
    </div>
  );
}

interface AccountTypeSelectorProps {
  accountType: AccountType;
  onSelect: (type: AccountType) => void;
}

export function AccountTypeSelector({ accountType, onSelect }: AccountTypeSelectorProps) {
  return (
    <div className="mt-[20px] lg:mt-[34px]">
      <p className="text-[12px] font-normal text-foreground pl-[10px] lg:text-[16px]">
        Select Account Type:
      </p>

      <label className="mt-[8px] flex items-center gap-[12px] pl-[10px] cursor-pointer lg:mt-[11px] lg:gap-[16px]">
        <button type="button" onClick={() => onSelect('creator')} className="flex-none">
          <img
            src={
              accountType === 'creator' ? '/icons/radio-checked.svg' : '/icons/radio-unchecked.svg'
            }
            alt=""
            className="h-[14px] w-[14px] lg:h-[16px] lg:w-[16px]"
          />
        </button>
        <span className="text-[10px] font-normal text-foreground lg:text-[12px]">
          I am a <span className="font-medium">Creator</span>
        </span>
      </label>

      <label className="mt-[8px] flex items-center gap-[12px] pl-[10px] cursor-pointer lg:mt-[11px] lg:gap-[16px]">
        <button type="button" onClick={() => onSelect('fan')} className="flex-none">
          <img
            src={accountType === 'fan' ? '/icons/radio-checked.svg' : '/icons/radio-unchecked.svg'}
            alt=""
            className="h-[14px] w-[14px] lg:h-[16px] lg:w-[16px]"
          />
        </button>
        <span className="text-[10px] font-normal text-foreground lg:text-[12px]">
          I am a <span className="font-medium">Fan</span>
        </span>
      </label>
    </div>
  );
}
