import type { CreatorCard as CreatorCardType } from '@fansbook/shared';
import { CreatorCard } from './CreatorCard';

export default function CreatorsGrid({
  creators,
  loading,
  loadingMore,
  observerRef,
}: {
  creators: CreatorCardType[];
  loading: boolean;
  loadingMore: boolean;
  observerRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
  if (loading)
    return (
      <div className="grid grid-cols-2 gap-[16px] md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-[260px] animate-pulse rounded-[16px] bg-card" />
        ))}
      </div>
    );
  if (creators.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-[60px]">
        <img
          src="/icons/creators/search.svg"
          alt=""
          className="mb-[16px] h-[48px] w-[48px] opacity-30"
        />
        <p className="font-outfit text-[16px] text-muted-foreground">No creators found</p>
      </div>
    );
  return (
    <>
      <div className="grid grid-cols-2 gap-[16px] md:grid-cols-3 lg:grid-cols-4">
        {creators.map((c) => (
          <CreatorCard key={c.id} creator={c} />
        ))}
      </div>
      {loadingMore && (
        <div className="flex justify-center py-[20px]">
          <div className="h-[24px] w-[24px] animate-spin rounded-full border-[2px] border-border border-t-[#01adf1]" />
        </div>
      )}
      <div ref={observerRef} className="h-[1px]" />
    </>
  );
}
