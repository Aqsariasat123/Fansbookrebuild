import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';

export function SettingsBecomeCreator() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBecomeCreator = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/become-creator');
      if (data.data) setUser(data.data);
      navigate('/creator/profile');
    } catch {
      setError('Failed to upgrade account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role === 'CREATOR') {
    return (
      <div className="flex flex-col gap-[12px]">
        <p className="text-[16px] font-medium text-foreground">Creator Account</p>
        <p className="text-[13px] text-green-400">
          You already have a creator account! Go to your creator dashboard to manage your content.
        </p>
        <button
          onClick={() => navigate('/creator/profile')}
          className="w-fit rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[24px] py-[10px] text-[14px] font-medium text-white hover:opacity-90"
        >
          Go to Creator Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[16px]">
      <p className="text-[16px] font-medium text-foreground">Become a Creator</p>
      <p className="text-[13px] text-muted-foreground">
        Upgrade your account to start creating content, set subscription tiers, and earn from your
        fans. You can always switch back.
      </p>

      <div className="rounded-[12px] bg-muted p-[16px]">
        <p className="text-[14px] font-medium text-foreground mb-[8px]">What you get:</p>
        <ul className="flex flex-col gap-[6px] text-[13px] text-muted-foreground">
          <li>- Post exclusive content for subscribers</li>
          <li>- Set up subscription tiers and pricing</li>
          <li>- Receive tips from fans</li>
          <li>- Go live and interact in real-time</li>
          <li>- Access creator analytics dashboard</li>
        </ul>
      </div>

      {error && <p className="text-[13px] text-red-400">{error}</p>}

      <button
        onClick={handleBecomeCreator}
        disabled={loading}
        className="w-fit rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[24px] py-[10px] text-[14px] font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {loading ? 'Upgrading...' : 'Become a Creator'}
      </button>
    </div>
  );
}
