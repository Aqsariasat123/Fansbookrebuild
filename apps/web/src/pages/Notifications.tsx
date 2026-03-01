import { useState, useEffect, useMemo } from 'react';
import { api } from '../lib/api';
import { getSocket } from '../lib/socket';
import { useNotificationStore } from '../stores/notificationStore';
import { NotificationRow } from '../components/notifications/NotificationRow';
import type { Notification } from '../components/notifications/NotificationRow';

const FILTER_TABS = ['All', 'Likes', 'Comments', 'Follows', 'Tips', 'System'] as const;
type FilterTab = (typeof FILTER_TABS)[number];

const TAB_TYPE_MAP: Record<FilterTab, string | null> = {
  All: null,
  Likes: 'LIKE',
  Comments: 'COMMENT',
  Follows: 'FOLLOW',
  Tips: 'TIP',
  System: 'SYSTEM',
};

function getDateGroup(dateStr: string): string {
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays < 1 && now.getDate() === d.getDate()) return 'Today';
  if (diffDays < 7) return 'This Week';
  return 'Earlier';
}

export default function Notifications() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const decrement = useNotificationStore((s) => s.decrement);
  const resetNotif = useNotificationStore((s) => s.reset);

  useEffect(() => {
    api
      .get('/notifications')
      .then(({ data: r }) => {
        if (r.success) setItems(r.data.items);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Real-time notification updates
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNew = (data: Notification) => {
      setItems((prev) => [data, ...prev]);
    };

    socket.on('notification:new', handleNew);
    return () => {
      socket.off('notification:new', handleNew);
    };
  }, []);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const item = items.find((n) => n.id === id);
      await api.delete(`/notifications/${id}`);
      setItems((prev) => prev.filter((n) => n.id !== id));
      if (item && !item.read) decrement();
    } catch {
      /* ignore */
    }
  };

  const handleMarkRead = async (n: Notification) => {
    try {
      await api.put(`/notifications/${n.id}/read`);
      setItems((prev) => prev.map((item) => (item.id === n.id ? { ...item, read: true } : item)));
      if (!n.read) decrement();
    } catch {
      /* ignore */
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setItems((prev) => prev.map((item) => ({ ...item, read: true })));
      resetNotif();
    } catch {
      /* ignore */
    }
  };

  const grouped = useMemo(() => {
    let filtered = items;
    if (search.trim()) {
      filtered = filtered.filter((n) => n.message.toLowerCase().includes(search.toLowerCase()));
    }
    const typeFilter = TAB_TYPE_MAP[activeTab];
    if (typeFilter) {
      filtered = filtered.filter((n) => n.type === typeFilter);
    }
    const groups: { label: string; items: Notification[] }[] = [];
    const order = ['Today', 'This Week', 'Earlier'];
    const map = new Map<string, Notification[]>();
    for (const n of filtered) {
      const g = getDateGroup(n.createdAt);
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(n);
    }
    for (const label of order) {
      const list = map.get(label);
      if (list && list.length > 0) groups.push({ label, items: list });
    }
    return groups;
  }, [items, search, activeTab]);

  const totalFiltered = grouped.reduce((acc, g) => acc + g.items.length, 0);
  const hasUnread = items.some((n) => !n.read);

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="rounded-[22px] bg-card p-[16px] md:p-[22px]">
        {/* Search */}
        <div className="flex items-center gap-[10px] rounded-[52px] bg-muted py-[8px] pl-[10px] pr-[10px] md:py-[10px] md:pl-[15px]">
          <img
            src="/icons/dashboard/search.svg"
            alt=""
            className="size-[21px] shrink-0 md:size-[24px]"
          />
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-[12px] text-foreground outline-none placeholder:text-muted-foreground md:text-[16px]"
          />
        </div>

        <div className="mt-[16px] flex items-center justify-between">
          <p className="text-[20px] text-foreground">Notifications</p>
          {hasUnread && (
            <button
              onClick={handleMarkAllRead}
              className="rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[16px] py-[6px] text-[12px] font-medium text-white transition-opacity hover:opacity-90 md:text-[14px]"
            >
              Mark All Read
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="mt-[12px] flex gap-[8px] overflow-x-auto pb-[4px]">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 rounded-[50px] px-[16px] py-[6px] text-[12px] font-medium transition-colors md:text-[14px] ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-[#01adf1] to-[#a61651] text-white'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-[16px]">
          {loading ? (
            <div className="flex justify-center py-[60px]">
              <div className="size-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
            </div>
          ) : totalFiltered === 0 ? (
            <p className="py-[40px] text-center text-[16px] text-muted-foreground">
              {search.trim() ? 'No matching notifications' : 'No notifications'}
            </p>
          ) : (
            <div className="flex flex-col gap-[24px]">
              {grouped.map((group) => (
                <div key={group.label}>
                  <p className="mb-[8px] text-[13px] font-medium uppercase tracking-wider text-muted-foreground">
                    {group.label}
                  </p>
                  <div className="flex flex-col gap-[12px]">
                    {group.items.map((n) => (
                      <NotificationRow
                        key={n.id}
                        notification={n}
                        isSelected={selected.has(n.id)}
                        onToggleSelect={toggleSelect}
                        onDelete={handleDelete}
                        onMarkRead={handleMarkRead}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
