/**
 * Upload progress bar shown while a post with media is being submitted.
 * Below 100% it tracks the actual bytes sent; at 100% the bytes are all
 * uploaded and the server is still processing (watermarking, thumbnails),
 * so it switches to a "Processing…" pulse.
 */
export function UploadProgressBar({ progress }: { progress: number }) {
  const pct = Math.min(100, Math.max(0, Math.round(progress)));
  const processing = pct >= 100;
  return (
    <div className="mt-[16px]">
      <div className="mb-[6px] flex justify-between text-[13px] text-muted-foreground">
        <span>{processing ? 'Processing…' : 'Uploading…'}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-[8px] w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full bg-gradient-to-r from-[#01adf1] to-[#a61651] transition-[width] duration-200 ${
            processing ? 'animate-pulse' : ''
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
