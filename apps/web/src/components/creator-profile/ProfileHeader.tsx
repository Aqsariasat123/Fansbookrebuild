import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CoverIcon, Stat, BioSocialSection } from './ProfileHeaderParts';

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

  const handleFile = (cb: (f: File) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
          onChange={handleFile(onCoverUpload)}
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
              onChange={handleFile(onAvatarUpload)}
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
            <BioSocialSection bio={bio} socialLinks={socialLinks} />
          </div>
        </div>

        {hashtags.length > 0 && (
          <div className="mt-[14px] flex flex-wrap gap-x-[10px] gap-y-[6px]">
            {hashtags.map((tag) => (
              <span key={tag} className="text-[12px] text-[#5d5d5d] md:text-[13px]">
                #{tag}
              </span>
            ))}
          </div>
        )}

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
