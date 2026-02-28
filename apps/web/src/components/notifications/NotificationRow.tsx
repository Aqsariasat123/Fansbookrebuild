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
    if (p.startsWith('avatar:')) avatar = p.slice(7);
  }
  return { avatar };
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
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="hidden shrink-0 md:block"
        >
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
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
