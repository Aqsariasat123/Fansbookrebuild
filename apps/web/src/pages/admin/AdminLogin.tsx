import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '../../lib/auth';
import { useAuthStore } from '../../stores/authStore';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginApi({ emailOrUsername: email, password });
      const user = res.data.user as { role: string };
      if (user.role !== 'ADMIN') {
        setError('Access denied. Admin credentials required.');
        setLoading(false);
        return;
      }
      setUser(user as never);
      navigate('/admin/dashboard');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Login failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0e1012] font-outfit">
      <div className="w-full max-w-[420px] rounded-[22px] bg-white p-[32px]">
        <div className="mb-[24px] flex justify-center">
          <img src="/icons/dashboard/fansbook-logo.png" alt="Fansbook" className="h-[40px]" />
        </div>
        <h1 className="mb-[8px] text-center text-[24px] font-semibold text-[#333]">Admin Login</h1>
        <p className="mb-[24px] text-center text-[14px] text-[#666]">
          Sign in to the admin dashboard
        </p>

        {error && (
          <div className="mb-[16px] rounded-[8px] border border-red-200 bg-red-50 px-[14px] py-[10px] text-[13px] text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
          <div>
            <label className="mb-[6px] block text-[13px] font-medium text-[#333]">
              Email / Username
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email or username..."
              className="h-[44px] w-full rounded-[8px] border border-[#ddd] px-[12px] text-[14px] text-[#333] outline-none focus:border-[#01adf1]"
              required
            />
          </div>
          <div>
            <label className="mb-[6px] block text-[13px] font-medium text-[#333]">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password..."
                className="h-[44px] w-full rounded-[8px] border border-[#ddd] px-[12px] pr-[40px] text-[14px] text-[#333] outline-none focus:border-[#01adf1]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#999]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  {showPw ? (
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  ) : (
                    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-[8px] h-[44px] w-full rounded-[8px] bg-gradient-to-r from-[#01adf1] to-[#a61651] text-[15px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
