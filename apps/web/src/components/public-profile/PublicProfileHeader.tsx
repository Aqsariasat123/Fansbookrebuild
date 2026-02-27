const IMG = '/icons/dashboard';

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
}

interface PublicProfileHeaderProps {
  profile: ProfileData;
  isOwnProfile: boolean;
  followLoading: boolean;
  onFollow: () => void;
  onSubscribe: () => void;
}

function formatCount(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}

function StatBadge({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center gap-[2px]">
      <p className="text-[18px] font-semibold text-[#f8f8f8] md:text-[24px]">
        {formatCount(value)}
      </p>
      <p className="text-[11px] text-[#5d5d5d] md:text-[14px]">{label}</p>
    </div>
  );
}

export function PublicProfileHeader({
  profile,
  isOwnProfile,
  followLoading,
  onFollow,
  onSubscribe,
}: PublicProfileHeaderProps) {
  const initial = profile.displayName.charAt(0).toUpperCase();

  return (
    <div className="overflow-hidden rounded-[11px] bg-[#0e1012] md:rounded-[22px]">
      {/* Cover photo */}
      <div className="relative h-[120px] w-full md:h-[200px]">
        {profile.cover ? (
          <img src={profile.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500" />
        )}
      </div>

      {/* Profile info */}
      <div className="relative flex flex-col items-center px-[16px] pb-[20px] md:px-[30px] md:pb-[30px]">
        <div className="-mt-[40px] md:-mt-[50px]">
          <div className="size-[80px] overflow-hidden rounded-full border-4 border-[#0e1012] bg-[#0e1012] md:size-[100px]">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#2e4882]">
                <span className="text-[28px] font-medium text-[#f8f8f8] md:text-[36px]">
                  {initial}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-[10px] flex items-center gap-[6px]">
          <p className="text-[20px] font-semibold text-[#f8f8f8] md:text-[28px]">
            {profile.displayName}
          </p>
          {profile.isVerified && (
            <img
              src={`${IMG}/verified.svg`}
              alt="Verified"
              className="size-[18px] md:size-[22px]"
            />
          )}
        </div>
        <p className="text-[14px] text-[#5d5d5d] md:text-[16px]">@{profile.username}</p>

        <div className="mt-[16px] flex items-center gap-[30px] md:mt-[20px] md:gap-[50px]">
          <StatBadge label="Followers" value={profile.followersCount} />
          <div className="h-[30px] w-px bg-[#2a2d30]" />
          <StatBadge label="Posts" value={profile.postsCount} />
          <div className="h-[30px] w-px bg-[#2a2d30]" />
          <StatBadge label="Following" value={profile.followingCount} />
        </div>

        {profile.bio && (
          <p className="mt-[14px] max-w-[600px] text-center text-[13px] text-[#a0a0a0] md:mt-[18px] md:text-[15px]">
            {profile.bio}
          </p>
        )}

        {!isOwnProfile && (
          <div className="mt-[18px] flex flex-wrap items-center justify-center gap-[10px] md:mt-[24px] md:gap-[16px]">
            <button
              onClick={onFollow}
              disabled={followLoading}
              className={`rounded-[10px] border px-[20px] py-[8px] text-[13px] font-medium transition-colors disabled:opacity-50 md:px-[28px] md:py-[10px] md:text-[15px] ${
                profile.isFollowing
                  ? 'border-[#5d5d5d] text-[#f8f8f8] hover:border-[#f8f8f8]'
                  : 'border-purple-500 text-purple-400 hover:bg-purple-500/10'
              }`}
            >
              {profile.isFollowing ? 'Following' : 'Follow'}
            </button>

            {profile.isSubscribed ? (
              <button className="rounded-[10px] bg-green-600 px-[20px] py-[8px] text-[13px] font-medium text-[#f8f8f8] md:px-[28px] md:py-[10px] md:text-[15px]">
                Subscribed
              </button>
            ) : (
              <button
                onClick={onSubscribe}
                className="rounded-[10px] bg-gradient-to-r from-purple-600 to-pink-500 px-[20px] py-[8px] text-[13px] font-medium text-[#f8f8f8] transition-opacity hover:opacity-90 md:px-[28px] md:py-[10px] md:text-[15px]"
              >
                Subscribe
              </button>
            )}

            <button className="rounded-[10px] border border-[#5d5d5d] px-[20px] py-[8px] text-[13px] text-[#f8f8f8] transition-colors hover:border-[#f8f8f8] md:px-[28px] md:py-[10px] md:text-[15px]">
              Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
