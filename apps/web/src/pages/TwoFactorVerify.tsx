import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../lib/api';

export default function TwoFactorVerify() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = (location.state as { userId?: string })?.userId;
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [useBackup, setUseBackup] = useState(false);
  const [backupCode, setBackupCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleDigit = (idx: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[idx] = value;
    setDigits(next);
    if (value && idx < 5) inputRefs.current[idx + 1]?.focus();
    // Auto-submit on 6th digit
    if (value && idx === 5) {
      const code = next.join('');
      if (code.length === 6) submitCode(code);
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const submitCode = async (code?: string) => {
    setLoading(true);
    setError('');
    try {
      const body = useBackup ? { userId, backupCode } : { userId, code: code || digits.join('') };
      await api.post('/auth/2fa/verify', body);
      navigate('/feed');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Verification failed');
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-[16px]">
        <div className="text-center">
          <p className="text-foreground">Session expired. Please log in again.</p>
          <button onClick={() => navigate('/login')} className="mt-4 text-[#01adf1] underline">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-[16px]">
      <div className="w-full max-w-[400px] rounded-[22px] bg-card p-[24px]">
        <h1 className="text-center text-[20px] font-semibold text-foreground">
          Two-Factor Authentication
        </h1>
        <p className="mt-[8px] text-center text-[13px] text-muted-foreground">
          {useBackup ? 'Enter a backup code' : 'Enter the 6-digit code from your authenticator app'}
        </p>

        {!useBackup ? (
          <div className="mt-[24px] flex justify-center gap-[8px]">
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
                onChange={(e) => handleDigit(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="size-[48px] rounded-[8px] bg-muted text-center text-[20px] font-medium text-foreground outline-none focus:ring-2 focus:ring-[#01adf1]"
              />
            ))}
          </div>
        ) : (
          <input
            value={backupCode}
            onChange={(e) => setBackupCode(e.target.value)}
            placeholder="Enter backup code"
            className="mt-[24px] w-full rounded-[8px] bg-muted px-[12px] py-[12px] text-center text-[16px] text-foreground outline-none"
          />
        )}

        {error && <p className="mt-[12px] text-center text-[13px] text-red-400">{error}</p>}

        {useBackup && (
          <button
            onClick={() => submitCode()}
            disabled={loading || !backupCode}
            className="mt-[16px] w-full rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[10px] text-[14px] font-medium text-white disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        )}

        <button
          onClick={() => {
            setUseBackup(!useBackup);
            setError('');
          }}
          className="mt-[16px] block w-full text-center text-[13px] text-[#01adf1] hover:underline"
        >
          {useBackup ? 'Use authenticator code instead' : 'Use a backup code'}
        </button>
      </div>
    </div>
  );
}
