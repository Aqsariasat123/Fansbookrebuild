import { ProfileActionButtons } from './ProfileActionButtons';
import { ProfileStats } from './ProfileStats';

const DEFAULT_HASHTAGS = [
  '#Streaming',
  '#Enjoy',
  '#Watching',
  '#Gaming',
  '#Story',
  '#Modeling',
  '#Live',
  '#Posting',
];

export interface SidebarProfileData {
  id: string;
  displayName: string;
  username: string;
  avatar: string | null;
  bio: string | null;
  isVerified: boolean;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  isSubscribed: boolean;
  likesCount?: number;
  imagesCount?: number;
  videosCount?: number;
  hashtags?: string[];
}

interface Props {
  profile: SidebarProfileData;
  amazonLink?: string | null;
  isOwnProfile?: boolean;
  followLoading?: boolean;
  onFollow?: () => void;
  onSubscribe?: () => void;
}

function getHashtags(tags?: string[]): string[] {
  return tags && tags.length > 0 ? tags : DEFAULT_HASHTAGS;
}

export function ProfileSidebar({
  profile,
  amazonLink,
  isOwnProfile,
  followLoading = false,
  onFollow,
  onSubscribe,
}: Props) {
  const hashtags = getHashtags(profile.hashtags);
  const showActions = !isOwnProfile && onFollow != null && onSubscribe != null;

  return (
    <div className="relative rounded-[22px] bg-card px-[20px] pb-[24px] pt-[56px] md:pl-[144px] md:pt-[24px]">
      <div className="absolute -top-[40px] left-[20px] size-[80px] overflow-hidden rounded-full border-4 border-card bg-muted md:-top-[52px] md:size-[106px]">
        {profile.avatar ? (
          <img src={profile.avatar} alt="" className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center text-[28px] font-medium text-foreground md:text-[38px]">
            {profile.displayName[0]}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-[16px] md:flex-row md:gap-[32px]">
        <div className="flex-1">
          <div className="flex items-center gap-[6px]">
            <span className="text-[18px] font-bold text-foreground md:text-[20px]">
              {profile.displayName}
            </span>
            {profile.isVerified && (
              <img src="/icons/dashboard/verified.svg" alt="" className="size-[16px]" />
            )}
          </div>
          <p className="text-[13px] text-muted-foreground">@{profile.username}</p>

          {showActions && (
            <ProfileActionButtons
              profile={profile}
              followLoading={followLoading}
              onFollow={onFollow!}
              onSubscribe={onSubscribe!}
            />
          )}

          <ProfileStats
            followingCount={profile.followingCount}
            followersCount={profile.followersCount}
            likesCount={profile.likesCount}
            imagesCount={profile.imagesCount}
            videosCount={profile.videosCount}
          />

          <div className="mt-[12px] flex flex-wrap gap-[6px]">
            {hashtags.slice(0, 6).map((tag) => (
              <span
                key={tag}
                className="rounded-[6px] border border-border px-[10px] py-[4px] text-[11px] text-muted-foreground"
              >
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        </div>

        {profile.bio && (
          <div className="md:w-[44%]">
            <p className="text-[13px] leading-[1.7] text-muted-foreground">{profile.bio}</p>
          </div>
        )}
      </div>

      {amazonLink && (
        <a
          href={amazonLink}
          target="_blank"
          rel="noopener noreferrer"
          title="Amazon Store"
          className="absolute bottom-[16px] right-[16px] flex size-[36px] items-center justify-center rounded-full bg-[#FF9900] text-[18px] font-black text-white"
        >
          a
        </a>
      )}
    </div>
  );
}
