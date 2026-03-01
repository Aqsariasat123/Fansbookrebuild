import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import OtpInput from '../components/shared/OtpInput';

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { userId?: string; email?: string } | null;
  const userId = state?.userId;
  const email = state?.email;

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);

  // Mask email for display
  useEffect(() => {
    if (email) {
      const [local, domain] = email.split('@');
      setMaskedEmail(
        `${local[0]}${local[1] || ''}${'*'.repeat(Math.min(local.length - 2, 5))}@${domain}`,
      );
    }
  }, [email]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => setCountdown((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = useCallback(
    async (code: string) => {
      if (!userId) return;
      setStatus('loading');
      setError('');
      try {
        await api.post('/auth/verify-email', { userId, otp: code });
        setStatus('success');
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
          'Invalid or expired code';
        setError(msg);
        setStatus('error');
        setDigits(['', '', '', '', '', '']);
      }
    },
    [userId],
  );

  const handleResend = async () => {
    if (!userId || resending) return;
    setResending(true);
    try {
      const { data } = await api.post('/auth/resend-otp', { userId });
      if (data.data?.maskedEmail) setMaskedEmail(data.data.maskedEmail);
      setCountdown(300);
      setCanResend(false);
      setError('');
      setDigits(['', '', '', '', '', '']);
    } catch {
      setError('Failed to resend code. Try again later.');
    } finally {
      setResending(false);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (!userId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted px-4 font-outfit">
        <div className="w-full max-w-[420px] rounded-[22px] bg-card px-8 py-10 flex flex-col items-center">
          <p className="text-foreground">No verification session found.</p>
          <Link
            to="/login"
            className="mt-4 flex h-[49px] w-full items-center justify-center rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] text-[16px] font-medium text-foreground hover:opacity-90"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4 font-outfit">
      <div className="w-full max-w-[420px] rounded-[22px] bg-card px-8 py-10 flex flex-col items-center">
        <img src="/icons/dashboard/fansbook-logo.webp" alt="Fansbook" className="h-10 mb-8" />

        {status === 'success' ? (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <svg
                className="h-8 w-8 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="mt-4 text-[24px] font-medium text-foreground">
              Email Verified Successfully!
            </h1>
            <p className="mt-2 text-[14px] text-muted-foreground">Your email has been confirmed.</p>
            <button
              onClick={() => navigate('/feed')}
              className="mt-6 flex h-[49px] w-full items-center justify-center rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] text-[16px] font-medium text-foreground hover:opacity-90"
            >
              Continue to Feed
            </button>
          </>
        ) : (
          <>
            <h1 className="text-[24px] font-medium text-foreground">Verify Your Email</h1>
            <p className="mt-2 text-center text-[14px] text-muted-foreground">
              We sent a 6-digit code to{' '}
              <span className="text-foreground font-medium">{maskedEmail}</span>
            </p>

            <div className="mt-6 w-full">
              <OtpInput
                digits={digits}
                onChange={setDigits}
                onComplete={handleVerify}
                disabled={status === 'loading'}
              />
            </div>

            {status === 'loading' && (
              <div className="mt-4 flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#01adf1] border-t-transparent" />
                <span className="text-[13px] text-muted-foreground">Verifying...</span>
              </div>
            )}

            {error && <p className="mt-3 text-center text-[13px] text-red-400">{error}</p>}

            <div className="mt-6 flex flex-col items-center gap-2">
              {!canResend ? (
                <p className="text-[13px] text-muted-foreground">
                  Code expires in{' '}
                  <span className="font-medium text-foreground">{formatTime(countdown)}</span>
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="text-[13px] text-[#01adf1] hover:underline disabled:opacity-50"
                >
                  {resending ? 'Sending...' : 'Resend Code'}
                </button>
              )}
            </div>

            <Link to="/login" className="mt-6 text-[14px] text-primary hover:underline">
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
