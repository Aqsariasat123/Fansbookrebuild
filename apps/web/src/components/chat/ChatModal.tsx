import { useEffect } from 'react';
import { MessageChatPanel } from './MessageChatPanel';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

interface Props {
  conversationId: string;
  otherName?: string;
  otherAvatar?: string | null;
  otherId?: string;
  onClose: () => void;
}

function ModalHeader({ otherName, otherAvatar, otherId, onClose }: Omit<Props, 'conversationId'>) {
  const isOnline = useOnlineStatus(otherId);
  const initial = otherName?.charAt(0)?.toUpperCase() || '?';
  return (
    <div className="flex items-center gap-[12px] border-b border-muted px-[14px] py-[12px]">
      {otherAvatar ? (
        <img src={otherAvatar} alt="" className="size-[36px] rounded-full object-cover shrink-0" />
      ) : (
        <div className="size-[36px] rounded-full bg-primary/30 flex items-center justify-center shrink-0">
          <span className="text-[13px] font-medium text-foreground">{initial}</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-medium text-foreground truncate">{otherName}</p>
        <p className={`text-[11px] ${isOnline ? 'text-green-500' : 'text-muted-foreground'}`}>
          {isOnline ? 'Online' : 'Offline'}
        </p>
      </div>
      <button
        onClick={onClose}
        className="flex size-[30px] items-center justify-center rounded-full hover:bg-muted transition-colors"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function ChatModal({ conversationId, otherName, otherAvatar, otherId, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <div className="fixed bottom-[16px] right-[16px] z-50 flex flex-col bg-card rounded-[16px] shadow-2xl border border-muted w-[380px] h-[560px] sm:w-[400px] sm:h-[580px] overflow-hidden">
        <ModalHeader
          otherName={otherName}
          otherAvatar={otherAvatar}
          otherId={otherId}
          onClose={onClose}
        />
        <MessageChatPanel conversationId={conversationId} onBack={onClose} hideHeader />
      </div>
    </>
  );
}
