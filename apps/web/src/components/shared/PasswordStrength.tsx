interface Props {
  password: string;
}

function getStrength(password: string): { level: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { level: 1, label: 'Weak', color: '#ef4444' };
  if (score <= 3) return { level: 2, label: 'Fair', color: '#f59e0b' };
  if (score <= 4) return { level: 3, label: 'Strong', color: '#22c55e' };
  return { level: 4, label: 'Very Strong', color: '#10b981' };
}

export default function PasswordStrength({ password }: Props) {
  if (!password) return null;
  const { level, label, color } = getStrength(password);

  return (
    <div className="mt-[6px]">
      <div className="flex gap-[4px]">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-[3px] flex-1 rounded-full transition-colors"
            style={{ backgroundColor: i <= level ? color : '#333' }}
          />
        ))}
      </div>
      <p className="mt-[2px] text-[10px] lg:text-[11px]" style={{ color }}>
        {label}
      </p>
    </div>
  );
}
