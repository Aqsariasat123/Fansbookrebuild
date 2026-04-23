import { useState, useRef, useEffect } from 'react';
import { api } from '../../lib/api';
import {
  MessageBubble,
  TypingIndicator,
  EscalatedBanner,
  ResolvedBanner,
  SupportMessage,
} from '../SupportChatWidgetParts';

export function InlineSupportChat() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [ticketId, setTicketId] = useState<string | undefined>();
  const [escalated, setEscalated] = useState(false);
  const [resolved, setResolved] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const greeting = "Hi! I'm the Inscrio support assistant. How can I help you today?";

  useEffect(() => {
    api
      .get('/support/tickets/my')
      .then(({ data: r }) => {
        if (r.success && r.data.length > 0) {
          const latest = r.data[0];
          if (latest.status !== 'RESOLVED') {
            setTicketId(latest.id);
            setMessages(latest.messages);
            setEscalated(latest.status === 'ESCALATED');
            return;
          }
        }
        setMessages([{ role: 'BOT', content: greeting }]);
      })
      .catch(() => setMessages([{ role: 'BOT', content: greeting }]));
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (!ticketId) return;
    pollRef.current = setInterval(async () => {
      try {
        const { data: r } = await api.get(`/support/tickets/${ticketId}`);
        if (r.success) {
          if (r.data.status === 'RESOLVED') {
            setResolved(true);
            if (pollRef.current) clearInterval(pollRef.current);
          }
          setMessages(r.data.messages as SupportMessage[]);
        }
      } catch {
        /* ignore */
      }
    }, 10000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [ticketId]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'USER', content: text }]);
    setLoading(true);
    try {
      const { data: r } = await api.post('/support/chat', { message: text, ticketId });
      if (r.success) {
        const {
          reply,
          escalated: esc,
          ticketId: tid,
        } = r.data as {
          reply: string;
          escalated: boolean;
          ticketId: string;
        };
        setTicketId(tid);
        setMessages((prev) => [...prev, { role: 'BOT', content: reply }]);
        if (esc) setEscalated(true);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'BOT', content: 'Something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[420px] rounded-[12px] border border-muted overflow-hidden">
      <div className="flex items-center gap-[8px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[16px] py-[12px]">
        <span className="material-icons-outlined text-white text-[18px]">support_agent</span>
        <div>
          <p className="text-[14px] font-semibold text-white">AI Support Assistant</p>
          <p className="text-[11px] text-white/80">Ask me anything — we're here to help</p>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-[12px] py-[12px] flex flex-col gap-[10px] bg-card"
      >
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}
        {loading && <TypingIndicator />}
      </div>

      {escalated && !resolved && <EscalatedBanner />}
      {resolved && <ResolvedBanner />}

      {!resolved && (
        <div className="border-t border-muted px-[12px] py-[10px] flex gap-[8px] bg-card">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && void sendMessage()}
            placeholder="Type a message…"
            className="flex-1 rounded-[8px] bg-muted px-[12px] py-[8px] text-[13px] text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button
            onClick={() => void sendMessage()}
            disabled={!input.trim() || loading}
            className="rounded-[8px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[12px] py-[8px] text-white disabled:opacity-40"
          >
            <span className="material-icons-outlined text-[18px]">send</span>
          </button>
        </div>
      )}
    </div>
  );
}
