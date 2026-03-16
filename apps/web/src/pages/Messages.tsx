import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { getSocket } from '../lib/socket';
import { MessagePageHeader } from '../components/chat/ChatHeader';
import { ConvRow, type ConversationItem } from '../components/chat/ConvRow';

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
  const [menuOpen, setMenuOpen] = useState(false);
  const initial = user?.displayName?.charAt(0)?.toUpperCase() || '?';
  return (
    <div className="flex items-center justify-between gap-[12px] pl-[12px] pr-[12px] pt-[16px] pb-[12px] md:pl-[20px] md:pr-[40px] md:pt-[28px] md:pb-[20px]">
      {user?.avatar ? (
        <img src={user.avatar} alt="" className="size-[44px] rounded-full object-cover shrink-0" />
      ) : (
        <div className="size-[44px] rounded-full bg-primary/30 flex items-center justify-center shrink-0">
          <span className="text-[16px] font-medium text-foreground">{initial}</span>
        </div>
      )}
      <div className="flex flex-1 items-center gap-[10px] rounded-[52px] bg-muted py-[8px] pl-[10px] pr-[10px] md:mx-[40px] md:py-[10px] md:pl-[15px]">
        <img src={`${IMG}/search.svg`} alt="" className="size-[21px] shrink-0 md:size-[24px]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="flex-1 bg-transparent text-[12px] text-foreground placeholder-muted-foreground outline-none md:text-[16px]"
        />
      </div>
      <div className="relative flex shrink-0 items-center gap-[8px]">
        <button className="hidden hover:opacity-80 md:block">
          <img src={`${IMG}/settings.svg`} alt="" className="size-[20px] opacity-50" />
        </button>
        <button onClick={() => setMenuOpen((v) => !v)} className="hover:opacity-80">
          <span className="text-[20px] text-muted-foreground">&#8942;</span>
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-[30px] z-20 min-w-[160px] rounded-[12px] bg-card shadow-lg border border-muted overflow-hidden">
              <button
                onClick={() => {
                  navigate('/explore');
                  setMenuOpen(false);
                }}
                className="flex w-full items-center px-[16px] py-[12px] text-[14px] text-foreground hover:bg-muted"
              >
                New Message
              </button>
              <button
                onClick={() => {
                  navigate('/settings');
                  setMenuOpen(false);
                }}
                className="flex w-full items-center px-[16px] py-[12px] text-[14px] text-foreground hover:bg-muted"
              >
                Settings
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ConvList({
  loading,
  conversations,
  onOpen,
}: {
  loading: boolean;
  conversations: ConversationItem[];
  onOpen: (id: string) => void;
}) {
  if (loading)
    return (
      <div className="flex justify-center py-[40px]">
        <div className="size-8 animate-spin rounded-full border-4 border-[#2e80c8] border-t-transparent" />
      </div>
    );
  if (conversations.length === 0)
    return <p className="text-center text-muted-foreground py-[40px]">No conversations yet</p>;
  return (
    <>
      {conversations.map((c, i) => (
        <ConvRow key={c.id} c={c} active={i === 0} onClick={() => onOpen(c.id)} />
      ))}
    </>
  );
}

export default function Messages() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const targetUser = searchParams.get('user');
    if (!targetUser) return;
    api
      .post('/messages/conversations', { username: targetUser })
      .then(({ data: res }) => {
        if (res.success) navigate(`/messages/${res.data.conversationId}`, { replace: true });
      })
      .catch(() => {});
  }, [searchParams, navigate]);

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
    <div className="flex flex-col rounded-[11px] bg-card h-[calc(100vh-160px)] md:rounded-[22px] md:h-[calc(100vh-130px)]">
      <MessagePageHeader />
      <div className="flex-1 overflow-y-auto border border-muted rounded-[8px] mx-[10px] mb-[10px] md:mx-[22px] md:mb-[22px]">
        <ConvSearchBar user={user} search={search} setSearch={setSearch} />
        <div className="bg-muted flex items-center justify-center py-[12px] border-b-[2px] border-card">
          <p className="text-[16px] text-muted-foreground">Find and invite people</p>
        </div>
        <ConvList
          loading={loading}
          conversations={filtered}
          onOpen={(id) => navigate(`/messages/${id}`)}
        />
      </div>
    </div>
  );
}
