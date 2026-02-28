import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4 font-outfit">
      <div className="w-full max-w-[420px] rounded-[22px] bg-card px-8 py-10 flex flex-col items-center">
        <img src="/icons/dashboard/fansbook-logo.webp" alt="Fansbook" className="h-10 mb-8" />
        <h1 className="text-[28px] font-medium text-foreground">Forgot Password</h1>
        <p className="mt-2 text-center text-[14px] text-muted-foreground">
          Enter your email to receive a password reset link
        </p>

        {error && (
          <div className="mt-5 w-full rounded-[12px] border border-red-500/30 bg-red-500/10 px-4 py-3 text-[13px] text-red-400">
            {error}
          </div>
        )}

        {sent ? (
          <div className="mt-6 w-full rounded-[12px] border border-green-500/30 bg-green-500/10 px-4 py-3 text-center text-[14px] text-green-400">
            If an account exists, a reset link has been sent.
          </div>
        ) : (
          <form className="mt-6 w-full" onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email..."
              required
              className="w-full rounded-[52px] border border-border bg-muted px-[20px] py-[12px] text-[14px] text-foreground placeholder:text-muted-foreground focus:border-[#01adf1] focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-5 h-[49px] w-full rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] text-[16px] font-medium text-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
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
