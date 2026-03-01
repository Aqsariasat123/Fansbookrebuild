import { useState } from 'react';
import OtpInput from '../shared/OtpInput';

function buildBody(
  useBackup: boolean,
  userId: string,
  backupCode: string,
  digits: string[],
  rememberMe?: boolean,
) {
  return useBackup
    ? { userId, backupCode, rememberMe }
    : { userId, code: digits.join(''), rememberMe };
}

export default function TwoFactorForm({
  userId,
  rememberMe,
  onVerify,
}: {
  userId: string;
  rememberMe?: boolean;
  onVerify: (body: {
    userId: string;
    code?: string;
    backupCode?: string;
    rememberMe?: boolean;
  }) => Promise<void>;
}) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [useBackup, setUseBackup] = useState(false);
  const [backupCode, setBackupCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submitCode = async (code?: string) => {
    setLoading(true);
    setError('');
    try {
      const body = code
        ? { userId, code, rememberMe }
        : buildBody(useBackup, userId, backupCode, digits, rememberMe);
      await onVerify(body);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg || 'Verification failed');
      setDigits(['', '', '', '', '', '']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[400px] rounded-[22px] bg-card p-[24px]">
      <h1 className="text-center text-[20px] font-semibold text-foreground">
        Two-Factor Authentication
      </h1>
      <p className="mt-[8px] text-center text-[13px] text-muted-foreground">
        {useBackup ? 'Enter a backup code' : 'Enter the 6-digit code from your authenticator app'}
      </p>

      {!useBackup ? (
        <div className="mt-[24px]">
          <OtpInput
            digits={digits}
            onChange={setDigits}
            onComplete={submitCode}
            disabled={loading}
          />
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

      <div className="mt-[16px] border-t border-border pt-[12px] text-center">
        <p className="text-[12px] text-muted-foreground">
          Lost access to your authenticator?{' '}
          <a href="/support" className="text-[#01adf1] hover:underline">
            Get help
          </a>
        </p>
      </div>
    </div>
  );
}
