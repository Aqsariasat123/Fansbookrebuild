import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../shared/NotificationToast';

interface ProfileSharePopupProps {
  username: string;
  pos: { top: number; right: number };
  onClose: () => void;
}

export function ProfileSharePopup({ username, pos, onClose }: ProfileSharePopupProps) {
  const isSharingRef = useRef(false);
  const openedAtRef = useRef(Date.now());
  const pointerMovedRef = useRef(false);
  const navigate = useNavigate();

  // Dismiss guard. On some PCs (one client tester's machine in particular) the
  // popup opened and then disappeared within ~700ms even with the earlier
  // 250ms guard — strongly suggests the hardware/driver was firing a phantom
  // mouse-up or extra click shortly after the opener click. We now require BOTH:
  //   (1) at least 500ms since the popup opened, AND
  //   (2) the user has actually moved the pointer at least once since open.
  // Phantom clicks fire without movement, so they fail check (2). A real user
  // dismiss (move mouse to backdrop, click) passes both. Escape and the
  // explicit Cancel paths bypass this — they were never the issue.
  const requestClose = useCallback(() => {
    if (isSharingRef.current) return;
    if (Date.now() - openedAtRef.current < 500) return;
    if (!pointerMovedRef.current) return;
    onClose();
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const onMove = () => {
      pointerMovedRef.current = true;
    };
    document.addEventListener('keydown', onKey);
    window.addEventListener('pointermove', onMove, { once: true });
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('pointermove', onMove);
    };
  }, [onClose]);

  const profileUrl = `${window.location.origin}/u/${username}`;

  const handleShareVia = async () => {
    if (navigator.share) {
      isSharingRef.current = true;
      try {
        await navigator.share({ title: `@${username} on Inscrio`, url: profileUrl });
        onClose();
      } catch {
        /* cancelled */
      } finally {
        isSharingRef.current = false;
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
      <div className="fixed inset-0 z-40" onClick={requestClose} />
      <div
        style={{ top: pos.top, right: pos.right }}
        className="fixed z-50 w-[226px] rounded-[16px] bg-card px-[20px] pb-[20px] pt-[16px] shadow-xl border border-border"
      >
        <div className="flex flex-col gap-[24px]">
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
