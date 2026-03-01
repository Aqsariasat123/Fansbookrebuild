import { useState } from 'react';
import { api } from '../../lib/api';

interface Props {
  userId: string;
  initialFollowing?: boolean;
  size?: 'sm' | 'md';
  onToggle?: (following: boolean) => void;
}

export default function FollowButton({
  userId,
  initialFollowing = false,
  size = 'md',
  onToggle,
}: Props) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    const next = !following;
    setFollowing(next); // Optimistic

    try {
      if (next) {
        await api.post(`/followers/${userId}`);
      } else {
        await api.delete(`/followers/${userId}`);
      }
      onToggle?.(next);
    } catch {
      setFollowing(!next); // Revert on error
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses =
    size === 'sm' ? 'px-[14px] py-[4px] text-[11px]' : 'px-[20px] py-[6px] text-[13px]';

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`rounded-[50px] font-medium transition-colors disabled:opacity-50 ${sizeClasses} ${
        following
          ? 'bg-muted text-foreground hover:bg-red-500/20 hover:text-red-400'
          : 'bg-gradient-to-r from-[#01adf1] to-[#a61651] text-white'
      }`}
    >
      {following ? 'Following' : 'Follow'}
    </button>
  );
}
