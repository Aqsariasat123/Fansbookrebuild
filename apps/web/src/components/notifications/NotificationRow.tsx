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
  if (!entityType) return { avatar: '/icons/dashboard/person.svg' };
  const parts = entityType.split('|');
  let avatar = '/icons/dashboard/person.svg';
  for (const p of parts) {
    if (p.startsWith('avatar:')) avatar = p.slice(7) || '/icons/dashboard/person.svg';
  }
  return { avatar };
}

function TypeIcon({ type }: { type: string }) {
  const cls = 'hidden shrink-0 md:block';
  switch (type) {
    case 'LIKE':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={cls}>
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="#ef4444"
          />
        </svg>
      );
    case 'COMMENT':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={cls}>
          <path
            d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'FOLLOW':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={cls}>
          <path
            d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            fill="currentColor"
          />
        </svg>
      );
    case 'SUBSCRIBE':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={cls}>
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill="#f59e0b"
          />
        </svg>
      );
    case 'TIP':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={cls}>
          <path
            d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"
            fill="#22c55e"
          />
        </svg>
      );
    case 'MESSAGE':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={cls}>
          <path
            d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"
            fill="currentColor"
          />
        </svg>
      );
    default:
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={cls}>
          <path
            d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
            fill="currentColor"
          />
        </svg>
      );
  }
}

export type { Notification };

export function NotificationRow({
  notification: n,
  isSelected,
  onToggleSelect,
  onDelete,
  onMarkRead,
}: {
  notification: Notification;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onMarkRead: (n: Notification) => void;
}) {
  const { avatar } = parseEntity(n.entityType);
  const isUnread = !n.read;
  const rowBg = isUnread ? 'bg-muted' : 'border border-muted';

  return (
    <div className={`flex items-center justify-between ${rowBg} rounded-[8px] px-[10px] py-[8px]`}>
      <div className="flex items-center gap-[16px]">
        <button onClick={() => onToggleSelect(n.id)} className="shrink-0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            {isSelected ? (
              <>
                <rect x="3" y="3" width="18" height="18" rx="2" fill="#01adf1" />
                <path
                  d="M9 12l2 2 4-4"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            ) : (
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
              />
            )}
          </svg>
        </button>
        <img src={avatar} alt="" className="size-[40px] shrink-0 rounded-full object-cover" />
        <TypeIcon type={n.type} />
        <div>
          <p
            className={`text-[14px] text-foreground md:text-[16px] ${isUnread ? 'font-medium' : ''}`}
          >
            {n.message}
          </p>
          <p className="text-[12px] text-muted-foreground">{timeAgo(n.createdAt)}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-[12px]">
        <button
          onClick={() => onMarkRead(n)}
          className="opacity-60 transition-opacity hover:opacity-100"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z"
              fill="currentColor"
            />
          </svg>
        </button>
        <button className="opacity-60 transition-opacity hover:opacity-100">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
              fill="currentColor"
            />
          </svg>
        </button>
        <button
          onClick={() => onDelete(n.id)}
          className="opacity-60 transition-opacity hover:opacity-100"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
