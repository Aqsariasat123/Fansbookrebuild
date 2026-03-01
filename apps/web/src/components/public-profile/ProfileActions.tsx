import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TipModal } from '../shared/TipModal';

interface Props {
  profileId: string;
  username: string;
  displayName: string;
  isFollowing: boolean;
  followLoading: boolean;
  onFollow: () => void;
  onSubscribe: () => void;
}

export function ProfileActions({
  profileId,
  username,
  displayName,
  isFollowing,
  followLoading,
  onFollow,
  onSubscribe,
}: Props) {
  const navigate = useNavigate();
  const [showTip, setShowTip] = useState(false);

  return (
    <>
      <div className="mt-[20px] flex flex-wrap items-center gap-[10px]">
        <button
          onClick={onFollow}
          disabled={followLoading}
          className={`rounded-[11px] border px-[36px] py-[12px] text-[16px] font-medium shadow-[0px_6px_10px_rgba(34,34,34,0.25)] transition-colors disabled:opacity-50 md:px-[48px] ${
            isFollowing
              ? 'border-[#01adf1] bg-[#01adf1]/10 text-primary'
              : 'border-border text-foreground hover:border-foreground'
          }`}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
        <button
          onClick={onSubscribe}
          className="rounded-[11px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[36px] py-[12px] text-[16px] font-medium text-white shadow-[0px_6px_10px_rgba(34,34,34,0.25)] transition-opacity hover:opacity-90"
        >
          Subscribe
        </button>
        <button
          onClick={() => navigate(`/messages?user=${username}`)}
          className="flex items-center gap-[6px] rounded-[11px] border border-border px-[20px] py-[12px] text-[16px] font-medium text-foreground transition-colors hover:border-foreground"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
          </svg>
          Message
        </button>
        <button
          onClick={() => setShowTip(true)}
          className="flex items-center gap-[6px] rounded-[11px] border border-border px-[20px] py-[12px] text-[16px] font-medium text-foreground transition-colors hover:border-foreground"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          Tip
        </button>
      </div>

      {/* View Subscription Plans */}
      <button
        onClick={onSubscribe}
        className="mt-[16px] flex w-full items-center justify-between rounded-[11px] border border-border px-[20px] py-[14px] text-[16px] text-foreground transition-colors hover:border-foreground"
      >
        View Subscription Plans
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
        </svg>
      </button>

      {showTip && (
        <TipModal
          receiverId={profileId}
          receiverName={displayName}
          onClose={() => setShowTip(false)}
        />
      )}
    </>
  );
}
