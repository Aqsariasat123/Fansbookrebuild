import { useState } from 'react';
import { api } from '../../lib/api';
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
  mediaUrl: string | null;
  mediaType: string;
  readAt: string | null;
  createdAt: string;
  sender: MessageUser;
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

const checkSvg = (stroke: string, paths: string[]) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {paths.map((d) => (
      <path key={d} d={d} />
    ))}
  </svg>
);
const SingleCheck = () => checkSvg('#999', ['M5 12l5 5L20 6']);
const DoubleCheck = () => checkSvg('#01adf1', ['M1 12l5 5L17 6', 'M7 12l5 5L23 6']);

function DeleteMenu({
  msgId,
  isSelf,
  onDelete,
}: {
  msgId: string;
  isSelf: boolean;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const del = async (mode: string) => {
    await api.delete(`/messages/message/${msgId}?mode=${mode}`).catch(() => {});
    onDelete(msgId);
    setOpen(false);
  };
  const btn = 'w-full text-left px-[14px] py-[8px] text-[13px] hover:bg-muted';
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-all text-[14px] px-[4px]"
      >
        &#8942;
      </button>
      {open && (
        <div className="absolute top-full right-0 bg-muted rounded-[8px] py-[4px] w-[180px] z-20 shadow-lg">
          <button onClick={() => del('forMe')} className={`${btn} text-foreground`}>
            Delete for me
          </button>
          {isSelf && (
            <button onClick={() => del('forEveryone')} className={`${btn} text-red-400`}>
              Delete for everyone
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface BubbleProps {
  msg: ChatMessage;
  onDelete: (id: string) => void;
  onViewImage: (url: string) => void;
}

function ImageBubble({ msg, onView }: { msg: ChatMessage; onView: (url: string) => void }) {
  return (
    <div
      className="relative cursor-pointer overflow-hidden rounded-[12px] max-w-[280px]"
      onClick={() => onView(msg.mediaUrl!)}
    >
      <img src={msg.mediaUrl!} alt="" className="w-full rounded-[12px] object-cover" />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-[10px] pb-[8px] pt-[24px]">
        {msg.text && <p className="text-[13px] text-white mb-[2px]">{msg.text}</p>}
        <p className="text-[11px] text-white/70 text-right">{formatTime(msg.createdAt)}</p>
      </div>
    </div>
  );
}

export function OtherBubble({ msg, onDelete, onViewImage }: BubbleProps) {
  const initial = msg.sender.displayName?.charAt(0)?.toUpperCase() || '?';
  const isImage = msg.mediaUrl && msg.mediaType === 'IMAGE';
  return (
    <div className="group flex items-start gap-[16px]">
      {msg.sender.avatar ? (
        <img
          src={msg.sender.avatar}
          alt=""
          className="size-[32px] rounded-full object-cover shrink-0"
        />
      ) : (
        <div className="size-[32px] rounded-full bg-primary/30 flex items-center justify-center shrink-0">
          <span className="text-[11px] font-medium text-foreground">{initial}</span>
        </div>
      )}
      <div className="flex flex-col gap-[6px] max-w-[375px]">
        <p className="text-[16px] leading-[1.7] text-foreground">{msg.sender.displayName}</p>
        {isImage ? (
          <ImageBubble msg={msg} onView={onViewImage} />
        ) : (
          <div className="bg-muted rounded-[8px] px-[14px] py-[10px]">
            <p className="text-[16px] leading-[1.7] text-foreground">{msg.text}</p>
          </div>
        )}
      </div>
      <DeleteMenu msgId={msg.id} isSelf={false} onDelete={onDelete} />
    </div>
  );
}
export function TypingDots() {
  return (
    <div className="flex items-center gap-[8px] px-[10px] py-[4px]">
      <div className="flex gap-[3px]">
        {[0, 150, 300].map((d) => (
          <span
            key={d}
            className="size-[6px] rounded-full bg-muted-foreground/50 animate-bounce"
            style={{ animationDelay: `${d}ms` }}
          />
        ))}
      </div>
      <span className="text-[12px] text-muted-foreground">typing...</span>
    </div>
  );
}

const PHONE_D =
  'M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z';
const VIDEO_D =
  'M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z';
export function CallBubble({ msg, userId }: { msg: ChatMessage; userId?: string }) {
  const isMissed = msg.text?.startsWith('Missed');
  const arrow = !isMissed && userId === msg.senderId ? '↗' : '↙';
  return (
    <div className="flex justify-center py-[8px]">
      <div className="flex items-center gap-[8px] rounded-[20px] bg-muted px-[16px] py-[8px]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill={isMissed ? '#ef4444' : '#22c55e'}>
          <path d={msg.text?.includes('Audio') ? PHONE_D : VIDEO_D} />
        </svg>
        <span className={`text-[13px] ${isMissed ? 'text-red-400' : 'text-foreground'}`}>
          <span className={isMissed ? 'text-red-400' : 'text-green-500'}>{arrow}</span> {msg.text}
        </span>
        <span className="text-[11px] text-muted-foreground">{formatTime(msg.createdAt)}</span>
      </div>
    </div>
  );
}
export function SelfBubble({ msg, onDelete, onViewImage }: BubbleProps) {
  const isImage = msg.mediaUrl && msg.mediaType === 'IMAGE';
  return (
    <div className="group flex items-end justify-end gap-[8px]">
      <DeleteMenu msgId={msg.id} isSelf={true} onDelete={onDelete} />
      <div className="shrink-0 mb-[10px]">{msg.readAt ? <DoubleCheck /> : <SingleCheck />}</div>
      <div className="flex flex-col gap-[6px] items-end">
        {!isImage && (
          <p className="text-[12px] leading-[1.7] text-muted-foreground">
            {formatTime(msg.createdAt)}
          </p>
        )}
        {isImage ? (
          <ImageBubble msg={msg} onView={onViewImage} />
        ) : (
          <div className="bg-muted rounded-[8px] px-[14px] py-[10px]">
            <p className="text-[16px] leading-[1.7] text-foreground">{msg.text}</p>
          </div>
        )}
      </div>
    </div>
  );
}
