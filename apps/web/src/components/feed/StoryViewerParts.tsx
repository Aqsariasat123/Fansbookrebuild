export function ProgressBars({
  total,
  current,
  progress,
}: {
  total: number;
  current: number;
  progress: number;
}) {
  return (
    <div className="absolute left-0 right-0 top-0 z-20 flex gap-[3px] px-3 pt-3">
      {Array.from({ length: total }).map((_, i) => {
        const width = i < current ? 100 : i === current ? progress * 100 : 0;
        return (
          <div key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-card/30">
            <div
              className="h-full rounded-full bg-card transition-none"
              style={{ width: `${width}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}

export function NavArrow({
  direction,
  onClick,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
}) {
  const isLeft = direction === 'left';
  return (
    <button
      onClick={onClick}
      className={`absolute ${isLeft ? 'left-4' : 'right-4'} top-1/2 hidden -translate-y-1/2 rounded-full bg-card/10 p-2 text-white hover:bg-card/20 md:block`}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d={isLeft ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}
