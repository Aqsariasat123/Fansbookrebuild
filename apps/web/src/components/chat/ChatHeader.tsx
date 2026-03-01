import { useState } from 'react';
import { api } from '../../lib/api';

const IMG = '/icons/dashboard';

interface MessagePageHeaderProps {
  onInvite?: () => void;
}

export function MessagePageHeader({ onInvite }: MessagePageHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleInvite = () => {
    if (onInvite) return onInvite();
    const link = `${window.location.origin}/explore`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex items-center justify-between border-b border-muted px-[39px] py-[16px]">
      <p className="text-[20px] text-foreground">Message</p>
      <div className="flex items-center gap-[16px]">
        <button
          onClick={handleInvite}
          className="flex items-center gap-[10px] bg-muted p-[10px] rounded-[8px] hover:opacity-80 transition-opacity"
        >
          <img src={`${IMG}/person-heart.svg`} alt="" className="size-[24px]" />
          <span className="text-[20px] text-muted-foreground">{copied ? 'Copied!' : 'Invite'}</span>
        </button>
        <button className="size-[34px] flex items-center justify-center hover:opacity-80 transition-opacity">
          <img src={`${IMG}/notifications.svg`} alt="" className="size-[24px]" />
        </button>
      </div>
    </div>
  );
}

function ChatSettingsMenu({ otherId, onClose }: { otherId?: string; onClose: () => void }) {
  const [muted, setMuted] = useState(false);

  const handleBlock = async () => {
    if (!otherId) return;
    await api.post(`/social/users/${otherId}/block`).catch(() => {});
    onClose();
  };

  return (
    <div className="absolute top-full right-0 mt-[4px] bg-card border border-muted rounded-[8px] py-[4px] w-[180px] z-20 shadow-lg">
      <button
        onClick={() => {
          setMuted(!muted);
          onClose();
        }}
        className="w-full text-left px-[14px] py-[10px] text-[14px] text-foreground hover:bg-muted"
      >
        {muted ? 'Unmute Notifications' : 'Mute Notifications'}
      </button>
      <button
        onClick={handleBlock}
        className="w-full text-left px-[14px] py-[10px] text-[14px] text-foreground hover:bg-muted"
      >
        Block User
      </button>
      <button
        onClick={onClose}
        className="w-full text-left px-[14px] py-[10px] text-[14px] text-red-400 hover:bg-muted"
      >
        Delete Chat
      </button>
    </div>
  );
}

interface ChatUserHeaderProps {
  otherName?: string;
  otherAvatar?: string | null;
  otherId?: string;
  onBack: () => void;
  isOnline?: boolean;
  onAudioCall?: () => void;
  onVideoCall?: () => void;
}

export function ChatUserHeader({
  otherName,
  otherAvatar,
  otherId,
  onBack,
  isOnline,
  onAudioCall,
  onVideoCall,
}: ChatUserHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  const initial = otherName?.charAt(0)?.toUpperCase() || '?';
  return (
    <div className="flex items-center border-b border-muted pl-[12px] py-[14px] pr-[17px]">
      <button onClick={onBack} className="mr-[12px] hover:opacity-80 transition-opacity">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>
      <div className="flex items-center gap-[16px]">
        {otherAvatar ? (
          <img src={otherAvatar} alt="" className="size-[40px] rounded-full object-cover" />
        ) : (
          <div className="size-[40px] rounded-full bg-primary/30 flex items-center justify-center">
            <span className="text-[14px] font-medium text-foreground">{initial}</span>
          </div>
        )}
        <div>
          <p className="text-[20px] leading-[1.7] text-foreground">{otherName}</p>
          <p
            className={`text-[12px] leading-[1.7] ${isOnline ? 'text-green-500' : 'text-muted-foreground'}`}
          >
            {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>
      <div className="flex-1" />
      <div className="relative flex items-center gap-[12px]">
        {onAudioCall && (
          <CallButton onClick={onAudioCall} title="Audio Call">
            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
          </CallButton>
        )}
        {onVideoCall && (
          <CallButton onClick={onVideoCall} title="Video Call">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
          </CallButton>
        )}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="hover:opacity-80 transition-opacity"
          title="Settings"
        >
          <img src={`${IMG}/settings.svg`} alt="" className="size-[20px] opacity-50" />
        </button>
        {showMenu && <ChatSettingsMenu otherId={otherId} onClose={() => setShowMenu(false)} />}
      </div>
    </div>
  );
}

function CallButton({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex size-[36px] items-center justify-center rounded-full bg-gradient-to-r from-[#01adf1] to-[#a61651] hover:opacity-80 transition-opacity"
      title={title}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        {children}
      </svg>
    </button>
  );
}
