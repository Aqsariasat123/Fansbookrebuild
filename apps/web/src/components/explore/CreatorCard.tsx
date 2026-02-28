import { Link } from 'react-router-dom';
import type { CreatorCard as CreatorCardType } from '@fansbook/shared';

function formatFollowers(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
}

function formatPrice(price: number | null): string {
  if (price === null || price === 0) return 'Free';
  return `$${price.toFixed(2)}/mo`;
}

export function CreatorCard({ creator }: { creator: CreatorCardType }) {
  return (
    <Link
      to={`/u/${creator.username}`}
      className="group block rounded-[16px] bg-card overflow-hidden transition-transform hover:scale-[1.02]"
    >
      {/* Avatar section */}
      <div className="relative flex flex-col items-center pt-[24px] pb-[16px] px-[12px]">
        {/* Live indicator */}
        {creator.isLive && (
          <span className="absolute top-[10px] left-[10px] flex items-center gap-[4px] rounded-[4px] bg-[#e02a2a] px-[8px] py-[3px]">
            <span className="h-[6px] w-[6px] rounded-full bg-white animate-pulse" />
            <span className="font-outfit text-[11px] font-medium text-white">LIVE</span>
          </span>
        )}

        {/* New badge */}
        {creator.isNew && (
          <span className="absolute top-[10px] right-[10px] rounded-[4px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[8px] py-[3px] font-outfit text-[11px] font-medium text-white">
            NEW
          </span>
        )}

        {/* Avatar */}
        <div className="relative h-[80px] w-[80px] rounded-full overflow-hidden bg-gradient-to-br from-[#01adf1] to-[#a61651]">
          {creator.avatar ? (
            <img
              src={creator.avatar}
              alt={creator.displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[28px] font-bold text-white">
              {creator.displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Name + verified */}
        <div className="mt-[12px] flex items-center gap-[4px]">
          <span className="font-outfit text-[14px] font-medium text-foreground truncate max-w-[130px]">
            {creator.displayName}
          </span>
          {creator.isVerified && (
            <img src="/icons/creators/verified.svg" alt="Verified" className="h-[14px] w-[14px]" />
          )}
        </div>

        {/* Category */}
        {creator.category && (
          <span className="mt-[6px] rounded-[10px] bg-muted px-[10px] py-[2px] font-outfit text-[11px] text-muted-foreground">
            {creator.category}
          </span>
        )}

        {/* Followers */}
        <span className="mt-[8px] font-outfit text-[12px] text-muted-foreground">
          {formatFollowers(creator.followersCount)} followers
        </span>

        {/* Price */}
        <span
          className={`mt-[4px] font-outfit text-[13px] font-medium ${
            creator.price === null || creator.price === 0 ? 'text-primary' : 'text-foreground'
          }`}
        >
          {formatPrice(creator.price)}
        </span>
      </div>
    </Link>
  );
}
