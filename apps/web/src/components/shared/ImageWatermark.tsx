export function ImageWatermark({ username }: { username: string }) {
  return (
    <div className="pointer-events-none absolute bottom-[10px] right-[10px] flex max-w-[calc(100%-20px)] select-none items-center gap-[6px] rounded-[6px] bg-black/55 px-[10px] py-[5px]">
      <img src="/images/landing/logo.webp" alt="" className="h-[14px] w-auto shrink-0 opacity-90" />
      <span className="truncate font-outfit text-[11px] text-white/90">@{username}</span>
    </div>
  );
}
