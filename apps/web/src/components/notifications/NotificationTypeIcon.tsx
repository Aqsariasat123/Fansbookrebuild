import type { ReactElement } from 'react';

const cls = 'hidden shrink-0 md:block';

const ICONS: Record<string, ReactElement> = {
  LIKE: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#ef4444" className={cls}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ),
  COMMENT: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={cls}>
      <path
        d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  FOLLOW: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={cls}>
      <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  ),
  SUBSCRIBE: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#f59e0b" className={cls}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  TIP: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#22c55e" className={cls}>
      <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
    </svg>
  ),
  MESSAGE: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={cls}>
      <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
    </svg>
  ),
  LIVE: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#ef4444" className={cls}>
      <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
    </svg>
  ),
  BADGE: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#f59e0b" className={cls}>
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  ),
  MARKETPLACE: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={cls}>
      <path d="M19 6H17.82C17.4 4.84 16.3 4 15 4H9C7.7 4 6.6 4.84 6.18 6H5C3.9 6 3 6.9 3 8V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V8C21 6.9 20.1 6 19 6ZM9 6H15V8H9V6ZM19 20H5V8H7V10H17V8H19V20Z" />
    </svg>
  ),
  POST: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={cls}>
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
    </svg>
  ),
};

const DEFAULT_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={cls}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
  </svg>
);

export function NotificationTypeIcon({ type }: { type: string }) {
  return ICONS[type] ?? DEFAULT_ICON;
}
