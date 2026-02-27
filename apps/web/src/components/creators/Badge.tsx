export type BadgeType = 'live' | 'verified' | 'top' | 'new';

export function Badge({ type }: { type: BadgeType }) {
  if (type === 'live') {
    return (
      <span className="flex items-center gap-[5px] rounded-[4px] bg-[#e02a2a] px-[8px] py-[4px]">
        <img src="/icons/creators/live_dot.svg" alt="" className="h-[4px] w-[4px]" />
        <span className="font-outfit text-[12px] font-normal text-[#f8f8f8]">Live</span>
      </span>
    );
  }
  if (type === 'verified') {
    return (
      <span className="flex items-center gap-[5px] rounded-[4px] bg-[#15191c] px-[5px] py-[4px]">
        <span className="font-outfit text-[12px] font-normal text-[#f8f8f8]">Verified</span>
        <img src="/icons/creators/verified.svg" alt="" className="h-[16px] w-[16px]" />
      </span>
    );
  }
  if (type === 'top') {
    return (
      <span className="rounded-[4px] bg-[#15191c] px-[10px] py-[5px] font-outfit text-[12px] font-normal text-[#f8f8f8]">
        Top
      </span>
    );
  }
  return (
    <span className="rounded-[4px] bg-[#15191c] px-[10px] py-[5px] font-outfit text-[12px] font-normal text-[#f8f8f8]">
      New
    </span>
  );
}
