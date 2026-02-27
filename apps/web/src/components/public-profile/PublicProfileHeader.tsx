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

const SOCIAL_ICONS: Record<string, { bg: string; path: string }> = {
  facebook: {
    bg: '#1877F2',
    path: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
  },
  instagram: {
    bg: '#E4405F',
    path: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2m-.2 2A3.6 3.6 0 004 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 003.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5M12 7a5 5 0 110 10 5 5 0 010-10m0 2a3 3 0 100 6 3 3 0 000-6z',
  },
  twitter: {
    bg: '#1DA1F2',
    path: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z',
  },
};

const DEFAULT_HASHTAGS = [
  '#streaming',
  '#Live',
  '#Modeling',
  '#Enjoy',
  '#Game',
  '#Adult',
  '#Posting',
  '#Watching',
  '#Story',
];

const COVER_ICONS = [
  'M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  'M14 3v2H2V3h12zm-3 16H2v-2h9v2zm5-8H2V9h14v2zM21 3h-2v4h-4v2h4v4h2V9h4V7h-4V3z',
];

function CoverSection({ profile }: { profile: ProfileData }) {
  return (
    <div className="relative h-[200px] overflow-hidden rounded-t-[22px]">
      {profile.cover ? (
        <img src={profile.cover} alt="" className="absolute inset-0 size-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500" />
      )}
      <div className="absolute bottom-[16px] right-[16px] flex gap-[10px]">
        {COVER_ICONS.map((d, i) => (
          <button
            key={i}
            className="flex size-[36px] items-center justify-center rounded-full bg-[#15191c]/80 backdrop-blur-sm hover:bg-[#15191c]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d={d} />
            </svg>
          </button>
        ))}
      </div>
      <div className="absolute -bottom-[40px] left-[24px]">
        <div className="size-[100px] overflow-hidden rounded-full border-4 border-[#0e1012]">
          {profile.avatar ? (
            <img src={profile.avatar} alt="" className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center bg-[#2e4882]">
              <span className="text-[36px] font-medium text-[#f8f8f8]">
                {profile.displayName.charAt(0)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BioSocials({
  bio,
  socialLinks,
}: {
  bio: string | null;
  socialLinks: Record<string, string>;
}) {
  const hasCustom = Object.keys(socialLinks).length > 0;
  return (
    <div className="max-w-[400px]">
      {bio && (
        <p className="text-[13px] leading-[1.6] text-[#a0a0a0]">
          {bio.length > 200 ? bio.slice(0, 200) : bio}
          {bio.length > 200 && <button className="ml-[4px] text-[#e91e8c]">More</button>}
        </p>
      )}
      <div className="mt-[12px] flex items-center gap-[10px]">
        {hasCustom
          ? Object.entries(socialLinks).map(([platform]) => {
              const icon = SOCIAL_ICONS[platform.toLowerCase()];
              if (!icon) return null;
              return (
                <div
                  key={platform}
                  className="flex size-[32px] items-center justify-center rounded-[8px]"
                  style={{ background: icon.bg }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d={icon.path} />
                  </svg>
                </div>
              );
            })
          : ['facebook', 'instagram', 'twitter'].map((p) => (
              <div
                key={p}
                className="flex size-[32px] items-center justify-center rounded-[8px]"
                style={{ background: SOCIAL_ICONS[p].bg }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d={SOCIAL_ICONS[p].path} />
                </svg>
              </div>
            ))}
      </div>
    </div>
  );
}

export function PublicProfileHeader({ profile, isOwnProfile, followLoading, onFollow }: Props) {
  const hashtags = profile.hashtags || DEFAULT_HASHTAGS;

  return (
    <div className="rounded-[22px] bg-[#0e1012]">
      <CoverSection profile={profile} />

      {/* Info */}
      <div className="px-[24px] pb-[20px] pt-[50px]">
        <div className="flex flex-col gap-[12px] md:flex-row md:justify-between">
          {/* Left */}
          <div>
            <div className="flex items-center gap-[6px]">
              <p className="text-[20px] font-semibold text-[#f8f8f8]">{profile.displayName}</p>
              {profile.isVerified && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#01adf1">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              )}
            </div>
            <p className="text-[14px] text-[#5d5d5d]">@{profile.username}</p>
            <div className="mt-[12px] flex items-center gap-[24px]">
              <div className="text-center">
                <p className="text-[18px] font-bold text-[#f8f8f8]">{profile.followingCount}</p>
                <p className="text-[12px] text-[#5d5d5d]">Following</p>
              </div>
              <div className="text-center">
                <p className="text-[18px] font-bold text-[#f8f8f8]">{profile.followersCount}</p>
                <p className="text-[12px] text-[#5d5d5d]">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-[18px] font-bold text-[#f8f8f8]">{profile.likesCount ?? 5570}</p>
                <p className="text-[12px] text-[#5d5d5d]">Likes</p>
              </div>
            </div>
            {!isOwnProfile && (
              <div className="mt-[12px] flex items-center gap-[8px]">
                <button
                  onClick={onFollow}
                  disabled={followLoading}
                  className="rounded-[8px] border border-[#5d5d5d] px-[16px] py-[6px] text-[13px] text-[#f8f8f8] hover:border-white disabled:opacity-50"
                >
                  {profile.isFollowing ? 'Following' : 'Edit Profile'}
                </button>
                <button className="flex size-[32px] items-center justify-center rounded-[8px] border border-[#5d5d5d]">
                  <svg width="16" height="4" viewBox="0 0 16 4" fill="#f8f8f8">
                    <circle cx="2" cy="2" r="2" />
                    <circle cx="8" cy="2" r="2" />
                    <circle cx="14" cy="2" r="2" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Right - Bio + Socials */}
          <BioSocials bio={profile.bio} socialLinks={profile.socialLinks || {}} />
        </div>

        {/* Hashtags */}
        <div className="mt-[12px] flex flex-wrap gap-[8px]">
          {hashtags.map((tag) => (
            <span key={tag} className="text-[12px] text-[#5d5d5d]">
              {tag.startsWith('#') ? tag : `#${tag}`}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
