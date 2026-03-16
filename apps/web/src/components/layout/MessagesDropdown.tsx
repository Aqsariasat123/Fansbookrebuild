import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { getSocket } from '../../lib/socket';
import { useMessageStore } from '../../stores/messageStore';

interface ConversationItem {
  id: string;
  other: { id: string; username: string; displayName: string; avatar: string | null };
  lastMessage: string | null;
  lastMessageAt: string;
  unreadCount: number;
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function ConvRow({ c, onClick }: { c: ConversationItem; onClick: () => void }) {
  const isOnline = useOnlineStatus(c.other.id);
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-[14px] border-b border-muted px-[16px] py-[12px] text-left transition-colors hover:bg-muted/70"
    >
      <div className="relative shrink-0">
        {c.other.avatar ? (
          <img src={c.other.avatar} alt="" className="size-[40px] rounded-full object-cover" />
        ) : (
          <div className="flex size-[40px] items-center justify-center rounded-full bg-primary/30">
            <span className="text-[14px] font-medium text-foreground">
              {c.other.displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        {isOnline && (
          <div className="absolute bottom-0 right-0 size-[8px] rounded-full bg-green-500" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] text-foreground">{c.other.displayName}</p>
        <p className="truncate text-[12px] text-muted-foreground">{c.lastMessage ?? ''}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-[4px]">
        <p className="text-[11px] text-muted-foreground">{formatTime(c.lastMessageAt)}</p>
        {c.unreadCount > 0 && (
          <div className="flex items-center justify-center rounded-full bg-[#01adf1]/20 px-[8px] py-[1px]">
            <span className="text-[10px] text-[#01adf1]">{c.unreadCount}</span>
          </div>
        )}
      </div>
    </button>
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function MessagesDropdown({ open, onClose }: Props) {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    api
      .get('/messages/conversations')
      .then(({ data: r }) => {
        if (r.success) setConversations(r.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const socket = getSocket();
    if (!socket) return;
    const handle = (data: {
      conversationId: string;
      lastMessage: string;
      lastMessageAt: string;
    }) => {
      setConversations((prev) => {
        const idx = prev.findIndex((c) => c.id === data.conversationId);
        if (idx === -1) return prev;
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          lastMessage: data.lastMessage,
          lastMessageAt: data.lastMessageAt,
          unreadCount: updated[idx].unreadCount + 1,
        };
        return updated.sort(
          (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime(),
        );
      });
    };
    socket.on('conversation:update', handle);
    return () => {
      socket.off('conversation:update', handle);
    };
  }, [open]);

  if (!open) return null;

  const filtered = search
    ? conversations.filter((c) => c.other.displayName.toLowerCase().includes(search.toLowerCase()))
    : conversations;

  const handleConvClick = (convId: string) => {
    onClose();
    useMessageStore.getState().reset();
    navigate(`/messages/${convId}`);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/60" onClick={onClose} />

      {/* Slide-in panel */}
      <div className="fixed bottom-0 left-0 right-0 top-[64px] z-50 flex flex-col bg-card sm:left-auto sm:right-0 sm:top-0 sm:h-screen sm:w-[380px] sm:rounded-l-[22px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-muted px-[16px] py-[14px]">
          <p className="text-[18px] font-semibold text-foreground">Messages</p>
          <button
            onClick={onClose}
            className="flex size-[32px] items-center justify-center rounded-full hover:bg-muted"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="border-b border-muted px-[16px] py-[12px]">
          <div className="flex items-center gap-[10px] rounded-[52px] bg-muted px-[14px] py-[8px]">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="flex-1 bg-transparent text-[13px] text-foreground placeholder-muted-foreground outline-none"
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-[40px]">
              <div className="size-7 animate-spin rounded-full border-[3px] border-[#01adf1] border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-[40px] text-center text-[14px] text-muted-foreground">
              No conversations yet
            </p>
          ) : (
            filtered.map((c) => <ConvRow key={c.id} c={c} onClick={() => handleConvClick(c.id)} />)
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-muted px-[16px] py-[12px]">
          <button
            onClick={() => {
              onClose();
              navigate('/messages');
            }}
            className="w-full rounded-[8px] bg-muted py-[10px] text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            View All Messages
          </button>
        </div>
      </div>
    </>
  );
}
