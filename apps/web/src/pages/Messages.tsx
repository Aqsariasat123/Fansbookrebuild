import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { MessagePageHeader } from '../components/chat/ChatHeader';

const IMG = '/icons/dashboard';

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

function ConvRow({
  c,
  active,
  onClick,
}: {
  c: ConversationItem;
  active: boolean;
  onClick: () => void;
}) {
  const { other, lastMessage, lastMessageAt, unreadCount } = c;
  const initial = other.displayName?.charAt(0)?.toUpperCase() || '?';
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-[18px] w-full h-[69px] pl-[20px] pr-[15px] py-[12px] border-b border-[#15191c] hover:bg-[#15191c]/70 transition-colors ${active ? 'bg-[#15191c]' : ''}`}
    >
      <div className="relative shrink-0">
        {other.avatar ? (
          <img src={other.avatar} alt="" className="size-[40px] rounded-full object-cover" />
        ) : (
          <div className="size-[40px] rounded-full bg-[#2e4882] flex items-center justify-center">
            <span className="text-[14px] font-medium text-[#f8f8f8]">{initial}</span>
          </div>
        )}
        <div className="absolute bottom-0 right-0 size-[8px] rounded-full bg-green-500" />
      </div>
      <div className="flex-1 text-left min-w-0">
        <p className="text-[16px] leading-[1.7] text-[#f8f8f8]">{other.displayName}</p>
        <p className="text-[12px] leading-[1.7] text-[#5d5d5d] truncate">{lastMessage ?? ''}</p>
      </div>
      <div className="flex flex-col items-end gap-[4px] shrink-0">
        <p className="text-[12px] leading-[1.7] text-[#5d5d5d]">{formatTime(lastMessageAt)}</p>
        {unreadCount > 0 && (
          <div className="bg-[#15191c] rounded-[78px] px-[10px] py-[2px] flex items-center justify-center">
            <span className="text-[10px] leading-[1.7] text-[#5d5d5d]">{unreadCount}</span>
          </div>
        )}
      </div>
    </button>
  );
}

export default function Messages() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/messages/conversations')
      .then(({ data: res }) => {
        if (res.success) setConversations(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = search
    ? conversations.filter((c) => c.other.displayName.toLowerCase().includes(search.toLowerCase()))
    : conversations;

  const userInitial = user?.displayName?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="flex flex-col rounded-[11px] bg-[#0e1012] md:rounded-[22px] md:h-[calc(100vh-130px)]">
      <MessagePageHeader />

      <div className="flex-1 overflow-y-auto border border-[#15191c] rounded-[8px] mx-[10px] mb-[10px] md:mx-[22px] md:mb-[22px]">
        {/* Avatar + Search + filter icons */}
        <div className="flex items-center justify-between gap-[12px] pl-[12px] pr-[12px] pt-[16px] pb-[12px] md:pl-[20px] md:pr-[40px] md:pt-[28px] md:pb-[20px]">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt=""
              className="size-[44px] rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="size-[44px] rounded-full bg-[#2e4882] flex items-center justify-center shrink-0">
              <span className="text-[16px] font-medium text-[#f8f8f8]">{userInitial}</span>
            </div>
          )}
          <div className="flex flex-1 items-center gap-[10px] rounded-[52px] bg-[#15191c] py-[8px] pl-[10px] pr-[10px] md:mx-[40px] md:py-[10px] md:pl-[15px]">
            <img src={`${IMG}/search.svg`} alt="" className="size-[21px] shrink-0 md:size-[24px]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="flex-1 bg-transparent text-[12px] text-[#f8f8f8] placeholder-[#5d5d5d] outline-none md:text-[16px]"
            />
          </div>
          <div className="flex shrink-0 items-center gap-[8px]">
            <button className="hidden hover:opacity-80 md:block">
              <img src={`${IMG}/settings.svg`} alt="" className="size-[20px] opacity-50" />
            </button>
            <button className="hover:opacity-80">
              <span className="text-[20px] text-[#5d5d5d]">&#8942;</span>
            </button>
          </div>
        </div>

        {/* Find and invite bar - separated from conversations */}
        <div className="bg-[#15191c] flex items-center justify-center py-[12px] border-b-[2px] border-[#0e1012]">
          <p className="text-[16px] text-[#5d5d5d]">Find and invite people</p>
        </div>

        {/* Conversation list */}
        {loading ? (
          <div className="flex justify-center py-[40px]">
            <div className="size-8 animate-spin rounded-full border-4 border-[#2e80c8] border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-[#5d5d5d] py-[40px]">No conversations yet</p>
        ) : (
          filtered.map((c, i) => (
            <ConvRow
              key={c.id}
              c={c}
              active={i === 0}
              onClick={() => navigate(`/messages/${c.id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
}
