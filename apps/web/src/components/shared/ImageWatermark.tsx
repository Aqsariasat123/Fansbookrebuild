export function ImageWatermark({ username }: { username: string }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex select-none items-center gap-[6px] bg-black/50 px-[8px] py-[5px]">
      <img
        src="/icons/dashboard/fansbook-logo.webp"
        alt=""
        className="h-[12px] w-auto opacity-90"
      />
      <span className="font-outfit text-[9px] text-white/80">fansbook.vip/u/{username}</span>
    </div>
  );
}
