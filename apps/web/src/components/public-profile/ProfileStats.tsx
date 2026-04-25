function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(2)}K`;
  return String(n);
}

interface Props {
  followingCount: number;
  followersCount: number;
  likesCount?: number;
  imagesCount?: number;
  videosCount?: number;
}

export function ProfileStats({
  followingCount,
  followersCount,
  likesCount = 0,
  imagesCount = 0,
  videosCount = 0,
}: Props) {
  return (
    <div className="mt-[12px] flex select-none flex-wrap gap-x-[20px] gap-y-[8px] md:gap-x-[28px]">
      {[
        { val: followingCount, label: 'Following' },
        { val: followersCount, label: 'Followers' },
        { val: likesCount, label: 'Likes' },
        { val: imagesCount, label: 'Images' },
        { val: videosCount, label: 'Videos' },
      ].map(({ val, label }) => (
        <div key={label}>
          <p className="text-[15px] font-semibold text-foreground">{formatCount(val)}</p>
          <p className="text-[11px] text-muted-foreground">{label}</p>
        </div>
      ))}
    </div>
  );
}
