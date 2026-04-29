import type { ChatMessage } from './ChatBubbles';
import { OtherBubble, SelfBubble } from './ChatBubbles';

export function sameDay(a: string, b: string) {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

export function mergeMessages(prev: ChatMessage[], incoming: ChatMessage[]): ChatMessage[] {
  const ids = new Set(prev.map((m) => m.id));
  const added = incoming.filter((m) => !ids.has(m.id));
  return added.length > 0 ? [...prev, ...added] : prev;
}

export function MsgItem({
  msg,
  prev,
  userId,
  onDelete,
  onView,
}: {
  msg: ChatMessage;
  prev?: ChatMessage;
  userId?: string;
  onDelete: (id: string) => void;
  onView: (url: string) => void;
}) {
  const showSep = !prev || !sameDay(prev.createdAt, msg.createdAt);
  const del = (id: string) => onDelete(id);
  return (
    <div>
      {showSep && <DateSeparator date={msg.createdAt} />}
      {msg.mediaType === 'CALL' ? (
        <CallBubble msg={msg} userId={userId} />
      ) : msg.senderId === userId ? (
        <SelfBubble msg={msg} onDelete={del} onViewImage={onView} />
      ) : (
        <OtherBubble msg={msg} onDelete={del} onViewImage={onView} />
      )}
    </div>
  );
}

export function DateSeparator({ date }: { date: string }) {
  const d = new Date(date);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  let label: string;
  if (diffDays === 0 && now.getDate() === d.getDate()) {
    label = 'Today';
  } else if (diffDays <= 1) {
    label = 'Yesterday';
  } else if (diffDays < 7) {
    label = d.toLocaleDateString('en-US', { weekday: 'long' });
  } else {
    const yr = diffDays > 365 ? 'numeric' : undefined;
    label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: yr });
  }
  return (
    <div className="flex items-center gap-[12px] py-[4px]">
      <div className="flex-1 h-px bg-muted" />
      <span className="text-[11px] text-muted-foreground shrink-0">{label}</span>
      <div className="flex-1 h-px bg-muted" />
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
const VIDEO_CAM =
  'M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z';

export function CallBubble({ msg, userId }: { msg: ChatMessage; userId?: string }) {
  const isMissed = msg.text?.startsWith('Missed');
  const arrow = !isMissed && userId === msg.senderId ? '↗' : '↙';
  return (
    <div className="flex justify-center py-[8px]">
      <div className="flex items-center gap-[8px] rounded-[20px] bg-muted px-[16px] py-[8px]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill={isMissed ? '#ef4444' : '#22c55e'}>
          <path d={msg.text?.includes('Audio') ? PHONE_D : VIDEO_CAM} />
        </svg>
        <span className={`text-[13px] ${isMissed ? 'text-red-400' : 'text-foreground'}`}>
          <span className={isMissed ? 'text-red-400' : 'text-green-500'}>{arrow}</span> {msg.text}
        </span>
        <span className="text-[11px] text-muted-foreground">
          {new Date(msg.createdAt).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })}
        </span>
      </div>
    </div>
  );
}
