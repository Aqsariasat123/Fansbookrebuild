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
}

export function ChatInputBar({
  value,
  onChange,
  onSend,
  onFileSelect,
  sending,
}: ChatInputBarProps) {
  const [showEmoji, setShowEmoji] = useState(false);
  const galleryRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative flex items-center justify-between border border-[#15191c] rounded-[8px] mx-[10px] mb-[10px] md:mx-[17px] md:mb-[17px] px-[8px] py-[6px] md:px-[10px] md:py-[8px]">
      {showEmoji && (
        <div className="absolute bottom-full mb-[8px] left-0 bg-[#15191c] rounded-[12px] p-[8px] md:p-[10px] grid grid-cols-8 gap-[2px] z-20 shadow-lg">
          {EMOJIS.map((e) => (
            <button
              key={e}
              onClick={() => {
                onChange(value + e);
                setShowEmoji(false);
              }}
              className="text-[18px] md:text-[22px] hover:bg-[#2a2d30] rounded-[6px] p-[4px] md:p-[6px]"
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
            stroke="#5d5d5d"
            strokeWidth="1.5"
            className="md:w-[24px] md:h-[24px]"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2" />
            <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2" />
          </svg>
        </button>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
          onFocus={() => setShowEmoji(false)}
          placeholder="Message"
          className="bg-transparent text-[14px] md:text-[16px] text-[#f8f8f8] placeholder-[#5d5d5d] outline-none flex-1 min-w-0"
        />
      </div>
      <div className="flex items-center gap-[12px] md:gap-[34px] shrink-0">
        <div className="flex items-center gap-[8px] md:gap-[16px]">
          <button onClick={() => galleryRef.current?.click()} className="hover:opacity-80">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#5d5d5d"
              strokeWidth="1.5"
              className="md:w-[24px] md:h-[24px]"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </button>
          <button onClick={() => fileRef.current?.click()} className="hover:opacity-80">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#5d5d5d"
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
