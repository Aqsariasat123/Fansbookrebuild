import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UpcomingLive } from '@fansbook/shared';
import { api } from '../../lib/api';

export function UpcomingCard({ s }: { s: UpcomingLive }) {
  const navigate = useNavigate();
  const [notified, setNotified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAlready, setShowAlready] = useState(false);

  async function doNotify() {
    setShowConfirm(false);
    setLoading(true);
    try {
      await api.post(`/followers/${s.creatorId}`);
      setNotified(true);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 401) {
        navigate('/login');
        return;
      }
      if (status === 409) setNotified(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex w-full flex-col overflow-hidden rounded-[22px] bg-card">
        {/* Thumbnail / banner */}
        <div className="relative h-[140px] w-full bg-gradient-to-br from-[#01adf1]/20 to-[#a61651]/20">
          {s.thumbnail ? (
            <img src={s.thumbnail} alt={s.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-muted-foreground/40"
              >
                <path d="M15 10l4.55-2.5A1 1 0 0121 8.5v7a1 1 0 01-1.45.9L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
              </svg>
            </div>
          )}
          {/* Date/time badge — bigger */}
          <div className="absolute left-[10px] top-[10px] flex items-center gap-[6px] rounded-[6px] bg-black/70 px-[10px] py-[6px]">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#01adf1"
              strokeWidth="2.5"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span className="font-outfit text-[13px] font-semibold text-white">
              {new Date(s.scheduledAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}{' '}
              {new Date(s.scheduledAt).toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          {s.category && (
            <div className="absolute right-[10px] top-[10px] rounded-[6px] bg-[#01adf1]/90 px-[10px] py-[5px]">
              <span className="font-outfit text-[12px] font-semibold text-white">{s.category}</span>
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="flex flex-1 flex-col gap-[8px] px-[14px] py-[12px]">
          <div className="flex items-center gap-[8px]">
            <div className="h-[32px] w-[32px] shrink-0 overflow-hidden rounded-full bg-muted">
              {s.avatar ? (
                <img src={s.avatar} alt={s.username} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[12px] font-bold text-muted-foreground">
                  {s.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate font-outfit text-[13px] font-semibold text-foreground">
                {s.displayName}
              </p>
              <p className="truncate font-outfit text-[11px] text-muted-foreground">
                @{s.username}
              </p>
            </div>
          </div>
          <p className="line-clamp-2 font-outfit text-[13px] font-medium text-foreground">
            {s.title}
          </p>
          {s.description && (
            <p className="line-clamp-2 font-outfit text-[11px] text-muted-foreground">
              {s.description}
            </p>
          )}
          <div className="mt-auto flex gap-[8px] pt-[4px]">
            <button
              onClick={() => navigate(`/u/${s.username}`)}
              className="flex-1 rounded-[8px] border border-border py-[7px] font-outfit text-[12px] text-foreground hover:bg-muted"
            >
              View Profile
            </button>
            <button
              disabled={loading}
              onClick={() => (notified ? setShowAlready(true) : setShowConfirm(true))}
              className={`flex-1 rounded-[8px] py-[7px] font-outfit text-[12px] font-medium transition-opacity disabled:opacity-50 ${notified ? 'border border-primary bg-primary/10 text-primary' : 'bg-gradient-to-r from-[#01adf1] to-[#a61651] text-white hover:opacity-90'}`}
            >
              {notified ? 'Notified ✓' : 'Notify me'}
            </button>
          </div>
        </div>
      </div>

      {/* Confirm popup */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-[16px]"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="w-full max-w-[380px] rounded-[16px] bg-card p-[24px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-[8px] text-[18px] font-semibold text-foreground">Get Notified?</h3>
            <p className="mb-[4px] text-[14px] text-muted-foreground">
              You'll follow <span className="font-medium text-foreground">@{s.username}</span> and
              get notified when their live starts.
            </p>
            <p className="mb-[20px] text-[13px] font-medium text-foreground">
              "{s.title}" —{' '}
              {new Date(s.scheduledAt).toLocaleString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <div className="flex gap-[10px]">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-[50px] border border-border py-[10px] text-[14px] text-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={doNotify}
                className="flex-1 rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[10px] text-[14px] font-medium text-white hover:opacity-90"
              >
                Yes, Notify me
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Already notified popup */}
      {showAlready && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-[16px]"
          onClick={() => setShowAlready(false)}
        >
          <div
            className="w-full max-w-[340px] rounded-[16px] bg-card p-[24px] text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-[12px] flex size-[48px] items-center justify-center rounded-full bg-primary/10">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#01adf1"
                strokeWidth="2"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <h3 className="mb-[6px] text-[16px] font-semibold text-foreground">
              Already Notified!
            </h3>
            <p className="mb-[20px] text-[13px] text-muted-foreground">
              You're already following{' '}
              <span className="font-medium text-foreground">@{s.username}</span> and will be
              notified when they go live.
            </p>
            <button
              onClick={() => setShowAlready(false)}
              className="w-full rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[10px] text-[14px] font-medium text-white hover:opacity-90"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
