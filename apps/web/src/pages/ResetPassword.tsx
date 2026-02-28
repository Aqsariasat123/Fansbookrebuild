import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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

        {error && (
          <div className="mt-5 w-full rounded-[12px] border border-red-500/30 bg-red-500/10 px-4 py-3 text-[13px] text-red-400">
            {error}
          </div>
        )}

        {success ? (
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
        ) : (
          <form className="mt-6 w-full" onSubmit={handleSubmit}>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password..."
              required
              minLength={8}
              className={inputClass}
            />
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

        <Link to="/login" className="mt-6 text-[14px] text-primary hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
}
