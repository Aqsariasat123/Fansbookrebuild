import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginApi } from '../lib/auth';
import { useAuthStore } from '../stores/authStore';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginApi({ emailOrUsername, password });
      setUser(res.data.user as never);
      navigate('/feed');
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
    <div className="relative flex h-screen w-screen overflow-hidden font-outfit">
      {/* Mobile: full-screen background image */}
      <img
        src="/images/login-hero.webp"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[center_20%] lg:hidden"
      />

      {/* Desktop: plain bg + clipped hero on left */}
      <div className="absolute inset-0 hidden bg-card lg:block" />
      <div
        className="hidden lg:block"
        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: '52%' }}
      >
        <img
          src="/images/login-hero.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            objectPosition: 'center 20%',
            clipPath: 'polygon(0% 0%, 88% 0%, 100% 100%, 0% 100%)',
          }}
        />
      </div>

      {/* Form */}
      <div className="relative z-10 flex w-full items-center justify-center px-[20px] lg:w-[54.77%] lg:ml-auto lg:px-0">
        <div className="w-full max-w-[336px] flex flex-col items-center rounded-[22px] bg-card px-[22px] py-[21px] lg:max-w-[392px] lg:rounded-none lg:bg-transparent lg:px-0 lg:py-0 lg:shadow-none">
          {/* Heading */}
          <div className="w-full text-center">
            <h1 className="font-medium text-[36px] leading-[1.25] text-foreground lg:text-[48px]">
              Welcome Back to FansBook
            </h1>
            <p className="mt-[21px] text-[12px] font-normal leading-[1.25] text-foreground lg:mt-[27px] lg:text-[16px]">
              Log in to connect with your favorite creators and unlock exclusive content.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-[20px] w-[380px] max-w-full rounded-[12px] bg-red-50 border border-red-200 px-4 py-3 text-[13px] text-red-600">
              {error}
            </div>
          )}

          {/* Form */}
          <form
            className="mt-[20px] w-full max-w-full flex flex-col lg:mt-[35px] lg:w-[380px]"
            onSubmit={handleSubmit}
          >
            {/* Email / Username */}
            <div>
              <label className="block text-[12px] font-normal text-foreground lg:text-[16px]">
                Email / Username
              </label>
              <div className="mt-[6px] lg:mt-[8px]">
                <input
                  type="text"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder="Enter your Email or username..."
                  className="h-[38px] w-full rounded-[46px] border-[0.77px] border-border bg-transparent px-[12px] text-[10px] font-normal text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#01adf1] lg:h-[49px] lg:rounded-[59px] lg:border lg:px-[12px] lg:py-[17px] lg:text-[12px]"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="mt-[14px] lg:mt-[20px]">
              <label className="block text-[12px] font-normal text-foreground lg:text-[16px]">
                Password
              </label>
              <div className="mt-[6px] relative lg:mt-[8px]">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password..."
                  className="h-[38px] w-full rounded-[46px] border-[0.77px] border-border bg-transparent px-[12px] pr-[40px] text-[10px] font-normal text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#01adf1] lg:h-[49px] lg:rounded-[59px] lg:border lg:px-[12px] lg:py-[17px] lg:pr-[48px] lg:text-[12px]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-[12px] top-1/2 -translate-y-1/2 lg:right-[15px]"
                >
                  <img
                    src="/icons/visibility-off.svg"
                    alt="Toggle password"
                    className="h-[14px] w-[14px] lg:h-[17px] lg:w-[17px]"
                  />
                </button>
              </div>
              <p className="mt-[6px] text-right lg:mt-[8px]">
                <Link
                  to="/forgot-password"
                  className="text-[10px] font-normal text-primary hover:underline lg:text-[12px]"
                >
                  Forgot Password?
                </Link>
              </p>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-[20px] h-[38px] w-full rounded-[46px] bg-gradient-to-r from-[#01adf1] to-[#a61651] text-[16px] font-normal text-foreground text-center transition-opacity hover:opacity-90 disabled:opacity-60 lg:mt-[34px] lg:h-[49px] lg:rounded-[59px] lg:text-[20px]"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-[20px] text-[12px] font-normal text-foreground lg:mt-[40px] lg:text-[16px]">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
