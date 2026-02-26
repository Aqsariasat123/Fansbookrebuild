import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { OtherBubble, SelfBubble } from '../components/chat/ChatBubbles';
import { MessagePageHeader, ChatUserHeader } from '../components/chat/ChatHeader';
import type { ChatMessage } from '../components/chat/ChatBubbles';

export default function MessageChat() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const userId = useAuthStore((s) => s.user?.id);
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [other, setOther] = useState<{ displayName: string; avatar: string | null } | null>(null);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!conversationId) return;
    api
      .get(`/messages/${conversationId}`)
      .then(({ data: res }) => {
        if (res.success) {
          setMessages(res.data.messages);
          setOther(res.data.other);
        }
      })
      .catch(() => navigate('/messages'))
      .finally(() => setLoading(false));
    api.put(`/messages/${conversationId}/read`).catch(() => {});
  }, [conversationId, navigate]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  async function handleSend() {
    const text = newMsg.trim();
    if (!text || !conversationId || sending) return;
    setSending(true);
    try {
      const { data: res } = await api.post(`/messages/${conversationId}`, { text });
      if (res.success) {
        setMessages((prev) => [...prev, res.data]);
        setNewMsg('');
      }
    } catch {
      /* silently fail */
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-[60px]">
        <div className="size-8 animate-spin rounded-full border-4 border-[#2e80c8] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-160px)]">
      <MessagePageHeader />
      <ChatUserHeader
        otherName={other?.displayName}
        otherAvatar={other?.avatar}
        onBack={() => navigate('/messages')}
        title=""
      />

      <div ref={scrollRef} className="flex-1 overflow-y-auto flex flex-col gap-[16px] pr-[4px]">
        {messages.map((msg) =>
          msg.senderId === userId ? (
            <SelfBubble key={msg.id} msg={msg} />
          ) : (
            <OtherBubble key={msg.id} msg={msg} />
          ),
        )}
      </div>

      <div className="flex items-center gap-[10px] mt-[16px] border border-[#15191c] rounded-[8px] px-[12px] py-[10px]">
        <button className="shrink-0 hover:opacity-80">
          <span className="text-[20px]">😊</span>
        </button>
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Message"
          className="flex-1 bg-transparent text-[14px] text-[#f8f8f8] placeholder-[#5d5d5d] outline-none"
        />
        <div className="flex items-center gap-[10px] shrink-0">
          <button className="hover:opacity-80">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#5d5d5d"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21,15 16,10 5,21" />
            </svg>
          </button>
          <button className="hover:opacity-80">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#5d5d5d"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
            </svg>
          </button>
          <button
            onClick={handleSend}
            disabled={!newMsg.trim() || sending}
            className="size-[36px] rounded-full bg-[#2e80c8] flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
