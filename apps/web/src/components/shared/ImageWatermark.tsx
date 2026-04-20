export function ImageWatermark({ username }: { username: string }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[10px] flex select-none justify-end px-[10px]">
      <div className="flex shrink-0 items-center gap-[8px] rounded-[6px] bg-black/55 px-[12px] py-[6px]">
        <img
          src="/images/landing/logo.webp"
          alt=""
          className="h-[18px] w-auto shrink-0 opacity-90"
        />
        <span className="max-w-[200px] truncate font-outfit text-[13px] text-white/90">
          inscrio.com/u/{username}
        </span>
      </div>
    </div>
  );
}
