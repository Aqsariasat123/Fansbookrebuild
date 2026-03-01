import { useNavigate, useLocation } from 'react-router-dom';
import { validate2FA } from '../lib/auth';
import { useAuthStore } from '../stores/authStore';
import TwoFactorForm from '../components/two-factor/TwoFactorForm';

export default function TwoFactorVerify() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { userId?: string; rememberMe?: boolean } | null;
  const userId = state?.userId;
  const rememberMe = state?.rememberMe;
  const setUser = useAuthStore((s) => s.setUser);

  const handleVerify = async (body: {
    userId: string;
    code?: string;
    backupCode?: string;
    rememberMe?: boolean;
  }) => {
    const res = await validate2FA(body);
    setUser(res.data.user as never);
    navigate('/feed');
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
      <TwoFactorForm userId={userId} rememberMe={rememberMe} onVerify={handleVerify} />
    </div>
  );
}
