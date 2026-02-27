import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const IMG = '/icons/dashboard';

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
  postsCount: number;
  uploadingAvatar: boolean;
  uploadingCover: boolean;
  onAvatarUpload: (file: File) => void;
  onCoverUpload: (file: File) => void;
}

function StatBadge({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center gap-[2px]">
      <p className="text-[18px] font-semibold text-[#f8f8f8] md:text-[24px]">
        {value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
      </p>
      <p className="text-[11px] text-[#5d5d5d] md:text-[14px]">{label}</p>
    </div>
  );
}

export function ProfileHeader({
  displayName,
  username,
  avatar,
  cover,
  bio,
  hashtags,
  isVerified,
  followersCount,
  followingCount,
  postsCount,
  uploadingAvatar,
  uploadingCover,
  onAvatarUpload,
  onCoverUpload,
}: ProfileHeaderProps) {
  const navigate = useNavigate();
  const avatarRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const initial = displayName.charAt(0).toUpperCase();

  const cameraIcon = (
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
  );

  return (
    <div className="relative rounded-[11px] md:rounded-[22px] overflow-hidden bg-[#0e1012]">
      {/* Cover */}
      <div className="relative h-[140px] w-full md:h-[260px]">
        {cover ? (
          <img src={cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-[#2e4882] to-[#a61651]" />
        )}
        {uploadingCover && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
          </div>
        )}
        <button
          onClick={() => coverRef.current?.click()}
          disabled={uploadingCover}
          className="absolute bottom-[10px] right-[10px] flex items-center gap-[6px] rounded-[8px] bg-black/50 px-[12px] py-[6px] text-[12px] text-[#f8f8f8] hover:bg-black/70 transition-colors md:bottom-[16px] md:right-[16px] md:text-[14px]"
        >
          {cameraIcon}
          Edit Cover
        </button>
        <input
          ref={coverRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onCoverUpload(f);
            e.target.value = '';
          }}
        />
      </div>

      {/* Avatar + Info */}
      <div className="relative flex flex-col items-center px-[16px] pb-[20px] md:px-[30px] md:pb-[30px]">
        <div className="-mt-[50px] relative md:-mt-[70px]">
          <div className="size-[100px] md:size-[140px] rounded-full border-[4px] border-[#0e1012] overflow-hidden bg-[#0e1012]">
            {avatar ? (
              <img src={avatar} alt={displayName} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#2e4882]">
                <span className="text-[36px] font-medium text-[#f8f8f8] md:text-[48px]">
                  {initial}
                </span>
              </div>
            )}
            {uploadingAvatar && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-white border-t-transparent" />
              </div>
            )}
          </div>
          <button
            onClick={() => avatarRef.current?.click()}
            disabled={uploadingAvatar}
            className="absolute bottom-[4px] right-[4px] flex size-[30px] items-center justify-center rounded-full bg-[#2e4882] hover:opacity-80 transition-opacity disabled:opacity-50 md:size-[36px]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
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
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onAvatarUpload(f);
              e.target.value = '';
            }}
          />
        </div>

        <div className="mt-[10px] flex items-center gap-[6px]">
          <p className="text-[20px] font-semibold text-[#f8f8f8] md:text-[28px]">{displayName}</p>
          {isVerified && (
            <img
              src={`${IMG}/verified.svg`}
              alt="Verified"
              className="size-[18px] md:size-[22px]"
            />
          )}
        </div>
        <p className="text-[14px] text-[#5d5d5d] md:text-[16px]">@{username}</p>

        <div className="mt-[16px] flex items-center gap-[30px] md:mt-[20px] md:gap-[50px]">
          <StatBadge label="Followers" value={followersCount} />
          <div className="h-[30px] w-px bg-[#2a2d30]" />
          <StatBadge label="Following" value={followingCount} />
          <div className="h-[30px] w-px bg-[#2a2d30]" />
          <StatBadge label="Posts" value={postsCount} />
        </div>

        {bio && (
          <p className="mt-[14px] max-w-[600px] text-center text-[13px] text-[#a0a0a0] md:mt-[18px] md:text-[15px]">
            {bio}
          </p>
        )}

        {hashtags.length > 0 && (
          <div className="mt-[8px] flex flex-wrap justify-center gap-[6px] md:gap-[10px]">
            {hashtags.map((tag) => (
              <span
                key={tag}
                className="rounded-[8px] bg-[#15191c] px-[10px] py-[4px] text-[12px] text-[#01adf1] md:text-[14px]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-[18px] flex flex-wrap items-center justify-center gap-[10px] md:mt-[24px] md:gap-[16px]">
          <button
            onClick={() => navigate('/creator/profile/edit')}
            className="rounded-[10px] border border-[#5d5d5d] px-[20px] py-[8px] text-[13px] text-[#f8f8f8] transition-colors hover:border-[#f8f8f8] md:px-[28px] md:py-[10px] md:text-[15px]"
          >
            Edit Profile
          </button>
          <button
            onClick={() => navigate('/creator/go-live')}
            className="rounded-[10px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[20px] py-[8px] text-[13px] font-medium text-[#f8f8f8] transition-opacity hover:opacity-90 md:px-[28px] md:py-[10px] md:text-[15px]"
          >
            Go Live
          </button>
          <button className="rounded-[10px] border border-[#01adf1] px-[20px] py-[8px] text-[13px] text-[#01adf1] transition-colors hover:bg-[#01adf1]/10 md:px-[28px] md:py-[10px] md:text-[15px]">
            Schedule Live
          </button>
        </div>
      </div>
    </div>
  );
}
