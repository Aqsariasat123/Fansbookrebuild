import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileSharePopup } from './ProfileSharePopup';
import { CoverIcon, StatsRow, AboutSection, HashtagsSection } from './ProfileHeaderParts';

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
  uploadingAvatar,
  uploadingCover,
  onAvatarUpload,
  onCoverUpload,
  onScheduleLive,
}: ProfileHeaderProps) {
  const navigate = useNavigate();
  const avatarRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const [showShare, setShowShare] = useState(false);
  const initial = displayName.charAt(0).toUpperCase();

  const handleFile = (cb: (f: File) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) cb(f);
    e.target.value = '';
  };

  return (
    <div>
      {/* Cover banner - full width */}
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
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-[12px] right-[12px] flex gap-[8px]">
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
            onClick={() => setShowShare(true)}
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
      <div>
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
        </div>

        {/* Name */}
        <div className="mt-[16px] text-center md:text-left">
          <div className="flex items-center justify-center gap-[6px] md:justify-start">
            <h2 className="text-[20px] font-semibold text-foreground">{displayName}</h2>
            {isVerified && (
              <img src="/icons/dashboard/verified.svg" alt="Verified" className="size-[18px]" />
            )}
          </div>
          <p className="text-[16px] text-muted-foreground">@{username}</p>
        </div>

        <StatsRow
          followingCount={followingCount}
          followersCount={followersCount}
          likesCount={likesCount}
        />

        {/* Edit Profile + actions */}
        <div className="mt-[20px] flex items-center gap-[10px]">
          <button
            onClick={() => navigate('/creator/profile/edit')}
            className="rounded-[11px] border border-border px-[36px] py-[12px] text-[16px] font-medium text-foreground shadow-[0px_6px_10px_rgba(34,34,34,0.25)] transition-colors hover:border-foreground"
          >
            Edit Profile
          </button>
          <button className="flex size-[46px] items-center justify-center rounded-[11px] border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>
        </div>

        {/* Go Live + Schedule */}
        <div className="mt-[16px] flex items-center gap-[10px]">
          <button
            onClick={() => navigate('/creator/go-live')}
            className="flex-1 rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[12px] text-center text-[14px] font-medium text-white transition-opacity hover:opacity-90"
          >
            Go Live
          </button>
          <button
            onClick={onScheduleLive}
            className="flex-1 rounded-[50px] border border-border py-[12px] text-center text-[14px] text-foreground transition-colors hover:border-foreground"
          >
            Schedule Live
          </button>
        </div>

        <AboutSection bio={bio} />
        <HashtagsSection hashtags={hashtags} />
      </div>

      {showShare && <ProfileSharePopup username={username} onClose={() => setShowShare(false)} />}
    </div>
  );
}
