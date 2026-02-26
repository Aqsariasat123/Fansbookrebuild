import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';

const IMG = '/icons/dashboard';

interface ConversationItem {
  id: string;
  other: { id: string; username: string; displayName: string; avatar: string | null };
  lastMessage: string | null;
  lastMessageAt: string;
  unreadCount: number;
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function ConversationRow({ item, onClick }: { item: ConversationItem; onClick: () => void }) {
  const { other, lastMessage, lastMessageAt, unreadCount } = item;
  const initial = other.displayName?.charAt(0)?.toUpperCase() || '?';

  return (
    <button
      onClick={onClick}
      className="flex items-center w-full py-[14px] hover:bg-[#15191c]/50 transition-colors px-[4px] rounded-[8px]"
    >
      <div className="relative shrink-0">
        {other.avatar ? (
          <img
            src={other.avatar}
            alt={other.displayName}
            className="size-[50px] rounded-full object-cover"
          />
        ) : (
          <div className="size-[50px] rounded-full bg-[#2e4882] flex items-center justify-center">
            <span className="text-[18px] font-medium text-[#f8f8f8]">{initial}</span>
          </div>
        )}
        <div className="absolute bottom-[1px] right-[1px] size-[12px] rounded-full bg-green-500 border-2 border-[#0e1012]" />
      </div>
      <div className="flex-1 ml-[12px] text-left min-w-0">
        <p className="text-[16px] font-medium text-[#f8f8f8] truncate">{other.displayName}</p>
        <p className="text-[13px] text-[#5d5d5d] truncate">{lastMessage ?? ''}</p>
      </div>
      <div className="flex flex-col items-end gap-[4px] ml-[12px] shrink-0">
        <p className="text-[12px] text-[#5d5d5d]">{formatTime(lastMessageAt)}</p>
        {unreadCount > 0 && (
          <div className="min-w-[20px] h-[20px] rounded-full bg-red-500 flex items-center justify-center px-[5px]">
            <span className="text-[11px] text-white font-medium">{unreadCount}</span>
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

  const initial = user?.displayName?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-[16px]">
        <p className="text-[24px] font-bold text-[#f8f8f8]">Message</p>
        <div className="flex items-center gap-[10px]">
          <button className="flex items-center gap-[6px] bg-[#15191c] rounded-[8px] px-[14px] py-[8px] text-[14px] text-[#f8f8f8] hover:opacity-80 transition-opacity">
            <img src={`${IMG}/person-heart.svg`} alt="" className="size-[18px]" />
            Invite
          </button>
          <button className="size-[36px] rounded-full flex items-center justify-center hover:bg-[#15191c] transition-colors">
            <img src={`${IMG}/notifications.svg`} alt="" className="size-[20px]" />
          </button>
        </div>
      </div>

      {/* Avatar + Search row */}
      <div className="flex items-center gap-[12px] mb-[12px]">
        <div className="shrink-0">
          {user?.avatar ? (
            <img src={user.avatar} alt="" className="size-[50px] rounded-full object-cover" />
          ) : (
            <div className="size-[50px] rounded-full bg-[#2e4882] flex items-center justify-center">
              <span className="text-[18px] font-medium text-[#f8f8f8]">{initial}</span>
            </div>
          )}
        </div>
        <div className="flex-1 flex items-center gap-[10px] bg-[#15191c] rounded-[52px] px-[14px] py-[10px]">
          <img src={`${IMG}/search.svg`} alt="" className="size-[20px]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="flex-1 bg-transparent text-[14px] text-[#f8f8f8] placeholder-[#5d5d5d] outline-none"
          />
        </div>
        <div className="flex items-center gap-[6px]">
          <button className="size-[36px] flex items-center justify-center hover:opacity-80">
            <img src={`${IMG}/settings.svg`} alt="" className="size-[20px] opacity-50" />
          </button>
          <button className="size-[36px] flex items-center justify-center hover:opacity-80">
            <span className="text-[20px] text-[#5d5d5d]">⋮</span>
          </button>
        </div>
      </div>

      {/* Find and invite */}
      <div className="text-center py-[10px] border-b border-[#2a2d30] mb-[4px]">
        <p className="text-[14px] text-[#5d5d5d]">Find and invite people</p>
      </div>

      {/* Conversation list */}
      {loading ? (
        <div className="flex justify-center py-[40px]">
          <div className="size-8 animate-spin rounded-full border-4 border-[#2e80c8] border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-[#5d5d5d] py-[40px]">No conversations yet</p>
      ) : (
        <div className="flex flex-col">
          {filtered.map((c) => (
            <ConversationRow key={c.id} item={c} onClick={() => navigate(`/messages/${c.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}
