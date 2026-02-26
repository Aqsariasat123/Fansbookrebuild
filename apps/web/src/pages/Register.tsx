import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerApi } from '../lib/auth';
import { useAuthStore } from '../stores/authStore';

type AccountType = 'creator' | 'fan';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [accountType, setAccountType] = useState<AccountType>('fan');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await registerApi({
        username,
        email,
        password,
        confirmPassword,
        accountType,
      });
      setUser(res.data.user as never);
      navigate('/feed');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex h-screen w-screen overflow-hidden font-outfit">
      {/* Mobile: full-screen background image */}
      <img
        src="/images/signup-hero.webp"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[center_20%] lg:hidden"
      />

      {/* Desktop: plain bg + hero on right */}
      <div className="absolute inset-0 hidden bg-[#f8f8f8] lg:block" />

      {/* Form */}
      <div className="relative z-10 flex w-full items-center justify-center overflow-y-auto px-[20px] lg:flex-1 lg:px-0">
        <div className="w-full max-w-[374px] flex flex-col items-center rounded-[22px] bg-[#f8f8f8] px-[22px] py-[21px] lg:max-w-[392px] lg:rounded-none lg:bg-transparent lg:px-0 lg:py-10 lg:shadow-none">
          {/* Heading */}
          <div className="w-full text-center lg:max-w-[500px]">
            <h1 className="font-medium text-[36px] leading-[1.25] text-[#15191c] lg:text-[48px]">
              <span className="block">Create Your</span>
              <span className="block whitespace-nowrap">FansBook Account</span>
            </h1>
            <p className="mt-[14px] text-[12px] font-normal leading-[1.25] text-[#15191c] lg:mt-[27px] lg:text-[16px]">
              Complete your profile to get started and discover top creators.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-[12px] w-full max-w-full rounded-[12px] bg-red-50 border border-red-200 px-4 py-3 text-[13px] text-red-600 lg:mt-[16px] lg:w-[380px]">
              {error}
            </div>
          )}

          {/* Form */}
          <form
            className="mt-[16px] w-full max-w-full flex flex-col lg:mt-[35px] lg:w-[380px]"
            onSubmit={handleSubmit}
          >
            {/* Username */}
            <div>
              <label className="block text-[12px] font-normal text-[#15191c] lg:text-[16px]">
                Username
              </label>
              <div className="mt-[6px] lg:mt-[8px]">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username..."
                  className="h-[38px] w-full rounded-[46px] border-[0.77px] border-[#15191c] bg-transparent px-[12px] text-[10px] font-normal text-[#15191c] placeholder:text-[#b4b4b4] focus:outline-none focus:border-[#01adf1] lg:h-[49px] lg:rounded-[59px] lg:border lg:px-[12px] lg:py-[17px] lg:text-[12px]"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="mt-[12px] lg:mt-[20px]">
              <label className="block text-[12px] font-normal text-[#15191c] lg:text-[16px]">
                Email
              </label>
              <div className="mt-[6px] lg:mt-[8px]">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your Email..."
                  className="h-[38px] w-full rounded-[46px] border-[0.77px] border-[#15191c] bg-transparent px-[12px] text-[10px] font-normal text-[#15191c] placeholder:text-[#b4b4b4] focus:outline-none focus:border-[#01adf1] lg:h-[49px] lg:rounded-[59px] lg:border lg:px-[12px] lg:py-[17px] lg:text-[12px]"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="mt-[12px] lg:mt-[20px]">
              <label className="block text-[12px] font-normal text-[#15191c] lg:text-[16px]">
                Password
              </label>
              <div className="mt-[6px] relative lg:mt-[8px]">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password..."
                  className="h-[38px] w-full rounded-[46px] border-[0.77px] border-[#15191c] bg-transparent px-[12px] pr-[40px] text-[10px] font-normal text-[#15191c] placeholder:text-[#b4b4b4] focus:outline-none focus:border-[#01adf1] lg:h-[49px] lg:rounded-[59px] lg:border lg:px-[12px] lg:py-[17px] lg:pr-[48px] lg:text-[12px]"
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
            </div>

            {/* Confirm Password */}
            <div className="mt-[12px] lg:mt-[20px]">
              <label className="block text-[12px] font-normal text-[#15191c] lg:text-[16px]">
                Confirm Password
              </label>
              <div className="mt-[6px] relative lg:mt-[8px]">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Enter your password..."
                  className="h-[38px] w-full rounded-[46px] border-[0.77px] border-[#15191c] bg-transparent px-[12px] pr-[40px] text-[10px] font-normal text-[#15191c] placeholder:text-[#b4b4b4] focus:outline-none focus:border-[#01adf1] lg:h-[49px] lg:rounded-[59px] lg:border lg:px-[12px] lg:py-[17px] lg:pr-[48px] lg:text-[12px]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-[12px] top-1/2 -translate-y-1/2 lg:right-[15px]"
                >
                  <img
                    src="/icons/visibility-off.svg"
                    alt="Toggle password"
                    className="h-[14px] w-[14px] lg:h-[17px] lg:w-[17px]"
                  />
                </button>
              </div>
            </div>

            {/* Select Account Type */}
            <div className="mt-[20px] lg:mt-[34px]">
              <p className="text-[12px] font-normal text-[#15191c] pl-[10px] lg:text-[16px]">
                Select Account Type:
              </p>

              <label className="mt-[8px] flex items-center gap-[12px] pl-[10px] cursor-pointer lg:mt-[11px] lg:gap-[16px]">
                <button
                  type="button"
                  onClick={() => setAccountType('creator')}
                  className="flex-none"
                >
                  <img
                    src={accountType === 'creator' ? '/icons/radio-checked.svg' : '/icons/radio-unchecked.svg'}
                    alt=""
                    className="h-[14px] w-[14px] lg:h-[16px] lg:w-[16px]"
                  />
                </button>
                <span className="text-[10px] font-normal text-[#15191c] lg:text-[12px]">
                  I am a <span className="font-medium">Creator</span>
                </span>
              </label>

              <label className="mt-[8px] flex items-center gap-[12px] pl-[10px] cursor-pointer lg:mt-[11px] lg:gap-[16px]">
                <button
                  type="button"
                  onClick={() => setAccountType('fan')}
                  className="flex-none"
                >
                  <img
                    src={accountType === 'fan' ? '/icons/radio-checked.svg' : '/icons/radio-unchecked.svg'}
                    alt=""
                    className="h-[14px] w-[14px] lg:h-[16px] lg:w-[16px]"
                  />
                </button>
                <span className="text-[10px] font-normal text-[#15191c] lg:text-[12px]">
                  I am a <span className="font-medium">Fan</span>
                </span>
              </label>
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-[20px] h-[38px] w-full rounded-[46px] bg-gradient-to-r from-[#01adf1] to-[#a61651] text-[16px] font-normal text-[#f8f8f8] text-center transition-opacity hover:opacity-90 disabled:opacity-60 lg:mt-[34px] lg:h-[49px] lg:rounded-[59px] lg:text-[20px]"
            >
              {loading ? 'Creating account...' : 'Signup'}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-[16px] text-[12px] font-normal text-[#15191c] lg:mt-[40px] lg:text-[16px]">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-[#01adf1] hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Right: Hero Image — desktop only */}
      <div
        className="hidden lg:block flex-none relative overflow-hidden"
        style={{ width: 'min(48%, calc(100vh * 0.68))' }}
      >
        <img
          src="/images/signup-hero.webp"
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            height: '100%',
            width: 'auto',
            maxWidth: 'none',
            transform: 'scaleX(-1)',
          }}
        />
        {/* Diagonal overlay to create angled left edge */}
        <div
          className="absolute top-0 left-0 bottom-0"
          style={{
            width: '12%',
            background: '#f8f8f8',
            clipPath: 'polygon(0% 0%, 100% 0%, 0% 100%)',
          }}
        />
      </div>
    </div>
  );
}
