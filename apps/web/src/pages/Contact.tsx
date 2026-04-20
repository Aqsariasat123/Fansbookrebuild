import { useState, useRef, useEffect } from 'react';
import { MarketingNav } from '../components/marketing/MarketingNav';
import { CTASection, MarketingFooter } from '../components/marketing/MarketingFooter';
import { ContactForm } from '../components/marketing/ContactForm';
import { api } from '../lib/api';

const GRAD = 'linear-gradient(-90deg, rgb(166,22,81) 0%, rgb(1,173,241) 100%)';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL: Message[] = [
  {
    role: 'assistant',
    content:
      "Hi! I'm the Inscrio support assistant. Ask me anything about the platform — pricing, features, payouts, streaming, and more.",
  },
];

export default function Contact() {
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatLoading]);

  const send = async () => {
    const text = input.trim();
    if (!text || chatLoading) return;
    const userMsg: Message = { role: 'user', content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setChatLoading(true);
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
      setChatLoading(false);
    }
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="min-h-screen font-outfit">
      {/* Hero */}
      <div className="relative h-[280px] md:h-[355px]">
        <div className="absolute inset-0">
          <img
            src="/images/contact/hero-bg.webp"
            alt=""
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[rgba(21,25,28,0.9)]" />
        </div>
        <MarketingNav />
        <div className="absolute inset-x-0 top-[100px] flex flex-col items-center gap-[14px] px-[20px] text-white md:top-[135px] md:px-0">
          <h1 className="text-center text-[30px] font-medium md:text-[48px]">Contact Inscrio</h1>
          <p className="text-center text-[15px] font-normal md:text-[20px]">
            Got a question? Our AI assistant can answer most things instantly.
          </p>
        </div>
      </div>

      {/* AI Chat — primary content */}
      <div className="w-full bg-muted px-[20px] py-[48px] md:px-0 md:py-[64px]">
        <div className="mx-auto flex max-w-[640px] flex-col overflow-hidden rounded-[20px] border border-border bg-card shadow-2xl">
          {/* Header */}
          <div
            className="flex items-center gap-[10px] px-[20px] py-[16px]"
            style={{ background: GRAD }}
          >
            <div className="flex size-[36px] shrink-0 items-center justify-center rounded-full bg-white/20">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-white"
              >
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
              </svg>
            </div>
            <div>
              <p className="text-[14px] font-semibold text-white">Inscrio Support</p>
              <p className="text-[11px] text-white/70">AI Assistant · Usually replies instantly</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex min-h-[380px] flex-col gap-[12px] overflow-y-auto p-[20px] md:min-h-[440px]">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-[16px] px-[14px] py-[10px] text-[14px] leading-[1.6] ${m.role === 'user' ? 'rounded-br-[4px] text-white' : 'rounded-bl-[4px] bg-muted text-foreground'}`}
                  style={m.role === 'user' ? { background: GRAD } : {}}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="rounded-[16px] rounded-bl-[4px] bg-muted px-[14px] py-[12px]">
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
          <div className="flex items-center gap-[10px] border-t border-border px-[16px] py-[12px]">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Ask a question..."
              disabled={chatLoading}
              autoFocus
              className="flex-1 rounded-[10px] bg-muted px-[14px] py-[10px] text-[14px] text-foreground placeholder-muted-foreground outline-none disabled:opacity-50"
            />
            <button
              onClick={send}
              disabled={!input.trim() || chatLoading}
              className="flex size-[40px] shrink-0 items-center justify-center rounded-full text-white disabled:opacity-40"
              style={{ background: GRAD }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Still need help? */}
        {!showForm && (
          <div className="mx-auto mt-[28px] flex max-w-[640px] justify-center">
            <button
              onClick={() => setShowForm(true)}
              className="text-[14px] text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Still need help? Send us a message directly
            </button>
          </div>
        )}
      </div>

      {/* Contact Form — revealed on demand */}
      {showForm && (
        <div className="w-full bg-muted px-[20px] pb-[64px] md:px-0">
          <ContactForm />
        </div>
      )}

      <CTASection />
      <MarketingFooter />
    </div>
  );
}
