export function ImageWatermark({ username }: { username: string }) {
  return (
    <div className="pointer-events-none absolute bottom-[10px] right-[10px] flex select-none items-center gap-[8px] rounded-[6px] bg-black/55 px-[12px] py-[6px]">
      <img src="/images/landing/logo.webp" alt="" className="h-[18px] w-auto opacity-90" />
      <span className="font-outfit text-[13px] text-white/90">inscrio.com/u/{username}</span>
    </div>
  );
}
