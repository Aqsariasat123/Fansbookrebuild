export function ImageWatermark({ username }: { username: string }) {
  return (
    <div className="pointer-events-none absolute bottom-[8px] right-[8px] flex select-none items-center gap-[6px] rounded-[4px] bg-black/50 px-[8px] py-[4px]">
      <img
        src="/icons/dashboard/fansbook-logo.webp"
        alt=""
        className="h-[12px] w-auto opacity-90"
      />
      <span className="font-outfit text-[9px] text-white/80">fansbook.vip/u/{username}</span>
    </div>
  );
}
