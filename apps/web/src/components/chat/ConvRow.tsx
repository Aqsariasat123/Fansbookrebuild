import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export interface ConversationItem {
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

export function ConvRow({
  c,
  active,
  onClick,
}: {
  c: ConversationItem;
  active: boolean;
  onClick: () => void;
}) {
  const { other, lastMessage, lastMessageAt, unreadCount } = c;
  const isOnline = useOnlineStatus(other.id);
  const initial = other.displayName?.charAt(0)?.toUpperCase() || '?';
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-[18px] w-full h-[69px] pl-[20px] pr-[15px] py-[12px] border-b border-muted hover:bg-muted/70 transition-colors ${active ? 'bg-muted' : ''}`}
    >
      <div className="relative shrink-0">
        {other.avatar ? (
          <img src={other.avatar} alt="" className="size-[40px] rounded-full object-cover" />
        ) : (
          <div className="size-[40px] rounded-full bg-primary/30 flex items-center justify-center">
            <span className="text-[14px] font-medium text-foreground">{initial}</span>
          </div>
        )}
        {isOnline && (
          <div className="absolute bottom-0 right-0 size-[8px] rounded-full bg-green-500" />
        )}
      </div>
      <div className="flex-1 text-left min-w-0">
        <p className="text-[16px] leading-[1.7] text-foreground">{other.displayName}</p>
        <p className="text-[12px] leading-[1.7] text-muted-foreground truncate">
          {lastMessage ?? ''}
        </p>
      </div>
      <div className="flex flex-col items-end gap-[4px] shrink-0">
        <p className="text-[12px] leading-[1.7] text-muted-foreground">
          {formatTime(lastMessageAt)}
        </p>
        {unreadCount > 0 && (
          <div className="bg-muted rounded-[78px] px-[10px] py-[2px] flex items-center justify-center">
            <span className="text-[10px] leading-[1.7] text-muted-foreground">{unreadCount}</span>
          </div>
        )}
      </div>
    </button>
  );
}
