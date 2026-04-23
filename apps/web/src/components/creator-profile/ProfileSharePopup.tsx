import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../shared/NotificationToast';

interface ProfileSharePopupProps {
  username: string;
  pos: { top: number; right: number };
  onClose: () => void;
}

export function ProfileSharePopup({ username, pos, onClose }: ProfileSharePopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) onClose();
    };
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', keyHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', keyHandler);
    };
  }, [onClose]);

  const profileUrl = `${window.location.origin}/u/${username}`;

  const handleShareMessage = () => {
    navigator.clipboard.writeText(profileUrl).catch(() => {});
    showToast('Profile link copied — paste it in your message');
    navigate('/messages');
    onClose();
  };

  const handleShareVia = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `@${username} on Inscrio`, url: profileUrl });
        onClose();
      } catch {
        /* cancelled */
      }
    } else {
      try {
        await navigator.clipboard.writeText(profileUrl);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = profileUrl;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      showToast('Profile link copied!');
      onClose();
    }
  };

  const handleReferEarn = () => {
    navigate('/creator/referrals');
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        ref={popupRef}
        style={{ top: pos.top, right: pos.right }}
        className="fixed z-50 w-[226px] rounded-[16px] bg-card px-[20px] pb-[20px] pt-[16px] shadow-xl border border-border"
      >
        <div className="flex flex-col gap-[24px]">
          <button
            onClick={handleShareMessage}
            className="flex items-center gap-[12px] text-left hover:opacity-70 transition-opacity"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            <span className="text-[13px] text-foreground">Share profile via message</span>
          </button>

          <button
            onClick={handleShareVia}
            className="flex items-center gap-[12px] text-left hover:opacity-70 transition-opacity"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            <span className="text-[13px] text-foreground">Share profile via…</span>
          </button>

          <button
            onClick={handleReferEarn}
            className="flex items-center gap-[12px] text-left hover:opacity-70 transition-opacity"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
            <span className="text-[13px] text-foreground">Refer &amp; Earn</span>
          </button>
        </div>
      </div>
    </>
  );
}
