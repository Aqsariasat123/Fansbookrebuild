import { useNavigate } from 'react-router-dom';
import type { LiveCreatorCard } from '@fansbook/shared';
import { useAuthStore } from '../../stores/authStore';

const CATEGORY_ICONS: Record<string, string> = {
  Artist: 'palette',
  Model: 'photo_camera',
  'Adult Creator': '18_up_rating',
  'Personal Trainer': 'sports_gymnastics',
  Comedian: 'comedy_mask',
  Musician: 'comedy_mask',
  Chef: 'palette',
};

function formatViewers(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(count % 1000 === 0 ? 0 : 2)}k`;
  }
  return String(count);
}

export function LiveCard({ session }: { session: LiveCreatorCard }) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const categoryIcon = session.category ? CATEGORY_ICONS[session.category] || 'palette' : 'palette';

  return (
    <div className="flex w-full items-center rounded-[22px] bg-card px-[16px] py-[20px] sm:h-[278px] sm:w-[227px] sm:px-[23px] sm:py-[20px]">
      <div className="flex w-full flex-col items-start gap-[16px] sm:w-[180px] sm:gap-[22px]">
        {/* Live badge */}
        <span className="flex items-center gap-[5px] rounded-[4px] bg-[#e02a2a] px-[8px] py-[4px]">
          <img src="/icons/creators/live_dot.svg" alt="" className="h-[5px] w-[5px]" />
          <span className="font-outfit text-[13px] font-medium text-foreground">Live</span>
        </span>

        {/* Creator info */}
        <div className="flex items-center gap-[10px]">
          <div className="h-[44px] w-[44px] shrink-0 overflow-hidden rounded-full bg-muted">
            {session.avatar ? (
              <img
                src={session.avatar}
                alt={session.displayName}
                className="h-full w-full object-cover object-top"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[18px] font-bold text-muted-foreground">
                {session.displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="font-outfit leading-none text-foreground">
            <p className="text-[16px] font-semibold">{session.displayName}</p>
            <p className="mt-[3px] text-[13px] text-muted-foreground">@{session.username}</p>
          </div>
        </div>

        {/* Details */}
        <div className="flex w-full flex-col items-start gap-[10px]">
          <div className="flex items-center gap-[10px]">
            <img
              src={`/icons/creators/${categoryIcon}.svg`}
              alt=""
              className="h-[18px] w-[18px] shrink-0"
            />
            <span className="font-outfit text-[14px] text-foreground">
              {session.category || 'Creator'}
            </span>
          </div>
          <div className="flex items-center gap-[10px]">
            <img
              src="/icons/creators/visibility.svg"
              alt=""
              className="h-[18px] w-[18px] shrink-0"
            />
            <span className="font-outfit text-[14px] text-foreground">
              {formatViewers(session.viewerCount)} Viewers
            </span>
          </div>
          <div className="flex w-full items-center gap-[10px]">
            <img src="/icons/creators/videocam.svg" alt="" className="h-[18px] w-[18px] shrink-0" />
            <span className="line-clamp-1 font-outfit text-[14px] text-foreground">
              {session.title}
            </span>
          </div>
        </div>

        {/* Join button */}
        <button
          onClick={() =>
            navigate(user ? `/live/${session.id}` : '/login', {
              state: {
                creatorName: session.displayName,
                creatorAvatar: session.avatar,
              },
            })
          }
          className="rounded-[6px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[16px] py-[10px] font-outfit text-[14px] font-medium text-foreground"
        >
          Join Live Session
        </button>
      </div>
    </div>
  );
}

export function LiveCardSkeleton() {
  return (
    <div className="flex h-[235px] w-full animate-pulse items-center rounded-[22px] bg-card px-[16px] py-[16px] sm:h-[278px] sm:w-[227px] sm:px-[23px] sm:py-[20px]">
      <div className="flex w-[180px] flex-col items-start gap-[22px]">
        <div className="h-[22px] w-[50px] rounded bg-muted" />
        <div className="flex items-center gap-[10px]">
          <div className="h-[40px] w-[40px] rounded-full bg-muted" />
          <div>
            <div className="h-[14px] w-[80px] rounded bg-muted" />
            <div className="mt-[4px] h-[10px] w-[60px] rounded bg-muted" />
          </div>
        </div>
        <div className="flex w-full flex-col gap-[10px]">
          <div className="h-[14px] w-[100px] rounded bg-muted" />
          <div className="h-[14px] w-[90px] rounded bg-muted" />
          <div className="h-[14px] w-full rounded bg-muted" />
        </div>
        <div className="h-[32px] w-[120px] rounded bg-muted" />
      </div>
    </div>
  );
}
