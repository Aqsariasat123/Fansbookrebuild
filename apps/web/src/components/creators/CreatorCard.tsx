import { Link } from 'react-router-dom';
import type { CreatorCard as CreatorCardType } from '@fansbook/shared';
import { Badge, type BadgeType } from './Badge';

const CATEGORY_ICONS: Record<string, string> = {
  Artist: 'palette',
  Model: 'photo_camera',
  'Adult Creator': '18_up_rating',
  'Personal Trainer': 'sports_gymnastics',
  Comedian: 'comedy_mask',
  Musician: 'comedy_mask',
  Chef: 'palette',
};

function getCreatorBadges(creator: CreatorCardType): BadgeType[] {
  const badges: BadgeType[] = [];
  if (creator.isLive) badges.push('live');
  if (creator.isVerified) badges.push('verified');
  if (creator.followersCount >= 100) badges.push('top');
  if (creator.isNew) badges.push('new');
  return badges;
}

function getCategoryIcon(category: string | null | undefined): string {
  if (!category) return 'palette';
  return CATEGORY_ICONS[category] || 'palette';
}

function formatPrice(price: number | null): string {
  if (price === null) return 'Free';
  return `$${price.toFixed(2)}`;
}

export function CreatorCard({ creator }: { creator: CreatorCardType }) {
  const badges = getCreatorBadges(creator);
  const categoryIcon = getCategoryIcon(creator.category);

  return (
    <Link
      to={`/u/${creator.username}`}
      className="flex flex-col w-full overflow-hidden rounded-[12px] bg-card transition-transform hover:scale-[1.02] sm:rounded-[22px]"
    >
      {/* Image */}
      <div className="h-[210px] w-full overflow-hidden bg-muted sm:h-[243px]">
        {creator.avatar ? (
          <img
            src={creator.avatar}
            alt={creator.displayName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[48px] font-bold text-muted-foreground">
            {creator.displayName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Info section */}
      <div className="flex flex-1 flex-col px-[12px] pt-[10px] pb-[12px] sm:px-[22px] sm:pt-[15px] sm:pb-[18px]">
        <p className="font-outfit text-[12px] font-normal leading-normal text-foreground sm:text-[16px]">
          {creator.displayName}
        </p>
        <p className="mt-[2px] font-outfit text-[10px] font-normal leading-normal text-muted-foreground sm:text-[12px]">
          {creator.statusText || 'Available'}
        </p>

        {creator.category && (
          <div className="mt-[8px] flex items-center gap-[6px] sm:mt-[15px] sm:gap-[10px]">
            <img
              src={`/icons/creators/${categoryIcon}.svg`}
              alt=""
              className="h-[16px] w-[16px] sm:h-[20px] sm:w-[20px]"
            />
            <span className="font-outfit text-[12px] font-normal leading-normal text-foreground sm:text-[16px]">
              {creator.category}
            </span>
          </div>
        )}

        <div className="mt-[8px] flex items-center gap-[6px] sm:mt-[15px] sm:gap-[10px]">
          <img
            src="/icons/creators/attach_money.svg"
            alt=""
            className="h-[16px] w-[16px] sm:h-[20px] sm:w-[20px]"
          />
          <span className="font-outfit leading-normal">
            <span className="text-[12px] text-foreground sm:text-[16px]">
              {formatPrice(creator.price)}
            </span>
            <span className="text-[10px] text-muted-foreground sm:text-[12px]"> / month</span>
          </span>
        </div>

        {/* Badges at bottom */}
        {badges.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-[6px] pt-[12px] sm:pt-[18px]">
            {badges.map((b, i) => (
              <Badge key={i} type={b} />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
