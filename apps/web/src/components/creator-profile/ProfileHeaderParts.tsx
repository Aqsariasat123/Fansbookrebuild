export function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(2)}K`;
  return String(n);
}

export function CoverIcon({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
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
        {children}
      </svg>
    </button>
  );
}

export function StatsRow({
  followingCount,
  followersCount,
  likesCount,
}: {
  followingCount: number;
  followersCount: number;
  likesCount: number;
}) {
  return (
    <div className="mt-[24px] flex select-none items-center justify-center gap-[40px] md:justify-start">
      <div className="text-center md:text-left">
        <p className="text-[16px] font-medium text-foreground">{formatCount(followingCount)}</p>
        <p className="text-[12px] text-muted-foreground">Following</p>
      </div>
      <div className="text-center md:text-left">
        <p className="text-[16px] font-medium text-foreground">{formatCount(followersCount)}</p>
        <p className="text-[12px] text-muted-foreground">Followers</p>
      </div>
      <div className="text-center md:text-left">
        <p className="text-[16px] font-medium text-foreground">{formatCount(likesCount)}</p>
        <p className="text-[12px] text-muted-foreground">Likes</p>
      </div>
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

export function ProfileAboutColumn({
  bio,
  hashtags,
  socialLinks,
}: {
  bio: string;
  hashtags: string[];
  socialLinks?: { facebook?: string; instagram?: string; twitter?: string };
}) {
  return (
    <div className="flex flex-1 flex-col gap-[10px]">
      <p className="text-[15px] font-semibold text-foreground">About</p>
      {bio && <p className="text-[14px] leading-[1.7] text-muted-foreground">{bio}</p>}
      {hashtags.length > 0 && (
        <div className="flex flex-wrap gap-[8px]">
          {hashtags.map((tag) => (
            <span
              key={tag}
              className="rounded-[8px] border border-border px-[12px] py-[6px] text-[13px] text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      {socialLinks && (
        <div className="mt-auto flex items-center justify-end gap-[10px] pt-[8px]">
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
