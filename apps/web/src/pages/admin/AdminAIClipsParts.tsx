export interface ClipStats {
  totalJobs: number;
  totalClips: number;
  publishedClips: number;
  queuedJobs: number;
  failedJobs: number;
}

const STATUS_COLOR: Record<string, string> = {
  QUEUED: 'bg-gray-500/20 text-gray-400',
  EXTRACTING: 'bg-blue-500/20 text-blue-400',
  ANALYZING: 'bg-purple-500/20 text-purple-400',
  CUTTING: 'bg-yellow-500/20 text-yellow-400',
  DONE: 'bg-green-500/20 text-green-400',
  FAILED: 'bg-red-500/20 text-red-400',
};

export function StatsRow({ s }: { s: ClipStats }) {
  const items = [
    { label: 'Total Jobs', value: s.totalJobs, color: 'text-foreground' },
    { label: 'Total Clips', value: s.totalClips, color: 'text-[#01adf1]' },
    { label: 'Published', value: s.publishedClips, color: 'text-green-400' },
    { label: 'Processing', value: s.queuedJobs, color: 'text-blue-400' },
    { label: 'Failed', value: s.failedJobs, color: 'text-red-400' },
  ];
  return (
    <div className="grid grid-cols-2 gap-[10px] md:grid-cols-5">
      {items.map((item) => (
        <div key={item.label} className="rounded-[10px] border border-border bg-card p-[14px]">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{item.label}</p>
          <p className={`text-[22px] font-bold mt-[4px] ${item.color}`}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}

export function QueueTable({
  jobs,
}: {
  jobs: {
    id: string;
    originalName: string;
    status: string;
    errorMessage: string | null;
    createdAt: string;
    user: { username: string };
    clips: { id: string; published: boolean }[];
  }[];
}) {
  if (!jobs.length) return <p className="text-[13px] text-muted-foreground">No jobs yet</p>;
  return (
    <div className="flex flex-col gap-[8px]">
      {jobs.map((j) => (
        <div
          key={j.id}
          className="rounded-[10px] border border-border bg-card p-[14px] flex items-center gap-[12px]"
        >
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-foreground truncate">{j.originalName}</p>
            <p className="text-[11px] text-muted-foreground mt-[2px]">
              @{j.user?.username} · {new Date(j.createdAt).toLocaleString()} · {j.clips.length}{' '}
              clips
            </p>
            {j.errorMessage && (
              <p className="text-[11px] text-red-400 mt-[2px]">{j.errorMessage}</p>
            )}
          </div>
          <span
            className={`shrink-0 rounded-[20px] px-[8px] py-[2px] text-[10px] font-medium ${STATUS_COLOR[j.status] ?? 'bg-muted text-muted-foreground'}`}
          >
            {j.status}
          </span>
        </div>
      ))}
    </div>
  );
}

export function CreatorTable({
  rows,
}: {
  rows: { user: { id: string; username: string; displayName: string }; jobCount: number }[];
}) {
  if (!rows.length) return <p className="text-[13px] text-muted-foreground">No data yet</p>;
  return (
    <div className="flex flex-col gap-[6px]">
      {rows.map((r) => (
        <div
          key={r.user?.id}
          className="flex items-center justify-between rounded-[10px] border border-border bg-card px-[14px] py-[12px]"
        >
          <div>
            <p className="text-[13px] font-medium text-foreground">{r.user?.displayName}</p>
            <p className="text-[11px] text-muted-foreground">@{r.user?.username}</p>
          </div>
          <p className="text-[14px] font-bold text-[#01adf1]">{r.jobCount} sessions</p>
        </div>
      ))}
    </div>
  );
}
