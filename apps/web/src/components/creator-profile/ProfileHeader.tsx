import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProfileHeaderProps {
  displayName: string;
  username: string;
  avatar: string | null;
  cover: string | null;
  bio: string;
  hashtags: string[];
  isVerified: boolean;
  followersCount: number;
  followingCount: number;
  likesCount: number;
  socialLinks?: { facebook?: string; instagram?: string; twitter?: string };
  uploadingAvatar: boolean;
  uploadingCover: boolean;
  onAvatarUpload: (file: File) => void;
  onCoverUpload: (file: File) => void;
  onScheduleLive?: () => void;
}

function CoverIcon({ d, onClick }: { d: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex size-[38px] items-center justify-center rounded-full bg-[#15191c]/80 text-white hover:bg-[#15191c] transition-colors"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={d} />
      </svg>
    </button>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[20px] font-bold text-[#f8f8f8]">
        {value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
      </span>
      <span className="text-[13px] text-[#5d5d5d]">{label}</span>
    </div>
  );
}

const SOCIAL_ICONS: Record<string, { color: string; path: string }> = {
  facebook: {
    color: '#1877f2',
    path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
  },
  instagram: {
    color: '#e4405f',
    path: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
  },
  twitter: {
    color: '#1da1f2',
    path: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z',
  },
};

function BioSocialSection({
  bio,
  socialLinks,
}: {
  bio: string;
  socialLinks?: { facebook?: string; instagram?: string; twitter?: string };
}) {
  const truncated = bio.length > 180;
  const displayBio = truncated ? `${bio.slice(0, 180)}... ` : bio;
  return (
    <div className="mt-[12px] max-w-[380px] md:mt-0 md:text-right">
      {bio && (
        <p className="text-[13px] leading-[1.6] text-[#a0a0a0] md:text-[14px]">
          {displayBio}
          {truncated && <span className="cursor-pointer font-medium text-[#01adf1]">More</span>}
        </p>
      )}
      {socialLinks && (
        <div className="mt-[12px] flex gap-[10px] md:justify-end">
          {Object.entries(socialLinks)
            .filter(([, v]) => v)
            .map(([key]) => {
              const icon = SOCIAL_ICONS[key];
              if (!icon) return null;
              return (
                <div
                  key={key}
                  className="flex size-[30px] items-center justify-center rounded-[6px]"
                  style={{ backgroundColor: icon.color }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d={icon.path} />
                  </svg>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

export function ProfileHeader(props: ProfileHeaderProps) {
  const {
    displayName,
    username,
    avatar,
    cover,
    bio,
    hashtags,
    isVerified,
    followersCount,
    followingCount,
    likesCount,
    socialLinks,
    uploadingAvatar,
    uploadingCover,
    onAvatarUpload,
    onCoverUpload,
    onScheduleLive,
  } = props;
  const navigate = useNavigate();
  const avatarRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const initial = displayName.charAt(0).toUpperCase();

  const handleFile =
    (ref: React.RefObject<HTMLInputElement | null>, cb: (f: File) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) cb(f);
      e.target.value = '';
    };

  return (
    <div className="overflow-hidden rounded-[11px] bg-[#0e1012] md:rounded-[22px]">
      {/* Cover */}
      <div className="relative h-[140px] w-full md:h-[260px]">
        {cover ? (
          <img src={cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-[#2e4882] to-[#a61651]" />
        )}
        {uploadingCover && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="size-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
          </div>
        )}
        <div className="absolute bottom-[12px] right-[12px] flex gap-[8px] md:bottom-[16px] md:right-[16px]">
          <CoverIcon
            d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
            onClick={() => coverRef.current?.click()}
          />
          <CoverIcon
            d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
            onClick={() => navigate('/creator/profile/edit')}
          />
          <CoverIcon
            d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"
            onClick={() => {}}
          />
        </div>
        <input
          ref={coverRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile(coverRef, onCoverUpload)}
        />
      </div>

      {/* Profile Info */}
      <div className="px-[16px] pb-[20px] md:px-[30px] md:pb-[30px]">
        <div className="flex flex-col gap-[16px] md:flex-row md:gap-[24px]">
          {/* Avatar */}
          <div className="-mt-[40px] relative shrink-0 md:-mt-[60px]">
            <div className="size-[90px] overflow-hidden rounded-full border-[4px] border-[#0e1012] bg-[#0e1012] md:size-[120px]">
              {avatar ? (
                <img src={avatar} alt={displayName} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#2e4882]">
                  <span className="text-[32px] font-medium text-white md:text-[42px]">
                    {initial}
                  </span>
                </div>
              )}
            </div>
            {uploadingAvatar && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                <div className="size-6 animate-spin rounded-full border-4 border-white border-t-transparent" />
              </div>
            )}
            <button
              onClick={() => avatarRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute bottom-[2px] right-[2px] flex size-[28px] items-center justify-center rounded-full bg-[#2e4882] text-white hover:opacity-80 md:size-[34px]"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </button>
            <input
              ref={avatarRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile(avatarRef, onAvatarUpload)}
            />
          </div>

          {/* Left: Name + Stats */}
          <div className="flex flex-1 flex-col md:flex-row md:justify-between">
            <div>
              <div className="flex items-center gap-[6px]">
                <h2 className="text-[20px] font-semibold text-[#f8f8f8] md:text-[26px]">
                  {displayName}
                </h2>
                {isVerified && (
                  <img
                    src="/icons/dashboard/verified.svg"
                    alt="Verified"
                    className="size-[18px] md:size-[22px]"
                  />
                )}
              </div>
              <p className="text-[13px] text-[#5d5d5d] md:text-[15px]">@{username}</p>
              <div className="mt-[12px] flex items-center gap-[24px] md:mt-[16px] md:gap-[32px]">
                <Stat value={followingCount} label="Following" />
                <Stat value={followersCount} label="Followers" />
                <Stat value={likesCount} label="Likes" />
              </div>
              <div className="mt-[14px] flex items-center gap-[10px]">
                <button
                  onClick={() => navigate('/creator/profile/edit')}
                  className="rounded-[8px] border border-[#5d5d5d] px-[18px] py-[7px] text-[13px] text-[#f8f8f8] hover:border-[#f8f8f8] transition-colors md:px-[22px] md:py-[8px] md:text-[14px]"
                >
                  Edit Profile
                </button>
                <button className="flex size-[34px] items-center justify-center rounded-[8px] border border-[#5d5d5d] text-[#5d5d5d] hover:border-[#f8f8f8] hover:text-[#f8f8f8] transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="19" r="2" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right: Bio + Social */}
            <BioSocialSection bio={bio} socialLinks={socialLinks} />
          </div>
        </div>

        {/* Hashtags */}
        {hashtags.length > 0 && (
          <div className="mt-[14px] flex flex-wrap gap-x-[10px] gap-y-[6px]">
            {hashtags.map((tag) => (
              <span key={tag} className="text-[12px] text-[#5d5d5d] md:text-[13px]">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Go Live / Schedule Live */}
        <div className="mt-[20px] flex items-center gap-[16px]">
          <button
            onClick={() => navigate('/creator/go-live')}
            className="flex-1 rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[12px] text-center text-[14px] font-medium text-white transition-opacity hover:opacity-90 md:py-[14px] md:text-[16px]"
          >
            Go Live
          </button>
          <button
            onClick={onScheduleLive}
            className="flex-1 rounded-[50px] border border-[#5d5d5d] py-[12px] text-center text-[14px] text-white transition-colors hover:border-white md:py-[14px] md:text-[16px]"
          >
            Schedule Live
          </button>
        </div>
      </div>
    </div>
  );
}
