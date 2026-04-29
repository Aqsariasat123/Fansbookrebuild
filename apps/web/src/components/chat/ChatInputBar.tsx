import { useState, useRef } from 'react';

const EMOJIS = [
  '😊',
  '😂',
  '❤️',
  '👍',
  '🔥',
  '😍',
  '🎉',
  '💯',
  '😎',
  '🙌',
  '💪',
  '🤩',
  '😘',
  '🥰',
  '👏',
  '✨',
];

interface ChatInputBarProps {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sending: boolean;
  onTip?: () => void;
  isCreator?: boolean;
}

export function ChatInputBar({
  value,
  onChange,
  onSend,
  onFileSelect,
  sending,
  onTip,
  isCreator,
}: ChatInputBarProps) {
  const [showEmoji, setShowEmoji] = useState(false);
  const galleryRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative flex items-center justify-between border border-muted rounded-[8px] mx-[10px] mb-[10px] md:mx-[17px] md:mb-[17px] px-[8px] py-[6px] md:px-[10px] md:py-[8px]">
      {showEmoji && (
        <div className="absolute bottom-full mb-[8px] left-0 bg-muted rounded-[12px] p-[8px] md:p-[10px] grid grid-cols-8 gap-[2px] z-20 shadow-lg">
          {EMOJIS.map((e) => (
            <button
              key={e}
              onClick={() => {
                onChange(value + e);
                setShowEmoji(false);
              }}
              className="text-[18px] md:text-[22px] hover:bg-muted rounded-[6px] p-[4px] md:p-[6px]"
            >
              {e}
            </button>
          ))}
        </div>
      )}
      <input
        type="file"
        ref={galleryRef}
        accept="image/*,video/*"
        className="hidden"
        onChange={onFileSelect}
      />
      <input type="file" ref={fileRef} className="hidden" onChange={onFileSelect} />
      <div className="flex items-center gap-[10px] md:gap-[20px] flex-1 min-w-0">
        <button onClick={() => setShowEmoji(!showEmoji)} className="shrink-0 hover:opacity-80">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="md:w-[24px] md:h-[24px]"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" />
            <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" />
          </svg>
        </button>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
          onFocus={() => setShowEmoji(false)}
          placeholder="Message"
          className="bg-transparent text-[14px] md:text-[16px] text-foreground placeholder-muted-foreground outline-none flex-1 min-w-0"
        />
      </div>
      <div className="flex items-center gap-[12px] md:gap-[34px] shrink-0">
        <div className="flex items-center gap-[8px] md:gap-[16px]">
          {/* Gallery button: only for creators */}
          {isCreator && (
            <button onClick={() => galleryRef.current?.click()} className="hover:opacity-80">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="md:w-[24px] md:h-[24px]"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </button>
          )}
          {/* Tip: gradient pill for fans, hidden for creators */}
          {!isCreator && onTip && (
            <button
              onClick={onTip}
              className="flex items-center gap-[6px] rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[12px] py-[5px] text-[12px] font-medium text-white hover:opacity-90 transition-opacity"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
              </svg>
              Send tip
            </button>
          )}
          {/* Attachment button: always visible */}
          <button onClick={() => fileRef.current?.click()} className="hover:opacity-80">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="md:w-[24px] md:h-[24px]"
            >
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
            </svg>
          </button>
        </div>
        <button
          onClick={onSend}
          disabled={!value.trim() || sending}
          className="hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <svg
            width="28"
            height="25"
            viewBox="0 0 24 24"
            fill="#2e80c8"
            className="md:w-[34px] md:h-[31px]"
          >
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
