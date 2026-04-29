import { useState } from 'react';
import { api } from '../../lib/api';

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string | null;
  mediaUrl: string | null;
  mediaType: string;
  readAt: string | null;
  createdAt: string;
  sender: {
    id: string;
    username: string;
    displayName: string;
    avatar: string | null;
  };
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

function VideoBubble({ msg }: { msg: ChatMessage }) {
  return (
    <div className="relative overflow-hidden rounded-[12px] max-w-[320px]">
      <video
        src={msg.mediaUrl!}
        controls
        className="w-full rounded-[12px]"
        style={{ maxHeight: '280px' }}
      />
      {msg.text && <p className="text-[13px] text-foreground mt-[4px] px-[2px]">{msg.text}</p>}
      <p className="text-[11px] text-muted-foreground text-right mt-[2px]">
        {formatTime(msg.createdAt)}
      </p>
    </div>
  );
}

function MediaBubble({
  msg,
  onViewImage,
}: {
  msg: ChatMessage;
  onViewImage: (url: string) => void;
}) {
  if (msg.mediaType === 'VIDEO') return <VideoBubble msg={msg} />;
  return <ImageBubble msg={msg} onView={onViewImage} />;
}

export function OtherBubble({ msg, onDelete, onViewImage }: BubbleProps) {
  const initial = msg.sender.displayName?.charAt(0)?.toUpperCase() || '?';
  const hasMedia = msg.mediaUrl && (msg.mediaType === 'IMAGE' || msg.mediaType === 'VIDEO');
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
        {hasMedia ? (
          <MediaBubble msg={msg} onViewImage={onViewImage} />
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

export function SelfBubble({ msg, onDelete, onViewImage }: BubbleProps) {
  const hasMedia = msg.mediaUrl && (msg.mediaType === 'IMAGE' || msg.mediaType === 'VIDEO');
  return (
    <div className="group flex items-end justify-end gap-[8px]">
      <DeleteMenu msgId={msg.id} isSelf={true} onDelete={onDelete} />
      <div className="shrink-0 mb-[10px]">{msg.readAt ? <DoubleCheck /> : <SingleCheck />}</div>
      <div className="flex flex-col gap-[6px] items-end">
        {!hasMedia && (
          <p className="text-[12px] leading-[1.7] text-muted-foreground">
            {formatTime(msg.createdAt)}
          </p>
        )}
        {hasMedia ? (
          <MediaBubble msg={msg} onViewImage={onViewImage} />
        ) : (
          <div className="bg-muted rounded-[8px] px-[14px] py-[10px]">
            <p className="text-[16px] leading-[1.7] text-foreground">{msg.text}</p>
          </div>
        )}
      </div>
    </div>
  );
}
