import { useState } from 'react';

const IMG = '/icons/dashboard';

export function MessagePageHeader() {
  return (
    <div className="flex items-center justify-between border-b border-muted px-[39px] py-[16px]">
      <p className="text-[20px] text-foreground">Message</p>
      <div className="flex items-center gap-[16px]">
        <button className="flex items-center gap-[10px] bg-muted p-[10px] rounded-[8px] hover:opacity-80 transition-opacity">
          <img src={`${IMG}/person-heart.svg`} alt="" className="size-[24px]" />
          <span className="text-[20px] text-muted-foreground">Invite</span>
        </button>
        <button className="size-[34px] flex items-center justify-center hover:opacity-80 transition-opacity">
          <img src={`${IMG}/notifications.svg`} alt="" className="size-[24px]" />
        </button>
      </div>
    </div>
  );
}

interface ChatUserHeaderProps {
  otherName?: string;
  otherAvatar?: string | null;
  onBack: () => void;
  isOnline?: boolean;
  onVideoCall?: () => void;
}

export function ChatUserHeader({
  otherName,
  otherAvatar,
  onBack,
  isOnline,
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
        {onVideoCall && (
          <button
            onClick={onVideoCall}
            className="flex size-[36px] items-center justify-center rounded-full bg-gradient-to-r from-[#01adf1] to-[#a61651] hover:opacity-80 transition-opacity"
            title="Video Call"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
            </svg>
          </button>
        )}
        <button className="hover:opacity-80 transition-opacity">
          <img src={`${IMG}/settings.svg`} alt="" className="size-[20px] opacity-50" />
        </button>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="hover:opacity-80 transition-opacity"
        >
          <span className="text-[20px] text-muted-foreground">&#8942;</span>
        </button>
        {showMenu && (
          <div className="absolute top-full right-0 mt-[4px] bg-muted rounded-[8px] py-[4px] w-[160px] z-20 shadow-lg">
            <button className="w-full text-left px-[14px] py-[10px] text-[14px] text-foreground hover:bg-muted">
              Mute
            </button>
            <button className="w-full text-left px-[14px] py-[10px] text-[14px] text-foreground hover:bg-muted">
              Block
            </button>
            <button className="w-full text-left px-[14px] py-[10px] text-[14px] text-red-400 hover:bg-muted">
              Delete Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
