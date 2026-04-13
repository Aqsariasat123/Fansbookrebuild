export interface SupportMsg {
  id: string;
  role: 'USER' | 'BOT' | 'ADMIN';
  content: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  user: { id: string; username: string; email: string } | null;
  messages: SupportMsg[];
}

export const STATUS_BADGE: Record<string, string> = {
  OPEN: 'bg-blue-100 text-blue-600',
  ESCALATED: 'bg-yellow-100 text-yellow-700',
  RESOLVED: 'bg-green-100 text-green-600',
};

export function TicketRow({
  ticket,
  selected,
  onSelect,
}: {
  ticket: SupportTicket;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <tr
      onClick={onSelect}
      className={`border-b border-gray-100 cursor-pointer text-[13px] ${selected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
    >
      <td className="px-[16px] py-[12px] text-gray-900 font-medium max-w-[200px] truncate">
        {ticket.title}
      </td>
      <td className="px-[16px] py-[12px] text-gray-600">
        {ticket.user ? `@${ticket.user.username}` : '—'}
      </td>
      <td className="px-[16px] py-[12px]">
        <span
          className={`rounded-full px-[10px] py-[4px] text-[11px] font-medium ${STATUS_BADGE[ticket.status] ?? 'bg-gray-500/20 text-gray-400'}`}
        >
          {ticket.status}
        </span>
      </td>
      <td className="px-[16px] py-[12px] text-gray-500">
        {new Date(ticket.updatedAt).toLocaleDateString()}
      </td>
    </tr>
  );
}

function msgBubbleClass(role: string) {
  if (role === 'USER') return 'bg-[#2a3a4a] text-gray-200';
  if (role === 'ADMIN') return 'bg-purple-600/20 text-purple-200 border border-purple-600/30';
  return 'bg-[#2a2a2a] text-gray-300';
}

function msgLabel(role: string) {
  if (role === 'USER') return 'User';
  if (role === 'BOT') return 'Bot';
  return 'Support Team';
}

export function ChatThread({ messages }: { messages: SupportMsg[] }) {
  return (
    <div className="flex flex-col gap-[10px] py-[12px] px-[16px] overflow-y-auto flex-1">
      {messages.map((m) => (
        <div key={m.id} className={`flex ${m.role === 'USER' ? 'justify-end' : 'justify-start'}`}>
          <div
            className={`max-w-[75%] rounded-[12px] px-[12px] py-[8px] text-[13px] leading-relaxed ${msgBubbleClass(m.role)}`}
          >
            <p className="text-[10px] mb-[4px] font-medium text-gray-500">{msgLabel(m.role)}</p>
            {m.content}
          </div>
        </div>
      ))}
    </div>
  );
}

interface TicketPanelProps {
  ticket: SupportTicket;
  replyText: string;
  onReplyChange: (v: string) => void;
  onSendReply: () => void;
  onResolve: () => void;
  sendingReply: boolean;
  resolving: boolean;
  onClose: () => void;
}

export function TicketPanel({
  ticket,
  replyText,
  onReplyChange,
  onSendReply,
  onResolve,
  sendingReply,
  resolving,
  onClose,
}: TicketPanelProps) {
  return (
    <div className="w-[380px] shrink-0 rounded-[12px] border border-gray-800 bg-card flex flex-col h-[600px]">
      <div className="flex items-center justify-between px-[16px] py-[12px] border-b border-gray-800">
        <div>
          <p className="text-[14px] font-semibold text-white truncate max-w-[220px]">
            {ticket.title}
          </p>
          <p className="text-[12px] text-gray-400">
            {ticket.user ? `@${ticket.user.username}` : 'Unknown'}
          </p>
        </div>
        <div className="flex items-center gap-[8px]">
          <span
            className={`rounded-full px-[10px] py-[4px] text-[11px] font-medium ${STATUS_BADGE[ticket.status] ?? ''}`}
          >
            {ticket.status}
          </span>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <span className="material-icons-outlined text-[18px]">close</span>
          </button>
        </div>
      </div>
      <ChatThread messages={ticket.messages} />
      <div className="border-t border-gray-800 p-[12px] flex flex-col gap-[8px]">
        <textarea
          value={replyText}
          onChange={(e) => onReplyChange(e.target.value)}
          placeholder="Type a reply…"
          rows={2}
          className="w-full rounded-[8px] bg-[#2a2a2a] px-[12px] py-[8px] text-[13px] text-white placeholder-gray-500 outline-none resize-none"
        />
        <div className="flex gap-[8px]">
          <button
            onClick={onSendReply}
            disabled={!replyText.trim() || sendingReply}
            className="flex-1 rounded-[8px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[8px] text-[13px] text-white font-medium disabled:opacity-40"
          >
            {sendingReply ? 'Sending…' : 'Send Reply'}
          </button>
          {ticket.status !== 'RESOLVED' && (
            <button
              onClick={onResolve}
              disabled={resolving}
              className="rounded-[8px] border border-green-600 px-[12px] py-[8px] text-[13px] text-green-400 hover:bg-green-600/10 disabled:opacity-40"
            >
              Resolve
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
