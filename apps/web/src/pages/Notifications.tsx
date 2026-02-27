import { useState, useEffect } from 'react';
import { api } from '../lib/api';

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  entityType: string | null;
  createdAt: string;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} day ago`;
}

function parseEntity(entityType: string | null) {
  if (!entityType) return { avatar: '/icons/dashboard/person.svg', name: '' };
  const parts = entityType.split('|');
  let avatar = '/icons/dashboard/person.svg';
  let name = '';
  for (const p of parts) {
    if (p.startsWith('avatar:')) avatar = p.slice(7);
    if (p.startsWith('name:')) name = p.slice(5);
  }
  return { avatar, name };
}

export default function Notifications() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
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

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      setItems((prev) => prev.filter((n) => n.id !== id));
    } catch {
      /* ignore */
    }
  };

  const handleToggleRead = async (n: Notification) => {
    try {
      await api.put(`/notifications/${n.id}/read`);
      setItems((prev) => prev.map((item) => (item.id === n.id ? { ...item, read: true } : item)));
    } catch {
      /* ignore */
    }
  };

  const filtered = search
    ? items.filter((n) => n.message.toLowerCase().includes(search.toLowerCase()))
    : items;

  return (
    <div className="flex flex-col gap-[12px] md:gap-[20px]">
      <p className="text-[20px] text-[#f8f8f8]">Notifications</p>

      <div className="rounded-[11px] bg-[#0e1012] p-[10px] md:rounded-[22px] md:p-[16px]">
        {/* Search bar */}
        <div className="mb-[12px] flex items-center gap-[10px] rounded-[52px] bg-[#15191c] py-[8px] pl-[12px] pr-[12px] md:mb-[16px] md:py-[10px] md:pl-[15px] md:pr-[15px]">
          <img
            src="/icons/dashboard/search.svg"
            alt=""
            className="size-[21px] shrink-0 md:size-[24px]"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notifications..."
            className="flex-1 bg-transparent text-[12px] text-[#f8f8f8] placeholder-[#5d5d5d] outline-none md:text-[16px]"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-[60px]">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-[#5d5d5d] py-[40px] text-[16px]">
            {search ? 'No matching notifications' : 'No notifications'}
          </p>
        ) : (
          <div className="flex flex-col gap-[20px]">
            {filtered.map((n) => (
              <NotificationRow
                key={n.id}
                notification={n}
                onDelete={handleDelete}
                onMarkRead={handleToggleRead}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NotificationRow({
  notification: n,
  onDelete,
  onMarkRead,
}: {
  notification: Notification;
  onDelete: (id: string) => void;
  onMarkRead: (n: Notification) => void;
}) {
  const { avatar } = parseEntity(n.entityType);
  const isUnread = !n.read;

  return (
    <div
      className={`flex items-center justify-between gap-[8px] rounded-[8px] px-[8px] py-[8px] md:px-[10px] ${isUnread ? 'bg-[#15191c]' : 'border border-[#15191c]'}`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-[10px] md:gap-[16px]">
        <img
          src={avatar}
          alt=""
          className="size-[32px] shrink-0 rounded-full object-cover md:size-[40px]"
        />
        {/* Star icon - hidden on mobile */}
        <svg
          className="hidden shrink-0 md:block"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            stroke="#5d5d5d"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
        <div className="flex min-w-0 flex-col">
          <p
            className={`truncate text-[12px] leading-[normal] text-[#f8f8f8] md:text-[16px] ${isUnread ? 'font-medium' : ''}`}
          >
            {n.message}
          </p>
          <p className="text-[10px] leading-[normal] text-[#5d5d5d] md:text-[12px]">
            {timeAgo(n.createdAt)}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-[6px] md:gap-[12px]">
        {/* Archive */}
        <button
          onClick={() => onMarkRead(n)}
          className="opacity-60 hover:opacity-100 transition-opacity"
        >
          <svg className="size-[18px] md:size-[24px]" viewBox="0 0 24 24" fill="none">
            <path
              d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z"
              fill="#5d5d5d"
            />
          </svg>
        </button>
        {/* Notification bell */}
        <button className="opacity-60 hover:opacity-100 transition-opacity">
          <svg className="size-[18px] md:size-[24px]" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
              fill="#5d5d5d"
            />
          </svg>
        </button>
        {/* Delete */}
        <button
          onClick={() => onDelete(n.id)}
          className="opacity-60 hover:opacity-100 transition-opacity"
        >
          <svg className="size-[18px] md:size-[24px]" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
              fill="#5d5d5d"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
