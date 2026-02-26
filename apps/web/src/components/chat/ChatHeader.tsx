const IMG = '/icons/dashboard';

interface ChatHeaderProps {
  title: string;
  otherName?: string;
  otherAvatar?: string | null;
  onBack?: () => void;
}

export function MessagePageHeader() {
  return (
    <div className="flex items-center justify-between mb-[16px]">
      <p className="text-[24px] font-bold text-[#f8f8f8]">Message</p>
      <div className="flex items-center gap-[10px]">
        <button className="flex items-center gap-[6px] bg-[#15191c] rounded-[8px] px-[14px] py-[8px] text-[14px] text-[#f8f8f8] hover:opacity-80 transition-opacity">
          <img src={`${IMG}/person-heart.svg`} alt="" className="size-[18px]" />
          Invite
        </button>
        <button className="size-[36px] rounded-full flex items-center justify-center hover:bg-[#15191c] transition-colors">
          <img src={`${IMG}/notifications.svg`} alt="" className="size-[20px]" />
        </button>
      </div>
    </div>
  );
}

export function ChatUserHeader({ otherName, otherAvatar, onBack }: ChatHeaderProps) {
  const initial = otherName?.charAt(0)?.toUpperCase() || '?';
  return (
    <div className="flex items-center gap-[12px] mb-[16px]">
      {onBack && (
        <button onClick={onBack} className="hover:opacity-80 transition-opacity">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f8f8f8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      {otherAvatar ? (
        <img src={otherAvatar} alt="" className="size-[40px] rounded-full object-cover" />
      ) : (
        <div className="size-[40px] rounded-full bg-[#2e4882] flex items-center justify-center">
          <span className="text-[14px] font-medium text-[#f8f8f8]">{initial}</span>
        </div>
      )}
      <div>
        <p className="text-[16px] font-medium text-[#f8f8f8]">{otherName}</p>
        <p className="text-[12px] text-[#2e80c8]">{otherName} is Typing...</p>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-[6px]">
        <button className="size-[36px] flex items-center justify-center hover:opacity-80">
          <img src={`${IMG}/settings.svg`} alt="" className="size-[20px] opacity-50" />
        </button>
        <button className="size-[36px] flex items-center justify-center hover:opacity-80">
          <span className="text-[20px] text-[#5d5d5d]">⋮</span>
        </button>
      </div>
    </div>
  );
}
