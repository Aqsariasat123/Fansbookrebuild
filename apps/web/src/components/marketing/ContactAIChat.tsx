import { useState, useRef, useEffect } from 'react';
import { api } from '../../lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );
}

export function ContactAIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hi! I'm the Inscrio support assistant. Ask me anything about the platform before you send your message.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [open, messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: 'user', content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const history = next.slice(0, -1).map((m) => ({ role: m.role, content: m.content }));
      const { data } = await api.post('/contact/chat', { message: text, history });
      setMessages([...next, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages([
        ...next,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="fixed bottom-[24px] right-[24px] z-50 flex flex-col items-end gap-[12px]">
      {/* Chat window */}
      {open && (
        <div className="flex h-[460px] w-[340px] flex-col overflow-hidden rounded-[20px] border border-border bg-card shadow-2xl">
          {/* Header */}
          <div
            className="flex items-center justify-between px-[16px] py-[14px]"
            style={{
              background: 'linear-gradient(-90deg, rgb(166,22,81) 0%, rgb(1,173,241) 100%)',
            }}
          >
            <div className="flex items-center gap-[8px]">
              <div className="flex size-[32px] items-center justify-center rounded-full bg-white/20">
                <ChatIcon />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white">Inscrio Support</p>
                <p className="text-[11px] text-white/70">AI Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-[4px] text-white/80 hover:bg-white/10 hover:text-white"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Messages */}
          <div className="flex flex-1 flex-col gap-[10px] overflow-y-auto p-[14px]">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-[14px] px-[12px] py-[8px] text-[13px] leading-[1.5] ${
                    m.role === 'user'
                      ? 'rounded-br-[4px] bg-gradient-to-r from-[#01adf1] to-[#a61651] text-white'
                      : 'rounded-bl-[4px] bg-muted text-foreground'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-[14px] rounded-bl-[4px] bg-muted px-[12px] py-[10px]">
                  <div className="flex gap-[4px]">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="size-[6px] animate-bounce rounded-full bg-muted-foreground"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-[8px] border-t border-border px-[12px] py-[10px]">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Ask a question..."
              disabled={loading}
              className="flex-1 rounded-[8px] bg-muted px-[10px] py-[8px] text-[13px] text-foreground placeholder-muted-foreground outline-none disabled:opacity-50"
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="flex size-[34px] items-center justify-center rounded-full text-white disabled:opacity-40"
              style={{
                background: 'linear-gradient(-90deg, rgb(166,22,81) 0%, rgb(1,173,241) 100%)',
              }}
            >
              <SendIcon />
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex size-[56px] items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105"
        style={{ background: 'linear-gradient(-90deg, rgb(166,22,81) 0%, rgb(1,173,241) 100%)' }}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </button>
    </div>
  );
}
