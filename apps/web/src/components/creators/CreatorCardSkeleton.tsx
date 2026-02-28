export function CreatorCardSkeleton() {
  return (
    <div className="w-full animate-pulse overflow-hidden rounded-[12px] bg-card sm:rounded-[22px] sm:w-[244px]">
      <div className="h-[160px] w-full bg-muted sm:h-[243px]" />
      <div className="px-[22px] pt-[15px] pb-[18px]">
        <div className="h-[16px] w-[120px] rounded bg-muted" />
        <div className="mt-[6px] h-[12px] w-[90px] rounded bg-muted" />
        <div className="mt-[15px] h-[20px] w-[140px] rounded bg-muted" />
        <div className="mt-[15px] h-[20px] w-[100px] rounded bg-muted" />
        <div className="mt-[22px] h-[36px] w-[174px] rounded bg-muted" />
      </div>
    </div>
  );
}
