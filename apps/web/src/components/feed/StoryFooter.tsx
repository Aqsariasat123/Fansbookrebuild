import { useState } from 'react';
import { api } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';

interface StoryFooterProps {
  storyId: string;
  authorId: string;
  viewCount: number;
}

const EYE_PATH =
  'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z';

const HEART_PATH =
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

function ViewCount({ count, large }: { count: number; large?: boolean }) {
  const size = large ? 20 : 16;
  const textCls = large ? 'text-sm text-white/80' : 'text-xs text-white/50';
  const iconCls = large ? 'text-white/80' : 'text-white/50';
  return (
    <div className="mb-3 flex items-center gap-1.5">
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={iconCls}>
        <path d={EYE_PATH} fill="currentColor" />
      </svg>
      <span className={textCls}>{count}</span>
    </div>
  );
}

function ReplyBar({ storyId }: { storyId: string }) {
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [hearted, setHearted] = useState(false);

  const handleReply = async () => {
    if (!reply.trim() || sending) return;
    setSending(true);
    try {
      await api.post(`/stories/${storyId}/reply`, { text: reply.trim() });
      setReply('');
      setSent(true);
      setTimeout(() => setSent(false), 2000);
    } catch {
      /* ignore */
    } finally {
      setSending(false);
    }
  };

  const handleHeart = () => {
    setHearted(true);
    api.post(`/stories/${storyId}/react`).catch(() => {});
    setTimeout(() => setHearted(false), 1500);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-1 items-center rounded-full border border-white/30 px-3 py-2">
        <input
          type="text"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleReply()}
          placeholder={sent ? 'Sent!' : 'Reply to story...'}
          className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/50"
          onClick={(e) => e.stopPropagation()}
        />
        {reply.trim() && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReply();
            }}
            disabled={sending}
            className="ml-2 text-sm font-medium text-[#01adf1]"
          >
            Send
          </button>
        )}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleHeart();
        }}
        className="shrink-0 p-1"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill={hearted ? '#ef4444' : 'none'}
          className={`transition-transform ${hearted ? 'scale-125' : ''}`}
        >
          <path d={HEART_PATH} stroke="white" strokeWidth="1.5" />
        </svg>
      </button>
    </div>
  );
}

export function StoryFooter({ storyId, authorId, viewCount }: StoryFooterProps) {
  const user = useAuthStore((s) => s.user);
  const isOwner = user?.id === authorId;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/80 to-transparent px-3 pb-4 pt-8">
      {viewCount > 0 && <ViewCount count={viewCount} large={isOwner} />}
      {!isOwner && <ReplyBar storyId={storyId} />}
    </div>
  );
}
