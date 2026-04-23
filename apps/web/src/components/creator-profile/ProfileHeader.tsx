import { useRef, useState, type MouseEvent } from 'react';
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

function makeFileHandler(cb: (f: File) => void) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) cb(f);
    e.target.value = '';
  };
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
  const [sharePos, setSharePos] = useState<{ top: number; right: number } | null>(null);
  const initial = displayName.charAt(0).toUpperCase();
  const hasAbout = bio || hashtags.length > 0;

  const handleShareClick = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSharePos({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
    setShowShare(true);
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
        <div className="absolute right-[12px] top-[12px] z-20 flex gap-[8px]">
          <CoverIcon title="Change cover photo" onClick={() => coverRef.current?.click()}>
            <path d={CAMERA_D} />
          </CoverIcon>
          <CoverIcon title="Edit profile" onClick={() => navigate('/creator/profile/edit')}>
            <path d={EDIT_D} />
          </CoverIcon>
          <button
            type="button"
            title="Share profile"
            onClick={handleShareClick}
            className="flex size-[32px] items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
        </div>
        <input
          ref={coverRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={makeFileHandler(onCoverUpload)}
        />
      </div>

      <div>
        {/* Avatar — wrapper is pointer-events-none so its transparent area doesn't block cover buttons */}
        <div className="pointer-events-none relative z-10 -mt-[60px] flex justify-center md:-mt-[88px] md:justify-start">
          <div className="pointer-events-auto relative size-[130px] rounded-full border-4 border-muted bg-muted md:size-[176px]">
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 5h-3.17L15 3H9L7.17 5H4C2.9 5 2 5.9 2 7v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-8 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
              </svg>
            </button>
            <input
              ref={avatarRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={makeFileHandler(onAvatarUpload)}
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

      {showShare && (
        <ProfileSharePopup
          username={username}
          pos={sharePos!}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}
