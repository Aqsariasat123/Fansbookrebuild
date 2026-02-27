export function CoverIcon({ d, onClick }: { d: string; onClick: () => void }) {
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

export function Stat({ value, label }: { value: number; label: string }) {
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

export function BioSocialSection({
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
