import { useState } from 'react';
import { api, withWatermark } from '../../lib/api';
import { LockIcon } from './PostLockedVisuals';
import { SparkleOverlay } from '../shared/SparkleOverlay';
import { AmbientSparkles } from '../shared/AmbientSparkles';

interface MediaItem {
  id: string;
  url: string;
  type: string;
}

function LockedOverlay({
  ppvPrice,
  onUnlockClick,
}: {
  ppvPrice?: number | null;
  onUnlockClick?: () => void;
}) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-[12px] bg-black/50 backdrop-blur-[2px]">
      <LockIcon />
      {ppvPrice ? (
        <div className="flex flex-col items-center gap-[8px]">
          <span className="text-[13px] text-white/80">Pay per view</span>
          <button
            onClick={onUnlockClick}
            className="rounded-[20px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[18px] py-[8px] text-[14px] font-semibold text-white shadow-lg transition-opacity hover:opacity-90"
          >
            Unlock for {ppvPrice} coins
          </button>
        </div>
      ) : (
        <p className="rounded-[6px] bg-black/60 px-[14px] py-[6px] text-[13px] text-white">
          Subscribe to unlock
        </p>
      )}
    </div>
  );
}

function ConfirmUnlockModal({
  ppvPrice,
  loading,
  error,
  onConfirm,
  onCancel,
}: {
  ppvPrice: number;
  loading: boolean;
  error: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-[420px] rounded-[16px] border border-border bg-card p-[24px]"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[18px] font-semibold text-foreground">Unlock this content?</p>
        <p className="mt-[10px] text-[14px] text-muted-foreground">
          You'll be charged{' '}
          <span className="font-semibold text-foreground">🪙 {ppvPrice} coins</span> from your
          wallet to view this post.
        </p>
        {error && <p className="mt-[10px] text-[13px] text-red-400">{error}</p>}
        <div className="mt-[20px] flex gap-[10px]">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-[8px] border border-border py-[10px] text-[14px] text-foreground disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-[8px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[10px] text-[14px] font-semibold text-white disabled:opacity-50"
          >
            {loading ? 'Unlocking…' : 'Confirm & Unlock'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function PostLockedImage({
  image,
  ppvPrice,
  postId,
  onUnlocked,
}: {
  image: MediaItem;
  ppvPrice?: number | null;
  postId?: string;
  onUnlocked?: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');

  async function handleConfirm() {
    if (!ppvPrice || !postId) return;
    setLoading(true);
    setError('');
    try {
      await api.post(`/posts/${postId}/ppv-unlock`);
      setConfirming(false);
      setUnlocking(true);
      // Match the longest sparkle delay+duration so the burst plays in full
      setTimeout(() => {
        setUnlocking(false);
        setUnlocked(true);
        onUnlocked?.();
      }, 1100);
    } catch (err) {
      const e = err as { response?: { data?: { error?: string; message?: string } } };
      setError(e.response?.data?.error ?? e.response?.data?.message ?? 'Unlock failed');
    } finally {
      setLoading(false);
    }
  }

  if (unlocked) {
    return (
      <div className="relative mb-[14px] aspect-[3/4] w-[55%] max-w-[320px] overflow-hidden rounded-[16px] md:w-[45%] md:max-w-[380px]">
        <img
          src={withWatermark(image.url)}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <>
      <div className="relative mb-[14px] aspect-[3/4] w-[55%] max-w-[320px] overflow-hidden rounded-[16px] md:w-[45%] md:max-w-[380px]">
        <img src={image.url} alt="" className="h-full w-full object-cover blur-xl" />
        {unlocking && <SparkleOverlay />}
        {!unlocking && (
          <>
            <AmbientSparkles />
            <LockedOverlay ppvPrice={ppvPrice} onUnlockClick={() => setConfirming(true)} />
          </>
        )}
      </div>
      {confirming && ppvPrice && (
        <ConfirmUnlockModal
          ppvPrice={ppvPrice}
          loading={loading}
          error={error}
          onConfirm={handleConfirm}
          onCancel={() => {
            if (!loading) {
              setConfirming(false);
              setError('');
            }
          }}
        />
      )}
    </>
  );
}
