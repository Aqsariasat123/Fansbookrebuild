import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { getSocket } from '../lib/socket';
import { ConvRow, type ConversationItem } from '../components/chat/ConvRow';
import { MessageChatPanel } from '../components/chat/MessageChatPanel';
import { ChatUserHeader } from '../components/chat/ChatHeader';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

const IMG = '/icons/dashboard';

function ConvSearchBar({
  user,
  search,
  setSearch,
}: {
  user: ReturnType<typeof useAuthStore.getState>['user'];
  search: string;
  setSearch: (v: string) => void;
}) {
  const navigate = useNavigate();
  const initial = user?.displayName?.charAt(0)?.toUpperCase() || '?';
  return (
    <div className="flex items-center justify-between gap-[12px] pl-[12px] pr-[12px] pt-[16px] pb-[12px] md:pl-[20px] md:pr-[20px] md:pt-[20px] md:pb-[16px]">
      {user?.avatar ? (
        <img src={user.avatar} alt="" className="size-[40px] rounded-full object-cover shrink-0" />
      ) : (
        <div className="size-[40px] rounded-full bg-primary/30 flex items-center justify-center shrink-0">
          <span className="text-[14px] font-medium text-foreground">{initial}</span>
        </div>
      )}
      <div className="flex flex-1 items-center gap-[10px] rounded-[52px] bg-muted py-[8px] pl-[10px] pr-[10px] md:py-[8px] md:pl-[12px]">
        <img src={`${IMG}/search.svg`} alt="" className="size-[18px] shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="flex-1 bg-transparent text-[13px] text-foreground placeholder-muted-foreground outline-none"
        />
      </div>
      <button
        onClick={() => navigate('/settings')}
        className="shrink-0 hover:opacity-80 transition-opacity"
      >
        <img src={`${IMG}/settings.svg`} alt="" className="size-[20px] opacity-50" />
      </button>
    </div>
  );
}

function EmptyChat() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-[12px] text-center p-[40px]">
      <svg
        width="56"
        height="56"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-muted-foreground/40"
      >
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
      <p className="text-[15px] font-medium text-muted-foreground">Select a conversation</p>
      <p className="text-[13px] text-muted-foreground/60">
        Choose from your existing conversations on the left
      </p>
    </div>
  );
}

function RightPanelHeader({ conv, onBack }: { conv: ConversationItem; onBack: () => void }) {
  const isOnline = useOnlineStatus(conv.other.id);
  return (
    <ChatUserHeader
      otherName={conv.other.displayName}
      otherAvatar={conv.other.avatar}
      otherId={conv.other.id}
      conversationId={conv.id}
      onBack={onBack}
      isOnline={isOnline}
    />
  );
}

export default function Messages() {
  const user = useAuthStore((s) => s.user);
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedConv = conversations.find((c) => c.id === selectedId) ?? null;

  useEffect(() => {
    const targetUser = searchParams.get('user');
    if (!targetUser) return;
    api
      .post('/messages/conversations', { username: targetUser })
      .then(({ data: res }) => {
        if (res.success) setSelectedId(res.data.conversationId);
      })
      .catch(() => {});
  }, [searchParams]);

  useEffect(() => {
    api
      .get('/messages/conversations')
      .then(({ data: res }) => {
        if (res.success) setConversations(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const handler = (data: {
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
    socket.on('conversation:update', handler);
    return () => {
      socket.off('conversation:update', handler);
    };
  }, []);

  const filtered = search
    ? conversations.filter((c) => c.other.displayName.toLowerCase().includes(search.toLowerCase()))
    : conversations;

  return (
    <div className="flex rounded-[11px] bg-card h-[calc(100vh-130px)] md:rounded-[22px] overflow-hidden">
      {/* Left panel — conversation list */}
      <div
        className={`flex flex-col border-r border-muted ${selectedId ? 'hidden md:flex md:w-[320px] lg:w-[360px]' : 'flex flex-1 md:flex md:w-[320px] lg:w-[360px]'} shrink-0`}
      >
        {/* Left header */}
        <div className="border-b border-muted px-[16px] py-[14px]">
          <p className="text-[18px] font-semibold text-foreground">Messages</p>
        </div>
        <ConvSearchBar user={user} search={search} setSearch={setSearch} />
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-[40px]">
              <div className="size-8 animate-spin rounded-full border-4 border-[#2e80c8] border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-[40px] text-[14px]">
              No conversations yet
            </p>
          ) : (
            filtered.map((c) => (
              <ConvRow
                key={c.id}
                c={c}
                active={c.id === selectedId}
                onClick={() => setSelectedId(c.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Right panel — chat area */}
      <div
        className={`flex flex-col flex-1 overflow-hidden ${selectedId ? 'flex' : 'hidden md:flex'}`}
      >
        {selectedConv ? (
          <>
            <RightPanelHeader conv={selectedConv} onBack={() => setSelectedId(null)} />
            <MessageChatPanel
              key={selectedId}
              conversationId={selectedId!}
              onBack={() => setSelectedId(null)}
              hideHeader
            />
          </>
        ) : (
          <EmptyChat />
        )}
      </div>
    </div>
  );
}
