import { useEffect, useRef } from 'react';

interface ProfileSharePopupProps {
  username: string;
  onClose: () => void;
}

export function ProfileSharePopup({ username, onClose }: ProfileSharePopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

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
    window.location.href = `/messages?share=${encodeURIComponent(profileUrl)}`;
  };

  const handleShareVia = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `@${username} on Fansbook`, url: profileUrl });
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
    }
    onClose();
  };

  const handleReferEarn = () => {
    window.location.href = '/creator/referrals';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 md:items-center">
      <div
        ref={popupRef}
        className="w-full max-w-[226px] rounded-[22px] bg-card px-[25px] pb-[25px] pt-[16px] md:max-w-[280px]"
      >
        {/* Drag handle */}
        <div className="mx-auto mb-[20px] h-[2px] w-[60px] rounded-full bg-muted" />

        <div className="flex flex-col gap-[28px]">
          <button onClick={handleShareMessage} className="flex items-center gap-[12px] text-left">
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
            <span className="text-[12px] text-muted-foreground">Share profile via message</span>
          </button>

          <button onClick={handleShareVia} className="flex items-center gap-[12px] text-left">
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
            <span className="text-[12px] text-muted-foreground">Share profile via...</span>
          </button>

          <button onClick={handleReferEarn} className="flex items-center gap-[12px] text-left">
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
            <span className="text-[12px] text-muted-foreground">Refer & Earn</span>
          </button>
        </div>
      </div>
    </div>
  );
}
