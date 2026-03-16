import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

interface Props {
  username: string;
  isFollowing: boolean;
  isSubscribed: boolean;
  followLoading: boolean;
  onFollow: () => void;
  onSubscribe: () => void;
}

export function ProfileActions({
  username,
  isFollowing,
  isSubscribed,
  followLoading,
  onFollow,
  onSubscribe,
}: Props) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
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
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const btnCls =
    'flex size-[36px] items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70 disabled:opacity-50';

  return (
    <div className="flex items-center gap-[8px]">
      {/* Follow / Unfollow */}
      <button
        onClick={onFollow}
        disabled={followLoading}
        title={isFollowing ? 'Unfollow' : 'Follow'}
        className={btnCls}
      >
        {isFollowing ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        )}
      </button>

      {/* Subscribe (star) */}
      <button
        onClick={onSubscribe}
        title={isSubscribed ? 'Subscribed' : 'Subscribe'}
        className={`flex size-[36px] items-center justify-center rounded-full transition-colors ${
          isSubscribed ? 'bg-yellow-500/90 text-white' : 'bg-black/50 text-white hover:bg-black/70'
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      </button>

      {/* Message */}
      <button
        onClick={() => navigate(`/messages?user=${username}`)}
        title="Message"
        className={btnCls}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
        </svg>
      </button>

      {/* Share */}
      <button onClick={handleShare} title={copied ? 'Copied!' : 'Share'} className={btnCls}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92S19.61 16.08 18 16.08z" />
        </svg>
      </button>
    </div>
  );
}
