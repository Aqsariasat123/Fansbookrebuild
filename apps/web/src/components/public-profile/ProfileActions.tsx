import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TipModal } from '../shared/TipModal';
import { useAuthStore } from '../../stores/authStore';

interface Props {
  profileId: string;
  username: string;
  displayName: string;
  isFollowing: boolean;
  isSubscribed: boolean;
  followLoading: boolean;
  amazonLink?: string | null;
  onFollow: () => void;
  onSubscribe: () => void;
}

export function ProfileActions({
  profileId,
  username,
  displayName,
  isFollowing,
  isSubscribed,
  followLoading,
  amazonLink,
  onFollow,
  onSubscribe,
}: Props) {
  const navigate = useNavigate();
  const [showTip, setShowTip] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const currentUser = useAuthStore((s) => s.user);

  const handleShare = async () => {
    const url = `${window.location.origin}/u/${username}?ref=${currentUser?.id ?? ''}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

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
        {isSubscribed ? (
          <span className="rounded-[11px] bg-green-600/20 border border-green-500 px-[36px] py-[12px] text-[16px] font-medium text-green-400">
            Subscribed
          </span>
        ) : (
          <button
            onClick={onSubscribe}
            className="rounded-[11px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[36px] py-[12px] text-[16px] font-medium text-white shadow-[0px_6px_10px_rgba(34,34,34,0.25)] transition-opacity hover:opacity-90"
          >
            Subscribe
          </button>
        )}
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
        {amazonLink && (
          <a
            href={amazonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-[6px] rounded-[11px] border border-border px-[20px] py-[12px] text-[16px] font-medium text-foreground transition-colors hover:border-[#FF9900]"
            title="Amazon Store"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.1 17 7 17h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 23.45 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
            Amazon Store
          </a>
        )}
        <button
          onClick={handleShare}
          className="flex items-center gap-[6px] rounded-[11px] border border-border px-[20px] py-[12px] text-[16px] font-medium text-foreground transition-colors hover:border-foreground"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92S19.61 16.08 18 16.08z" />
          </svg>
          {shareCopied ? 'Copied!' : 'Share'}
        </button>
      </div>

      {!isSubscribed && (
        <button
          onClick={onSubscribe}
          className="mt-[16px] flex w-full items-center justify-between rounded-[11px] border border-border px-[20px] py-[14px] text-[16px] text-foreground transition-colors hover:border-foreground"
        >
          View Subscription Plans
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
          </svg>
        </button>
      )}

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
