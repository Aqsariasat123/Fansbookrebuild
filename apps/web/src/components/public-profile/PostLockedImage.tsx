import { useState } from 'react';
import { api, withWatermark } from '../../lib/api';

interface MediaItem {
  id: string;
  url: string;
  type: string;
}

function LockIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="white" className="opacity-90">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z" />
    </svg>
  );
}

function SparkleOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-[16px]">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute h-[6px] w-[6px] rounded-full bg-white"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
            animation: `sparkle 0.6s ease-out ${i * 0.05}s forwards`,
            opacity: 0,
          }}
        />
      ))}
      <div
        className="absolute inset-0 rounded-[16px] bg-white"
        style={{ animation: 'flashReveal 0.5s ease-out forwards' }}
      />
    </div>
  );
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
            className="flex items-center gap-[6px] rounded-[20px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[18px] py-[8px] text-[14px] font-semibold text-white shadow-lg transition-opacity hover:opacity-90"
          >
            <span className="text-[16px]">🪙</span>
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
      setTimeout(() => {
        setUnlocking(false);
        setUnlocked(true);
        onUnlocked?.();
      }, 700);
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
          <LockedOverlay ppvPrice={ppvPrice} onUnlockClick={() => setConfirming(true)} />
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
