/**
 * Visible watermark overlaid on post media. Carries the CREATOR's handle so
 * the leaked image still credits the original poster.
 *
 * Card #4 follow-up: an earlier iteration switched this to the *viewer's*
 * handle for screenshot-attribution purposes, but the client found that
 * confusing — fans saw their own @ on other creators' images. Per-viewer
 * attribution will live in the forensic spread-spectrum layer scoped on
 * card #23; this visible overlay is back to "this post belongs to @creator".
 */
export function ImageWatermark({ username }: { username?: string | null }) {
  const label = username ? `inscrio.com/u/${username}` : 'inscrio.com';
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[10px] flex select-none justify-end px-[10px]">
      <div className="flex shrink-0 items-center gap-[8px] rounded-[6px] bg-black/55 px-[12px] py-[6px]">
        <img
          src="/images/landing/logo.webp"
          alt=""
          className="h-[18px] w-auto shrink-0 opacity-90"
        />
        <span className="max-w-[200px] truncate font-outfit text-[13px] text-white/90">
          {label}
        </span>
      </div>
    </div>
  );
}
