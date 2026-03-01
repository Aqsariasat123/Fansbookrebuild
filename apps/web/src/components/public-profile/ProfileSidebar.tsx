import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const hashtags = profile.hashtags || DEFAULT_HASHTAGS;

  return (
    <div>
      {/* Avatar - overlapping cover */}
      <div className="relative z-10 -mt-[60px] flex justify-center md:-mt-[88px] md:justify-start">
        <div className="size-[130px] rounded-full border-4 border-muted bg-muted md:size-[176px]">
          {profile.avatar ? (
            <img src={profile.avatar} alt="" className="size-full rounded-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center rounded-full bg-muted">
              <span className="text-[40px] font-medium text-foreground md:text-[52px]">
                {profile.displayName.charAt(0)}
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

      {/* Follow + Subscribe + Message + Tip */}
      {!isOwnProfile && (
        <div className="mt-[20px] flex flex-wrap items-center gap-[10px]">
          <button
            onClick={onFollow}
            disabled={followLoading}
            className={`rounded-[11px] border px-[36px] py-[12px] text-[16px] font-medium shadow-[0px_6px_10px_rgba(34,34,34,0.25)] transition-colors disabled:opacity-50 md:px-[48px] ${
              profile.isFollowing
                ? 'border-[#01adf1] bg-[#01adf1]/10 text-primary'
                : 'border-border text-foreground hover:border-foreground'
            }`}
          >
            {profile.isFollowing ? 'Following' : 'Follow'}
          </button>
          <button
            onClick={onSubscribe}
            className="rounded-[11px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[36px] py-[12px] text-[16px] font-medium text-white shadow-[0px_6px_10px_rgba(34,34,34,0.25)] transition-opacity hover:opacity-90"
          >
            Subscribe
          </button>
          <button
            onClick={() => navigate(`/messages?user=${profile.username}`)}
            className="flex items-center gap-[6px] rounded-[11px] border border-border px-[20px] py-[12px] text-[16px] font-medium text-foreground transition-colors hover:border-foreground"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
            </svg>
            Message
          </button>
          <button
            onClick={() => {
              /* tip modal - placeholder */
            }}
            className="flex items-center gap-[6px] rounded-[11px] border border-border px-[20px] py-[12px] text-[16px] font-medium text-foreground transition-colors hover:border-foreground"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            Tip
          </button>
        </div>
      )}

      {/* View Subscription Plans */}
      {!isOwnProfile && (
        <button
          onClick={onSubscribe}
          className="mt-[16px] flex w-full items-center justify-between rounded-[11px] border border-border px-[20px] py-[14px] text-[16px] text-foreground transition-colors hover:border-foreground"
        >
          View Subscription Plans
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
          </svg>
        </button>
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
