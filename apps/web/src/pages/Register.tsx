import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerApi } from '../lib/auth';
import { useAuthStore } from '../stores/authStore';
import { TextField, PasswordField, AccountTypeSelector } from './RegisterFormFields';

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
      const resData = (
        err as {
          response?: { data?: { error?: string; details?: { field: string; message: string }[] } };
        }
      )?.response?.data;
      let msg = resData?.error || 'Registration failed. Please try again.';
      if (resData?.details?.length) {
        msg = resData.details.map((d) => `${d.field}: ${d.message}`).join(', ');
      }
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
      <div className="absolute inset-0 hidden bg-card lg:block" />

      {/* Form */}
      <div className="relative z-10 flex w-full items-center justify-center overflow-y-auto px-[20px] lg:flex-1 lg:px-0">
        <div className="w-full max-w-[374px] flex flex-col items-center rounded-[22px] bg-card px-[22px] py-[21px] lg:max-w-[392px] lg:rounded-none lg:bg-transparent lg:px-0 lg:py-10 lg:shadow-none">
          {/* Heading */}
          <div className="w-full text-center lg:max-w-[500px]">
            <h1 className="font-medium text-[36px] leading-[1.25] text-foreground lg:text-[48px]">
              <span className="block">Create Your</span>
              <span className="block whitespace-nowrap">FansBook Account</span>
            </h1>
            <p className="mt-[14px] text-[12px] font-normal leading-[1.25] text-foreground lg:mt-[27px] lg:text-[16px]">
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
            <TextField
              label="Username"
              type="text"
              value={username}
              onChange={setUsername}
              placeholder="Enter your username..."
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="Enter your Email..."
              className="mt-[12px] lg:mt-[20px]"
            />
            <PasswordField
              label="Password"
              value={password}
              onChange={setPassword}
              placeholder="Enter your password..."
              show={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
              className="mt-[12px] lg:mt-[20px]"
            />
            <PasswordField
              label="Confirm Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Enter your password..."
              show={showConfirm}
              onToggle={() => setShowConfirm(!showConfirm)}
              className="mt-[12px] lg:mt-[20px]"
            />
            <AccountTypeSelector accountType={accountType} onSelect={setAccountType} />

            {/* Signup Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-[20px] h-[38px] w-full rounded-[46px] bg-gradient-to-r from-[#01adf1] to-[#a61651] text-[16px] font-normal text-foreground text-center transition-opacity hover:opacity-90 disabled:opacity-60 lg:mt-[34px] lg:h-[49px] lg:rounded-[59px] lg:text-[20px]"
            >
              {loading ? 'Creating account...' : 'Signup'}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-[16px] text-[12px] font-normal text-foreground lg:mt-[40px] lg:text-[16px]">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
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
