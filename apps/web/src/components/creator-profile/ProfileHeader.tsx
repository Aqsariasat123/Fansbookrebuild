import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileSharePopup } from './ProfileSharePopup';
import { CoverIcon, StatsRow, HashtagsSection } from './ProfileHeaderParts';

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
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
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

        {/* Name + bio row */}
        <div className="mt-[16px] flex flex-col gap-[16px] md:flex-row md:items-stretch md:gap-0">
          {/* LEFT: name / stats / edit */}
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

          {/* Vertical separator */}
          {bio && <div className="hidden md:block mx-[28px] w-px self-stretch bg-border" />}

          {/* RIGHT: bio + social links */}
          {bio && (
            <div className="flex flex-1 flex-col justify-between">
              <p className="text-[14px] leading-[1.7] text-muted-foreground">{bio}</p>
              {socialLinks && (
                <div className="mt-[12px] flex items-center justify-end gap-[10px]">
                  {Object.entries(socialLinks)
                    .filter(([, v]) => v)
                    .map(([key]) => {
                      const ICONS: Record<string, { color: string; path: string }> = {
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
                      const icon = ICONS[key];
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
          )}
        </div>

        <HashtagsSection hashtags={hashtags} />
      </div>

      {showShare && <ProfileSharePopup username={username} onClose={() => setShowShare(false)} />}
    </div>
  );
}
