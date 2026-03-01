import { useRef } from 'react';

interface Props {
  digits: string[];
  onChange: (digits: string[]) => void;
  onComplete: (code: string) => void;
  disabled?: boolean;
}

export default function OtpInput({ digits, onChange, onComplete, disabled }: Props) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleDigit = (idx: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[idx] = value;
    onChange(next);
    if (value && idx < 5) inputRefs.current[idx + 1]?.focus();
    if (value && idx === 5) {
      const code = next.join('');
      if (code.length === 6) onComplete(code);
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const next = pasted.split('');
      onChange(next);
      onComplete(pasted);
    }
  };

  return (
    <div className="flex justify-center gap-[8px]">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          disabled={disabled}
          onChange={(e) => handleDigit(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          className="size-[48px] rounded-[8px] bg-muted text-center text-[20px] font-medium text-foreground outline-none focus:ring-2 focus:ring-[#01adf1] disabled:opacity-50"
        />
      ))}
    </div>
  );
}
