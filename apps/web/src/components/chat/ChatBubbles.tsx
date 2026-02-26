interface MessageUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string | null;
  readAt: string | null;
  createdAt: string;
  sender: MessageUser;
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 14" fill="none">
      <path
        d="M1 7l4 4L13 1"
        stroke="#2e80c8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 11l4 -4L19 1"
        stroke="#2e80c8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function OtherBubble({ msg }: { msg: ChatMessage }) {
  const initial = msg.sender.displayName?.charAt(0)?.toUpperCase() || '?';
  return (
    <div className="flex items-start gap-[8px] max-w-[70%]">
      {msg.sender.avatar ? (
        <img
          src={msg.sender.avatar}
          alt=""
          className="size-[32px] rounded-full object-cover shrink-0 mt-[4px]"
        />
      ) : (
        <div className="size-[32px] rounded-full bg-[#2e4882] flex items-center justify-center shrink-0 mt-[4px]">
          <span className="text-[12px] font-medium text-[#f8f8f8]">{initial}</span>
        </div>
      )}
      <div>
        <p className="text-[13px] font-medium text-[#f8f8f8] mb-[4px]">{msg.sender.displayName}</p>
        <div className="bg-[#15191c] rounded-[8px] px-[14px] py-[10px]">
          <p className="text-[14px] text-[#f8f8f8]">{msg.text}</p>
        </div>
      </div>
    </div>
  );
}

export function SelfBubble({ msg }: { msg: ChatMessage }) {
  return (
    <div className="flex flex-col items-end">
      <div className="flex items-end gap-[6px]">
        <CheckIcon />
        <div className="bg-[#15191c] rounded-[8px] px-[14px] py-[10px] max-w-[70%]">
          <p className="text-[14px] text-[#f8f8f8]">{msg.text}</p>
        </div>
      </div>
      <p className="text-[12px] text-[#5d5d5d] mt-[4px] mr-[2px]">{formatTime(msg.createdAt)}</p>
    </div>
  );
}
