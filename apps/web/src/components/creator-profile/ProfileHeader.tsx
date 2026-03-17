import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileSharePopup } from './ProfileSharePopup';
import { CoverIcon, StatsRow, ProfileAboutColumn } from './ProfileHeaderParts';

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
}

const CAMERA_D =
  'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z';
const EDIT_D =
  'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z';
const SHARE_D = 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3';

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
  likesCount,
  socialLinks,
  uploadingAvatar,
  uploadingCover,
  onAvatarUpload,
  onCoverUpload,
}: ProfileHeaderProps) {
  const navigate = useNavigate();
  const avatarRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const [showShare, setShowShare] = useState(false);
  const initial = displayName.charAt(0).toUpperCase();
  const hasAbout = bio || hashtags.length > 0;

  const handleFile = (cb: (f: File) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) cb(f);
    e.target.value = '';
  };

  return (
    <div>
      {/* Cover banner */}
      <div className="relative h-[180px] w-full overflow-hidden md:h-[240px]">
        {cover ? (
          <img src={cover} alt="" className="absolute inset-0 size-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}
        {uploadingCover && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="size-8 animate-spin rounded-full border-4 border-foreground border-t-transparent" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-[12px] right-[12px] flex gap-[8px]">
          <CoverIcon d={CAMERA_D} onClick={() => coverRef.current?.click()} />
          <CoverIcon d={EDIT_D} onClick={() => navigate('/creator/profile/edit')} />
          <CoverIcon d={SHARE_D} onClick={() => setShowShare(true)} />
        </div>
        <input
          ref={coverRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile(onCoverUpload)}
        />
      </div>

      <div>
        {/* Avatar */}
        <div className="relative z-10 -mt-[60px] flex justify-center md:-mt-[88px] md:justify-start">
          <div className="relative size-[130px] rounded-full border-4 border-muted bg-muted md:size-[176px]">
            {avatar ? (
              <img src={avatar} alt="" className="size-full rounded-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center rounded-full bg-muted">
                <span className="text-[40px] font-medium text-muted-foreground md:text-[52px]">
                  {initial}
                </span>
              </div>
            )}
            {uploadingAvatar && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                <div className="size-6 animate-spin rounded-full border-4 border-foreground border-t-transparent" />
              </div>
            )}
            <button
              onClick={() => avatarRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute bottom-[2px] right-[2px] flex size-[30px] items-center justify-center rounded-full bg-primary text-white hover:opacity-80 md:size-[36px]"
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
                <path d={CAMERA_D} />
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
        </div>

        {/* Name + bio row */}
        <div className="mt-[16px] flex flex-col gap-[16px] md:flex-row md:items-stretch md:gap-0">
          {/* LEFT */}
          <div className="flex-shrink-0">
            <div className="flex items-center gap-[6px]">
              <h2 className="text-[20px] font-semibold text-foreground">{displayName}</h2>
              {isVerified && (
                <img src="/icons/dashboard/verified.svg" alt="Verified" className="size-[18px]" />
              )}
            </div>
            <p className="text-[14px] text-muted-foreground">@{username}</p>
            <StatsRow
              followingCount={followingCount}
              followersCount={followersCount}
              likesCount={likesCount}
            />
            <div className="mt-[20px]">
              <button
                onClick={() => navigate('/creator/profile/edit')}
                className="rounded-[11px] border border-border px-[36px] py-[10px] text-[15px] font-medium text-foreground transition-colors hover:border-foreground"
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* Separator */}
          {hasAbout && <div className="hidden md:block mx-[28px] w-px self-stretch bg-border" />}

          {/* RIGHT */}
          {hasAbout && (
            <ProfileAboutColumn bio={bio} hashtags={hashtags} socialLinks={socialLinks} />
          )}
        </div>
      </div>

      {showShare && <ProfileSharePopup username={username} onClose={() => setShowShare(false)} />}
    </div>
  );
}
