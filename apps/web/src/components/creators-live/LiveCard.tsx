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
    <div className="flex h-[235px] w-full items-center rounded-[22px] bg-card px-[16px] py-[16px] sm:h-[278px] sm:w-[227px] sm:px-[23px] sm:py-[20px]">
      <div className="flex w-full flex-col items-start gap-[14px] sm:w-[180px] sm:gap-[22px]">
        {/* Live badge */}
        <span className="flex items-center gap-[4px] rounded-[3px] bg-[#e02a2a] px-[6px] py-[3px] sm:gap-[5px] sm:rounded-[4px] sm:px-[8px] sm:py-[4px]">
          <img
            src="/icons/creators/live_dot.svg"
            alt=""
            className="h-[3px] w-[3px] sm:h-[4px] sm:w-[4px]"
          />
          <span className="font-outfit text-[10px] font-normal text-foreground sm:text-[12px]">
            Live
          </span>
        </span>

        {/* Creator info */}
        <div className="flex items-center gap-[8px] sm:gap-[10px]">
          <div className="h-[34px] w-[34px] shrink-0 overflow-hidden rounded-full bg-muted sm:h-[40px] sm:w-[40px]">
            {session.avatar ? (
              <img
                src={session.avatar}
                alt={session.displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[14px] font-bold text-muted-foreground sm:text-[16px]">
                {session.displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="font-outfit leading-none text-foreground">
            <p className="text-[13px] sm:text-[16px]">{session.displayName}</p>
            <p className="mt-[2px] text-[10px] text-muted-foreground sm:text-[12px]">
              @{session.username}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="flex w-full flex-col items-start gap-[8px] sm:gap-[10px]">
          <div className="flex items-center gap-[8px] sm:gap-[10px]">
            <img
              src={`/icons/creators/${categoryIcon}.svg`}
              alt=""
              className="h-[15px] w-[15px] sm:h-[18px] sm:w-[18px]"
            />
            <span className="font-outfit text-[10px] font-normal text-foreground sm:text-[12px]">
              {session.category || 'Creator'}
            </span>
          </div>
          <div className="flex items-center gap-[8px] sm:gap-[10px]">
            <img
              src="/icons/creators/visibility.svg"
              alt=""
              className="h-[15px] w-[15px] sm:h-[18px] sm:w-[18px]"
            />
            <span className="font-outfit text-[10px] font-normal text-foreground sm:text-[12px]">
              {formatViewers(session.viewerCount)} Viewers
            </span>
          </div>
          <div className="flex w-full items-center gap-[8px] sm:gap-[10px]">
            <img
              src="/icons/creators/videocam.svg"
              alt=""
              className="h-[15px] w-[15px] shrink-0 sm:h-[18px] sm:w-[18px]"
            />
            <span className="line-clamp-1 font-outfit text-[10px] font-normal text-foreground sm:text-[12px]">
              {session.title}
            </span>
          </div>
        </div>

        {/* Join button */}
        <button
          onClick={() => navigate(user ? `/live/${session.id}` : '/login')}
          className="rounded-[3px] bg-gradient-to-r from-[#01adf1] to-[#a61651] p-[8px] font-outfit text-[10px] font-normal text-foreground sm:rounded-[4px] sm:p-[10px] sm:text-[12px]"
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
