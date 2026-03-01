import { useState } from 'react';
import { api } from '../../lib/api';

interface PPVOverlayProps {
  postId: string;
  price: number;
  thumbnailUrl?: string;
  onUnlocked: () => void;
}

export function PPVOverlay({ postId, price, thumbnailUrl, onUnlocked }: PPVOverlayProps) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUnlock = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post(`/posts/${postId}/ppv-unlock`);
      onUnlocked();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Failed to unlock');
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  return (
    <div className="relative flex aspect-[3/4] w-[55%] max-w-[320px] items-center justify-center overflow-hidden rounded-[12px] md:w-[45%] md:max-w-[380px] md:rounded-[22px]">
      {thumbnailUrl && (
        <img
          src={thumbnailUrl}
          alt=""
          className="absolute inset-0 size-full object-cover blur-[20px] brightness-50"
        />
      )}
      {!thumbnailUrl && <div className="absolute inset-0 bg-gradient-to-br from-muted to-card" />}

      <div className="relative z-10 flex flex-col items-center gap-[12px] text-center">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-white/80">
          <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
          <path
            d="M7 11V7a5 5 0 0110 0v4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <p className="text-[14px] font-medium text-white md:text-[18px]">Premium Content</p>
        <p className="text-[12px] text-white/70 md:text-[14px]">
          Unlock this post for ${price.toFixed(2)}
        </p>

        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            className="mt-[4px] rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[24px] py-[8px] text-[13px] font-medium text-white md:px-[32px] md:py-[10px] md:text-[15px]"
          >
            Unlock for ${price.toFixed(2)}
          </button>
        ) : (
          <div className="flex flex-col items-center gap-[8px]">
            <p className="text-[12px] text-white/80">Confirm purchase?</p>
            <div className="flex gap-[8px]">
              <button
                onClick={handleUnlock}
                disabled={loading}
                className="rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[20px] py-[6px] text-[12px] font-medium text-white disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Yes, Unlock'}
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="rounded-[50px] bg-white/20 px-[20px] py-[6px] text-[12px] text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {error && <p className="text-[12px] text-red-400">{error}</p>}
      </div>
    </div>
  );
}
