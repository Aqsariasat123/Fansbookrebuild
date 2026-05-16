import { useAuthStore } from '../../stores/authStore';

/**
 * Forensic watermark overlaid on post media. Carries the VIEWER's identity
 * (not the author's), so if the viewer screenshots and leaks the image,
 * the leaked frame still says who saw it. Falls back to the brand if no
 * viewer is logged in.
 *
 * This is the screenshot-resilient half of the leak-protection story
 * (cards #4 / #23): the original image is served at full speed from the
 * server cache, and this overlay is rendered client-side on top so it
 * stays in the picture for any screenshot taken of the page.
 */
export function ImageWatermark() {
  const viewer = useAuthStore((s) => s.user?.username);
  const label = viewer ? `inscrio.com/u/${viewer}` : 'inscrio.com';
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
