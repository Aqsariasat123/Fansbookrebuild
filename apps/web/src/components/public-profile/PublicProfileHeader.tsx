interface ProfileData {
  displayName: string;
  username: string;
  avatar: string | null;
  cover: string | null;
  bio: string | null;
  isVerified: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing: boolean;
  isSubscribed: boolean;
  likesCount?: number;
  socialLinks?: Record<string, string>;
  hashtags?: string[];
}

interface Props {
  profile: ProfileData;
  isOwnProfile: boolean;
  followLoading: boolean;
  onFollow: () => void;
  onSubscribe: () => void;
}

const DEFAULT_HASHTAGS = [
  '#Streaming',
  '#Enjoy',
  '#Watching',
  '#Gaming',
  '#Story',
  '#Modeling',
  '#Live',
  '#Posting',
  '#Adult',
];

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(2)}K`;
  return String(n);
}

function CoverBanner({ cover }: { cover: string | null }) {
  return (
    <div className="relative h-[180px] w-full overflow-hidden md:h-[240px]">
      {cover ? (
        <img src={cover} alt="" className="absolute inset-0 size-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-[#1a1d20]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#15191c]/80 to-transparent" />
    </div>
  );
}

function ProfileAvatar({ avatar, displayName }: { avatar: string | null; displayName: string }) {
  return (
    <div className="-mt-[60px] flex justify-center md:-mt-[88px] md:justify-start">
      <div className="size-[130px] rounded-full border-4 border-[#15191c] bg-[#15191c] md:size-[176px]">
        {avatar ? (
          <img src={avatar} alt="" className="size-full rounded-full object-cover object-top" />
        ) : (
          <div className="flex size-full items-center justify-center rounded-full bg-[#1a1d20]">
            <span className="text-[40px] font-medium text-[#f8f8f8] md:text-[52px]">
              {displayName.charAt(0)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function PublicProfileHeader({
  profile,
  isOwnProfile,
  followLoading,
  onFollow,
  onSubscribe,
}: Props) {
  const hashtags = profile.hashtags || DEFAULT_HASHTAGS;

  return (
    <div>
      {/* Cover banner - full width */}
      <CoverBanner cover={profile.cover} />

      {/* 2-column layout: left profile sidebar + right content area */}
      <div className="flex flex-col gap-[20px] md:flex-row">
        {/* LEFT sidebar - profile info */}
        <div className="w-full shrink-0 md:w-[300px] lg:w-[380px]">
          {/* Avatar - overlapping cover */}
          <ProfileAvatar avatar={profile.avatar} displayName={profile.displayName} />

          {/* Name + username */}
          <div className="mt-[16px] text-center md:text-left">
            <div className="flex items-center justify-center gap-[6px] md:justify-start">
              <p className="text-[20px] font-medium text-[#f8f8f8]">{profile.displayName}</p>
              {profile.isVerified && (
                <img src="/icons/dashboard/verified.svg" alt="Verified" className="size-[18px]" />
              )}
            </div>
            <p className="text-[16px] text-[#5d5d5d]">@{profile.username}</p>
          </div>

          {/* Stats */}
          <div className="mt-[24px] flex items-center justify-center gap-[40px] md:justify-start">
            <div className="text-center md:text-left">
              <p className="text-[16px] font-medium text-[#f8f8f8]">
                {formatCount(profile.followingCount)}
              </p>
              <p className="text-[12px] text-[#5d5d5d]">Following</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-[16px] font-medium text-[#f8f8f8]">
                {formatCount(profile.followersCount)}
              </p>
              <p className="text-[12px] text-[#5d5d5d]">Followers</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-[16px] font-medium text-[#f8f8f8]">
                {formatCount(profile.likesCount ?? 0)}
              </p>
              <p className="text-[12px] text-[#5d5d5d]">Likes</p>
            </div>
          </div>

          {/* Follow + Subscribe buttons */}
          {!isOwnProfile && (
            <div className="mt-[20px] flex items-center gap-[10px]">
              <button
                onClick={onFollow}
                disabled={followLoading}
                className={`rounded-[11px] border px-[36px] py-[12px] text-[16px] font-medium shadow-[0px_6px_10px_rgba(34,34,34,0.25)] transition-colors disabled:opacity-50 md:px-[48px] ${
                  profile.isFollowing
                    ? 'border-[#01adf1] bg-[#01adf1]/10 text-[#01adf1]'
                    : 'border-[#5d5d5d] text-[#f8f8f8] hover:border-white'
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
            </div>
          )}

          {/* View Subscription Plans */}
          {!isOwnProfile && (
            <button
              onClick={onSubscribe}
              className="mt-[16px] flex w-full items-center justify-between rounded-[11px] border border-[#5d5d5d] px-[20px] py-[14px] text-[16px] text-[#f8f8f8] transition-colors hover:border-white"
            >
              View Subscription Plans
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#f8f8f8">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
              </svg>
            </button>
          )}

          {/* About section */}
          {profile.bio && (
            <div className="mt-[24px]">
              <p className="text-[16px] font-medium text-[#f8f8f8]">About</p>
              <p className="mt-[8px] text-[14px] leading-[1.6] text-[#5d5d5d]">{profile.bio}</p>
            </div>
          )}

          {/* Hashtags */}
          <div className="mt-[24px]">
            <p className="text-[16px] font-medium text-[#f8f8f8]">Hashtags</p>
            <div className="mt-[10px] flex flex-wrap gap-[8px]">
              {hashtags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-[8px] border border-[#5d5d5d] px-[18px] py-[8px] text-[14px] text-[#5d5d5d]"
                >
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
