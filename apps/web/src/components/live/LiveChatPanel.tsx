import { useEffect, useRef, useState } from 'react';
import type React from 'react';
import { useLiveStore } from '../../stores/liveStore';

interface LiveChatPanelProps {
  onSend: (text: string) => void;
  creatorName?: string;
  creatorAvatar?: string | null;
  goPrivate?: React.ReactNode;
}

export function LiveChatPanel({
  onSend,
  creatorName,
  creatorAvatar,
  goPrivate,
}: LiveChatPanelProps) {
  const chatMessages = useLiveStore((s) => s.chatMessages);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[16px] border border-[#e91e8c]">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#e91e8c] px-[16px] py-[10px]">
        <div className="flex items-center gap-[10px]">
          {creatorAvatar ? (
            <img
              src={creatorAvatar}
              alt=""
              className="size-[32px] shrink-0 rounded-full object-cover"
            />
          ) : creatorName ? (
            <div className="flex size-[32px] shrink-0 items-center justify-center rounded-full bg-white/20 text-[13px] font-bold text-white">
              {creatorName.charAt(0)}
            </div>
          ) : null}
          <p className="text-[15px] font-semibold text-white">{creatorName || 'Live Chat'}</p>
        </div>
        <div className="flex items-center gap-[10px]">
          {goPrivate}
          <span className="text-[12px] text-white/80">{chatMessages.length} messages</span>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex flex-1 flex-col gap-[10px] overflow-y-auto bg-card p-[16px]"
        style={{ minHeight: 200, maxHeight: 400 }}
      >
        {chatMessages.length === 0 && (
          <p className="text-center text-[13px] text-muted-foreground">No messages yet. Say hi!</p>
        )}
        {chatMessages.map((m) => (
          <div key={m.id} className="flex gap-[8px]">
            <div className="size-[28px] shrink-0 overflow-hidden rounded-full bg-muted">
              {m.senderAvatar ? (
                <img src={m.senderAvatar} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[11px] font-bold text-muted-foreground">
                  {m.senderName.charAt(0)}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-[#e91e8c]">{m.senderName}</span>
              <p className="text-[13px] text-foreground">{m.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-[10px] border-t border-border bg-card px-[16px] py-[10px]">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 bg-transparent text-[14px] text-foreground placeholder-muted-foreground outline-none"
        />
        <button
          onClick={handleSend}
          className="flex size-[36px] items-center justify-center rounded-full bg-[#01adf1]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
