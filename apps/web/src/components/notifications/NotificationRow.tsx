import { Link } from 'react-router-dom';
import { NotificationTypeIcon } from './NotificationTypeIcon';

export interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  archived?: boolean;
  entityId: string | null;
  entityType: string | null;
  actorId: string | null;
  actorAvatar: string | null;
  actorUsername: string | null;
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

type LinkInfo = { href: string; label: string } | null;

const ENTITY_LINK: Record<string, [string, string]> = {
  LIVE: ['/live/', 'Join Live'],
  LIKE: ['/posts/', 'View Post'],
  COMMENT: ['/posts/', 'View Post'],
  POST: ['/posts/', 'View Post'],
  MARKETPLACE: ['/marketplace/', 'View Item'],
};
const ACTOR_LABEL: Record<string, string> = {
  FOLLOW: 'View Profile',
  SUBSCRIBE: 'View Profile',
  STORY: 'View Story',
};
const FIXED_LINK: Record<string, [string, string]> = {
  MESSAGE: ['/messages', 'Open Messages'],
  TIP: ['/creator/wallet', 'View Wallet'],
  BADGE: ['/badges', 'View Badges'],
};

function getActionLink(
  type: string,
  entityId: string | null,
  actorUsername: string | null,
): LinkInfo {
  if (entityId && ENTITY_LINK[type])
    return { href: `${ENTITY_LINK[type][0]}${entityId}`, label: ENTITY_LINK[type][1] };
  if (actorUsername && ACTOR_LABEL[type])
    return { href: `/u/${actorUsername}`, label: ACTOR_LABEL[type] };
  if (FIXED_LINK[type]) return { href: FIXED_LINK[type][0], label: FIXED_LINK[type][1] };
  return null;
}

export function NotificationRow({
  notification: n,
  isSelected,
  onToggleSelect,
  onDelete,
  onArchive,
  onMarkRead,
}: {
  notification: Notification;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onMarkRead: (n: Notification) => void;
}) {
  const isUnread = !n.read;
  const rowBg = isUnread ? 'bg-muted' : 'border border-muted';
  const actionLink = getActionLink(n.type, n.entityId, n.actorUsername);
  const avatarSrc = n.actorAvatar || '/icons/dashboard/person.svg';

  return (
    <div
      className={`flex items-center justify-between ${rowBg} rounded-[8px] px-[10px] py-[8px] gap-[10px]`}
    >
      <div className="flex items-center gap-[12px] min-w-0 flex-1">
        <button onClick={() => onToggleSelect(n.id)} className="shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
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

        {n.actorUsername ? (
          <Link
            to={`/u/${n.actorUsername}`}
            className="shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={avatarSrc} alt="" className="size-[40px] rounded-full object-cover" />
          </Link>
        ) : (
          <img src={avatarSrc} alt="" className="size-[40px] shrink-0 rounded-full object-cover" />
        )}

        <NotificationTypeIcon type={n.type} />

        <div className="min-w-0">
          <p
            className={`text-[13px] leading-snug text-foreground md:text-[15px] ${isUnread ? 'font-medium' : ''}`}
          >
            {n.message}
          </p>
          <div className="flex items-center gap-[10px] mt-[3px]">
            <span className="text-[11px] text-muted-foreground">{timeAgo(n.createdAt)}</span>
            {actionLink && (
              <Link
                to={actionLink.href}
                className="text-[11px] font-medium text-[#01adf1] hover:underline shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                {actionLink.label} →
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-[10px]">
        {isUnread && (
          <button
            onClick={() => onMarkRead(n)}
            title="Mark as read"
            className="opacity-60 transition-opacity hover:opacity-100"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        <button
          onClick={() => onArchive(n.id)}
          title="Archive"
          className="opacity-60 transition-opacity hover:opacity-100"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(n.id)}
          title="Delete"
          className="opacity-60 transition-opacity hover:opacity-100"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
