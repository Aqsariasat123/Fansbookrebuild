interface FieldProps {
  label: string;
  value: string;
  onChange?: (val: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  inputCls: string;
}

export function ProfileField({
  label,
  value,
  onChange,
  readOnly,
  placeholder,
  inputCls,
}: FieldProps) {
  return (
    <div>
      <label className="mb-[6px] block font-outfit text-[16px] font-normal text-black">
        {label}
      </label>
      <input
        value={value}
        onChange={readOnly ? undefined : (e) => onChange?.(e.target.value)}
        className={`${inputCls} ${readOnly ? 'text-[#5d5d5d]' : ''}`}
        readOnly={readOnly}
        placeholder={placeholder}
      />
    </div>
  );
}
