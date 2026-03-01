import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import PasswordStrength from '../components/shared/PasswordStrength';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }
    api
      .post('/auth/validate-reset-token', { token })
      .then(({ data }) => setTokenValid(data.data.valid))
      .catch(() => setTokenValid(false));
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword });
      setSuccess(true);
    } catch {
      setError('Invalid or expired reset link. Please request a new one.');
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full rounded-[52px] border border-border bg-muted px-[20px] py-[12px] text-[14px] text-foreground placeholder:text-muted-foreground focus:border-[#01adf1] focus:outline-none';

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4 font-outfit">
      <div className="w-full max-w-[420px] rounded-[22px] bg-card px-8 py-10 flex flex-col items-center">
        <img src="/icons/dashboard/fansbook-logo.webp" alt="Fansbook" className="h-10 mb-8" />
        <h1 className="text-[28px] font-medium text-foreground">Reset Password</h1>

        {tokenValid === false && (
          <>
            <div className="mt-5 w-full rounded-[12px] border border-red-500/30 bg-red-500/10 px-4 py-3 text-[13px] text-red-400">
              This reset link is invalid or has expired. Please request a new one.
            </div>
            <Link
              to="/forgot-password"
              className="mt-5 flex h-[49px] w-full items-center justify-center rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] text-[16px] font-medium text-foreground hover:opacity-90"
            >
              Request New Link
            </Link>
          </>
        )}

        {tokenValid === null && (
          <div className="mt-6 flex items-center gap-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#01adf1] border-t-transparent" />
            <span className="text-[14px] text-muted-foreground">Validating reset link...</span>
          </div>
        )}

        {error && tokenValid && (
          <div className="mt-5 w-full rounded-[12px] border border-red-500/30 bg-red-500/10 px-4 py-3 text-[13px] text-red-400">
            {error}
          </div>
        )}

        {tokenValid && !success && (
          <form className="mt-6 w-full" onSubmit={handleSubmit}>
            <div>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password..."
                required
                minLength={8}
                className={inputClass}
              />
              <PasswordStrength password={newPassword} />
            </div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password..."
              required
              minLength={8}
              className={`${inputClass} mt-4`}
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-5 h-[49px] w-full rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] text-[16px] font-medium text-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        {success && (
          <>
            <div className="mt-6 w-full rounded-[12px] border border-green-500/30 bg-green-500/10 px-4 py-3 text-center text-[14px] text-green-400">
              Password reset successfully!
            </div>
            <Link
              to="/login"
              className="mt-5 flex h-[49px] w-full items-center justify-center rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] text-[16px] font-medium text-foreground hover:opacity-90"
            >
              Go to Login
            </Link>
          </>
        )}

        <Link to="/login" className="mt-6 text-[14px] text-primary hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
}
