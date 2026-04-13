export interface SupportMessage {
  role: 'USER' | 'BOT' | 'ADMIN';
  content: string;
  createdAt?: string;
}

export function MessageBubble({ msg }: { msg: SupportMessage }) {
  const isUser = msg.role === 'USER';
  const isAdmin = msg.role === 'ADMIN';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-[12px] px-[12px] py-[8px] text-[13px] leading-relaxed ${
          isUser
            ? 'bg-gradient-to-r from-[#01adf1] to-[#a61651] text-white'
            : isAdmin
              ? 'bg-purple-600/20 text-purple-200 border border-purple-600/30'
              : 'bg-[#2a2a2a] text-gray-200'
        }`}
      >
        {isAdmin && (
          <p className="text-[10px] text-purple-400 mb-[4px] font-medium">Support Team</p>
        )}
        {msg.content}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-[#2a2a2a] rounded-[12px] px-[12px] py-[10px] flex gap-[4px] items-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-[6px] h-[6px] bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export function EscalatedBanner() {
  return (
    <div className="mx-[12px] rounded-[8px] bg-yellow-500/10 border border-yellow-500/30 px-[12px] py-[8px] text-[12px] text-yellow-400">
      Your question has been escalated to our support team. We'll reply as soon as possible.
    </div>
  );
}

export function ResolvedBanner() {
  return (
    <div className="mx-[12px] rounded-[8px] bg-green-500/10 border border-green-500/30 px-[12px] py-[8px] text-[12px] text-green-400 text-center">
      This ticket has been resolved. Start a new conversation if you need further help.
    </div>
  );
}
