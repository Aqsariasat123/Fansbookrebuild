import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { NotificationRow } from '../components/notifications/NotificationRow';
import type { Notification } from '../components/notifications/NotificationRow';

export default function Notifications() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');

  useEffect(() => {
    api
      .get('/notifications')
      .then(({ data: r }) => {
        if (r.success) setItems(r.data.items);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
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
      await api.delete(`/notifications/${id}`);
      setItems((prev) => prev.filter((n) => n.id !== id));
    } catch {
      /* ignore */
    }
  };

  const handleMarkRead = async (n: Notification) => {
    try {
      await api.put(`/notifications/${n.id}/read`);
      setItems((prev) => prev.map((item) => (item.id === n.id ? { ...item, read: true } : item)));
    } catch {
      /* ignore */
    }
  };

  const filtered = search.trim()
    ? items.filter((n) => n.message.toLowerCase().includes(search.toLowerCase()))
    : items;

  return (
    <div className="flex flex-col gap-[20px]">
      {/* Search + title + list in dark card so capsule is visible */}
      <div className="rounded-[22px] bg-[#0e1012] p-[16px] md:p-[22px]">
        {/* Search capsule - bg-[#15191c] on bg-[#0e1012] = visible */}
        <div className="flex items-center gap-[10px] rounded-[52px] bg-[#15191c] py-[8px] pl-[10px] pr-[10px] md:py-[10px] md:pl-[15px]">
          <img
            src="/icons/dashboard/search.svg"
            alt=""
            className="size-[21px] shrink-0 md:size-[24px]"
          />
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-[12px] text-[#f8f8f8] outline-none placeholder:text-[#5d5d5d] md:text-[16px]"
          />
        </div>

        <p className="mt-[16px] text-[20px] text-[#f8f8f8]">Notifications</p>

        <div className="mt-[16px]">
          {loading ? (
            <div className="flex justify-center py-[60px]">
              <div className="size-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-[40px] text-center text-[16px] text-[#5d5d5d]">
              {search.trim() ? 'No matching notifications' : 'No notifications'}
            </p>
          ) : (
            <div className="flex flex-col gap-[20px]">
              {filtered.map((n) => (
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
          )}
        </div>
      </div>
    </div>
  );
}
