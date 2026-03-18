import { useNavigate } from 'react-router-dom';
import type { UpcomingLive } from '@fansbook/shared';

export function UpcomingCard({ s }: { s: UpcomingLive }) {
  const navigate = useNavigate();
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-[22px] bg-card">
      {/* Thumbnail / banner */}
      <div className="relative h-[140px] w-full bg-gradient-to-br from-[#01adf1]/20 to-[#a61651]/20">
        {s.thumbnail ? (
          <img src={s.thumbnail} alt={s.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-muted-foreground/40"
            >
              <path d="M15 10l4.55-2.5A1 1 0 0121 8.5v7a1 1 0 01-1.45.9L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
          </div>
        )}
        <div className="absolute left-[10px] top-[10px] flex items-center gap-[4px] rounded-[4px] bg-black/60 px-[8px] py-[4px]">
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#01adf1"
            strokeWidth="2.5"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <span className="font-outfit text-[10px] font-semibold text-white">
            {new Date(s.scheduledAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })}{' '}
            {new Date(s.scheduledAt).toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        {s.category && (
          <div className="absolute right-[10px] top-[10px] rounded-[4px] bg-[#01adf1]/90 px-[8px] py-[3px]">
            <span className="font-outfit text-[10px] font-semibold text-white">{s.category}</span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-[8px] px-[14px] py-[12px]">
        <div className="flex items-center gap-[8px]">
          <div className="h-[32px] w-[32px] shrink-0 overflow-hidden rounded-full bg-muted">
            {s.avatar ? (
              <img src={s.avatar} alt={s.username} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[12px] font-bold text-muted-foreground">
                {s.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-outfit text-[13px] font-semibold text-foreground">
              {s.displayName}
            </p>
            <p className="truncate font-outfit text-[11px] text-muted-foreground">@{s.username}</p>
          </div>
        </div>
        <p className="line-clamp-2 font-outfit text-[13px] font-medium text-foreground">
          {s.title}
        </p>
        {s.description && (
          <p className="line-clamp-2 font-outfit text-[11px] text-muted-foreground">
            {s.description}
          </p>
        )}
        <div className="mt-auto flex gap-[8px] pt-[4px]">
          <button
            onClick={() => navigate(`/u/${s.username}`)}
            className="flex-1 rounded-[8px] border border-border py-[6px] font-outfit text-[11px] text-foreground hover:bg-muted"
          >
            View Profile
          </button>
          <button
            onClick={() => navigate('/live')}
            className="flex-1 rounded-[8px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[6px] font-outfit text-[11px] font-medium text-white hover:opacity-90"
          >
            Notify me
          </button>
        </div>
      </div>
    </div>
  );
}
