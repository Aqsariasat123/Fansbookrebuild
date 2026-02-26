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

function DoneAllIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2e80c8"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12l5 5L17 6" />
      <path d="M7 12l5 5L23 6" />
    </svg>
  );
}

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
  async function handleDelete(mode: string) {
    try {
      await api.delete(`/messages/message/${msgId}?mode=${mode}`);
      onDelete(msgId);
    } catch {
      /* */
    }
    setOpen(false);
  }
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="opacity-0 group-hover:opacity-100 text-[#5d5d5d] hover:text-[#f8f8f8] transition-all text-[14px] px-[4px]"
      >
        &#8942;
      </button>
      {open && (
        <div className="absolute top-full right-0 bg-[#15191c] rounded-[8px] py-[4px] w-[180px] z-20 shadow-lg">
          <button
            onClick={() => handleDelete('forMe')}
            className="w-full text-left px-[14px] py-[8px] text-[13px] text-[#f8f8f8] hover:bg-[#2a2d30]"
          >
            Delete for me
          </button>
          {isSelf && (
            <button
              onClick={() => handleDelete('forEveryone')}
              className="w-full text-left px-[14px] py-[8px] text-[13px] text-red-400 hover:bg-[#2a2d30]"
            >
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
        <div className="size-[32px] rounded-full bg-[#2e4882] flex items-center justify-center shrink-0">
          <span className="text-[11px] font-medium text-[#f8f8f8]">{initial}</span>
        </div>
      )}
      <div className="flex flex-col gap-[6px] max-w-[375px]">
        <p className="text-[16px] leading-[1.7] text-[#f8f8f8]">{msg.sender.displayName}</p>
        {isImage ? (
          <ImageBubble msg={msg} onView={onViewImage} />
        ) : (
          <div className="bg-[#15191c] rounded-[8px] px-[14px] py-[10px]">
            <p className="text-[16px] leading-[1.7] text-[#f8f8f8]">{msg.text}</p>
          </div>
        )}
      </div>
      <DeleteMenu msgId={msg.id} isSelf={false} onDelete={onDelete} />
    </div>
  );
}

export function SelfBubble({ msg, onDelete, onViewImage }: BubbleProps) {
  const isImage = msg.mediaUrl && msg.mediaType === 'IMAGE';
  return (
    <div className="group flex items-end justify-end gap-[8px]">
      <DeleteMenu msgId={msg.id} isSelf={true} onDelete={onDelete} />
      <div className="shrink-0 mb-[10px]">
        <DoneAllIcon />
      </div>
      <div className="flex flex-col gap-[6px] items-end">
        {!isImage && (
          <p className="text-[12px] leading-[1.7] text-[#5d5d5d]">{formatTime(msg.createdAt)}</p>
        )}
        {isImage ? (
          <ImageBubble msg={msg} onView={onViewImage} />
        ) : (
          <div className="bg-[#15191c] rounded-[8px] px-[14px] py-[10px]">
            <p className="text-[16px] leading-[1.7] text-[#f8f8f8]">{msg.text}</p>
          </div>
        )}
      </div>
    </div>
  );
}
