export function ImageWatermark({ username }: { username: string }) {
  return (
    <div className="pointer-events-none absolute bottom-[10px] right-[10px] flex max-w-[calc(100%-20px)] select-none items-center gap-[8px] rounded-[6px] bg-black/55 px-[12px] py-[6px]">
      <img src="/images/landing/logo.webp" alt="" className="h-[18px] w-auto shrink-0 opacity-90" />
      <span className="min-w-0 truncate font-outfit text-[13px] text-white/90">
        inscrio.com/u/{username}
      </span>
    </div>
  );
}
