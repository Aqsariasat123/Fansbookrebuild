import { useState } from 'react';
import { api } from '../../lib/api';
import { formatMoney } from '../../lib/currency';
import { SparkleOverlay } from '../shared/SparkleOverlay';

interface PPVOverlayProps {
  postId: string;
  price: number;
  thumbnailUrl?: string;
  onUnlocked: () => void;
}

export function PPVOverlay({ postId, price, thumbnailUrl, onUnlocked }: PPVOverlayProps) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post(`/posts/${postId}/ppv-unlock`);
      setConfirming(false);
      // Play the spark-burst reveal, then swap in the unlocked post.
      setUnlocking(true);
      setTimeout(() => onUnlocked(), 1100);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string; message?: string } } };
      setError(e.response?.data?.error ?? e.response?.data?.message ?? 'Failed to unlock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative flex aspect-[3/4] w-[55%] max-w-[320px] items-center justify-center overflow-hidden rounded-[12px] md:w-[45%] md:max-w-[380px] md:rounded-[22px]">
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt=""
            className="absolute inset-0 size-full object-cover blur-[20px] brightness-50"
          />
        )}
        {!thumbnailUrl && <div className="absolute inset-0 bg-gradient-to-br from-muted to-card" />}
        {unlocking ? (
          <SparkleOverlay />
        ) : (
          <div className="relative z-10 flex flex-col items-center gap-[12px] text-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-white/80">
              <rect
                x="3"
                y="11"
                width="18"
                height="11"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M7 11V7a5 5 0 0110 0v4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <p className="text-[14px] font-medium text-white md:text-[18px]">Premium Content</p>
            <p className="text-[12px] text-white/70 md:text-[14px]">
              Unlock this post for {formatMoney(price)}
            </p>
            <button
              onClick={() => setConfirming(true)}
              className="mt-[4px] rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[24px] py-[8px] text-[13px] font-medium text-white md:px-[32px] md:py-[10px] md:text-[15px]"
            >
              Unlock for {formatMoney(price)}
            </button>
          </div>
        )}
      </div>
      {confirming && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={() => !loading && setConfirming(false)}
        >
          <div
            className="w-full max-w-[420px] rounded-[16px] border border-border bg-card p-[24px]"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[18px] font-semibold text-foreground">Unlock this content?</p>
            <p className="mt-[10px] text-[14px] text-muted-foreground">
              You'll be charged{' '}
              <span className="font-semibold text-foreground">{formatMoney(price)}</span> from your
              wallet to view this post.
            </p>
            {error && <p className="mt-[10px] text-[13px] text-red-400">{error}</p>}
            <div className="mt-[20px] flex gap-[10px]">
              <button
                onClick={() => !loading && setConfirming(false)}
                disabled={loading}
                className="flex-1 rounded-[8px] border border-border py-[10px] text-[14px] text-foreground disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 rounded-[8px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[10px] text-[14px] font-semibold text-white disabled:opacity-50"
              >
                {loading ? 'Unlocking…' : 'Confirm & Unlock'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
