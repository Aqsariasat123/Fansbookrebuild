import { useState, useRef, useEffect } from 'react';
import { api } from '../lib/api';
import {
  MessageBubble,
  TypingIndicator,
  EscalatedBanner,
  ResolvedBanner,
  SupportMessage,
} from './SupportChatWidgetParts';

export function SupportChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [ticketId, setTicketId] = useState<string | undefined>();
  const [escalated, setEscalated] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // On mount, restore existing open ticket if any
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
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!open && messages.length === 0) {
      setMessages([
        {
          role: 'BOT',
          content: "Hi! I'm the Inscrio support assistant. How can I help you today?",
        },
      ]);
    }
  }, [open, messages.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Poll for admin replies every 10s when ticket exists
  useEffect(() => {
    if (!ticketId) return;
    pollRef.current = setInterval(async () => {
      try {
        const { data: r } = await api.get(`/support/tickets/${ticketId}`);
        if (r.success) {
          const fetched: SupportMessage[] = r.data.messages;
          if (r.data.status === 'RESOLVED') {
            setResolved(true);
            if (pollRef.current) clearInterval(pollRef.current);
          }
          setMessages((prev) => {
            if (fetched.length > prev.length && !open) setHasNewMessage(true);
            return fetched;
          });
        }
      } catch {
        // ignore
      }
    }, 10000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [ticketId, open]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'USER', content: text }]);
    setLoading(true);

    try {
      const { data: r } = await api.post('/support/chat', { message: text, ticketId });
      if (r.success) {
        const { reply, escalated: esc, ticketId: tid } = r.data;
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

  function handleOpen() {
    setOpen(true);
    setHasNewMessage(false);
  }

  return (
    <div className="fixed bottom-[24px] right-[24px] z-50 flex flex-col items-end gap-[12px]">
      {/* Chat panel */}
      {open && (
        <div className="flex flex-col w-[340px] h-[480px] rounded-[16px] border border-gray-700 bg-[#1a1a1a] shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[16px] py-[12px]">
            <div className="flex items-center gap-[8px]">
              <span className="material-icons-outlined text-white text-[18px]">support_agent</span>
              <div>
                <p className="text-[14px] font-semibold text-white">Support</p>
                <p className="text-[11px] text-white/80">Inscrio Help</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">
              <span className="material-icons-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-[12px] py-[12px] flex flex-col gap-[10px]">
            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} />
            ))}
            {loading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {escalated && !resolved && <EscalatedBanner />}
          {resolved && <ResolvedBanner />}

          {/* Input */}
          {!resolved && (
            <div className="border-t border-gray-700 px-[12px] py-[10px] flex gap-[8px]">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Type a message…"
                className="flex-1 rounded-[8px] bg-[#2a2a2a] px-[12px] py-[8px] text-[13px] text-white placeholder-gray-500 outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="rounded-[8px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[12px] py-[8px] text-white disabled:opacity-40"
              >
                <span className="material-icons-outlined text-[18px]">send</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={handleOpen}
        className="relative flex h-[56px] w-[56px] items-center justify-center rounded-full bg-gradient-to-r from-[#01adf1] to-[#a61651] shadow-lg hover:scale-105 transition-transform"
      >
        <span className="material-icons-outlined text-white text-[24px]">
          {open ? 'close' : 'support_agent'}
        </span>
        {hasNewMessage && (
          <span className="absolute top-0 right-0 h-[12px] w-[12px] rounded-full bg-red-500 border-2 border-[#1a1a1a]" />
        )}
      </button>
    </div>
  );
}
