import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useNotificationStore } from '../../stores/notificationStore';
import { getSocket } from '../../lib/socket';

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  actorId: string | null;
  entityId: string | null;
  entityType: string | null;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const TYPE_ICONS: Record<string, string> = {
  LIKE: 'favorite',
  COMMENT: 'mode_comment',
  FOLLOW: 'person_add',
  SUBSCRIBE: 'workspace_premium',
  TIP: 'volunteer_activism',
  MESSAGE: 'chat',
  LIVE: 'videocam',
  STORY: 'auto_stories',
  MENTION: 'alternate_email',
  POST: 'article',
  SYSTEM: 'info',
  BADGE: 'military_tech',
  MARKETPLACE: 'storefront',
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export function NotificationDropdown({ open, onClose }: Props) {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const reset = useNotificationStore((s) => s.reset);

  const fetchNotifs = useCallback(() => {
    setLoading(true);
    api
      .get('/notifications?limit=10')
      .then((res) => setItems(res.data.data?.items ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (open) fetchNotifs();
  }, [open, fetchNotifs]);

  // Listen for new notifications to prepend
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const handle = (n: Notification) => {
      setItems((prev) => [n, ...prev].slice(0, 10));
    };
    socket.on('notification:new', handle);
    return () => {
      socket.off('notification:new', handle);
    };
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);

  const markAllRead = async () => {
    await api.put('/notifications/read-all').catch(() => {});
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    reset();
  };

  const handleClick = async (n: Notification) => {
    if (!n.read) {
      await api.put(`/notifications/${n.id}/read`).catch(() => {});
    }
    onClose();
    navigate('/notifications');
  };

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="absolute top-[52px] right-0 z-50 w-[360px] rounded-[16px] bg-card shadow-2xl border border-muted-foreground/10 overflow-hidden"
    >
      <div className="flex items-center justify-between px-[16px] py-[12px] border-b border-muted-foreground/10">
        <p className="text-[15px] font-semibold text-foreground">Notifications</p>
        <button onClick={markAllRead} className="text-[12px] text-[#01adf1] hover:underline">
          Mark all as read
        </button>
      </div>

      <div className="max-h-[380px] overflow-y-auto">
        {loading && items.length === 0 && (
          <p className="p-[16px] text-center text-[13px] text-muted-foreground">Loading...</p>
        )}
        {!loading && items.length === 0 && (
          <p className="p-[16px] text-center text-[13px] text-muted-foreground">
            No notifications yet
          </p>
        )}
        {items.map((n) => (
          <button
            key={n.id}
            onClick={() => handleClick(n)}
            className={`w-full flex items-start gap-[12px] px-[16px] py-[12px] text-left hover:bg-muted/50 transition-colors ${!n.read ? 'bg-muted/30' : ''}`}
          >
            <span className="material-icons-outlined text-[20px] text-[#01adf1] mt-[2px]">
              {TYPE_ICONS[n.type] || 'notifications'}
            </span>
            <div className="flex-1 min-w-0">
              <p
                className={`text-[13px] leading-[1.4] ${!n.read ? 'text-foreground font-medium' : 'text-muted-foreground'}`}
              >
                {n.message}
              </p>
              <p className="text-[11px] text-muted-foreground mt-[2px]">{timeAgo(n.createdAt)}</p>
            </div>
            {!n.read && <span className="mt-[6px] size-[8px] rounded-full bg-[#01adf1] shrink-0" />}
          </button>
        ))}
      </div>

      <button
        onClick={() => {
          onClose();
          navigate('/notifications');
        }}
        className="w-full py-[12px] text-center text-[13px] text-[#01adf1] hover:bg-muted/50 border-t border-muted-foreground/10"
      >
        View all notifications
      </button>
    </div>
  );
}
