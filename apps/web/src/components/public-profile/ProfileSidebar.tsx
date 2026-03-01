import { ProfileActions } from './ProfileActions';

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

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(2)}K`;
  return String(n);
}

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
  likesCount?: number;
  hashtags?: string[];
}

interface Props {
  profile: SidebarProfileData;
  isOwnProfile: boolean;
  followLoading: boolean;
  onFollow: () => void;
  onSubscribe: () => void;
}

export function ProfileSidebar({
  profile,
  isOwnProfile,
  followLoading,
  onFollow,
  onSubscribe,
}: Props) {
  const hashtags = profile.hashtags || DEFAULT_HASHTAGS;
  const initial = profile.displayName.charAt(0);

  return (
    <div>
      {/* Avatar */}
      <div className="relative z-10 -mt-[60px] flex justify-center md:-mt-[88px] md:justify-start">
        <div className="size-[130px] rounded-full border-4 border-muted bg-muted md:size-[176px]">
          {profile.avatar ? (
            <img src={profile.avatar} alt="" className="size-full rounded-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center rounded-full bg-muted">
              <span className="text-[40px] font-medium text-foreground md:text-[52px]">
                {initial}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Name */}
      <div className="mt-[16px] text-center md:text-left">
        <div className="flex items-center justify-center gap-[6px] md:justify-start">
          <p className="text-[20px] font-medium text-foreground">{profile.displayName}</p>
          {profile.isVerified && (
            <img src="/icons/dashboard/verified.svg" alt="Verified" className="size-[18px]" />
          )}
        </div>
        <p className="text-[16px] text-muted-foreground">@{profile.username}</p>
      </div>

      {/* Stats */}
      <div className="mt-[24px] flex items-center justify-center gap-[40px] md:justify-start">
        <div className="text-center md:text-left">
          <p className="text-[16px] font-medium text-foreground">
            {formatCount(profile.followingCount)}
          </p>
          <p className="text-[12px] text-muted-foreground">Following</p>
        </div>
        <div className="text-center md:text-left">
          <p className="text-[16px] font-medium text-foreground">
            {formatCount(profile.followersCount)}
          </p>
          <p className="text-[12px] text-muted-foreground">Followers</p>
        </div>
        <div className="text-center md:text-left">
          <p className="text-[16px] font-medium text-foreground">
            {formatCount(profile.likesCount ?? 0)}
          </p>
          <p className="text-[12px] text-muted-foreground">Likes</p>
        </div>
      </div>

      {/* Actions */}
      {!isOwnProfile && (
        <ProfileActions
          profileId={profile.id}
          username={profile.username}
          displayName={profile.displayName}
          isFollowing={profile.isFollowing}
          followLoading={followLoading}
          onFollow={onFollow}
          onSubscribe={onSubscribe}
        />
      )}

      {/* About */}
      {profile.bio && (
        <div className="mt-[24px]">
          <p className="text-[16px] font-medium text-foreground">About</p>
          <p className="mt-[8px] text-[14px] leading-[1.6] text-muted-foreground">{profile.bio}</p>
        </div>
      )}

      {/* Hashtags */}
      <div className="mt-[24px]">
        <p className="text-[16px] font-medium text-foreground">Hashtags</p>
        <div className="mt-[10px] flex flex-wrap gap-[8px]">
          {hashtags.map((tag) => (
            <span
              key={tag}
              className="rounded-[8px] border border-border px-[18px] py-[8px] text-[14px] text-muted-foreground"
            >
              {tag.startsWith('#') ? tag : `#${tag}`}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
