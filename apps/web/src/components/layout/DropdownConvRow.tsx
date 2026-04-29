import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export interface ConversationItem {
  id: string;
  other: { id: string; username: string; displayName: string; avatar: string | null };
  lastMessage: string | null;
  lastMessageAt: string;
  unreadCount: number;
}

export function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function ConvRow({ c, onClick }: { c: ConversationItem; onClick: () => void }) {
  const isOnline = useOnlineStatus(c.other.id);
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-[14px] border-b border-muted px-[16px] py-[12px] text-left transition-colors hover:bg-muted/70"
    >
      <div className="relative shrink-0">
        {c.other.avatar ? (
          <img src={c.other.avatar} alt="" className="size-[40px] rounded-full object-cover" />
        ) : (
          <div className="flex size-[40px] items-center justify-center rounded-full bg-primary/30">
            <span className="text-[14px] font-medium text-foreground">
              {c.other.displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        {isOnline && (
          <div className="absolute bottom-0 right-0 size-[8px] rounded-full bg-green-500" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] text-foreground">{c.other.displayName}</p>
        <p className="truncate text-[12px] text-muted-foreground">{c.lastMessage ?? ''}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-[4px]">
        <p className="text-[11px] text-muted-foreground">{formatTime(c.lastMessageAt)}</p>
        {c.unreadCount > 0 && (
          <div className="flex items-center justify-center rounded-full bg-[#01adf1]/20 px-[8px] py-[1px]">
            <span className="text-[10px] text-[#01adf1]">{c.unreadCount}</span>
          </div>
        )}
      </div>
    </button>
  );
}
