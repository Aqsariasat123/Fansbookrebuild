import { useState } from 'react';
import { MarketingNav } from '../components/marketing/MarketingNav';
import { useLiveSessions, useUpcomingLives } from '../hooks/useLive';
import { useCreatorFilters } from '../hooks/useCreators';
import type { LiveFilterParams } from '@fansbook/shared';
import { LiveCard, LiveCardSkeleton } from '../components/creators-live/LiveCard';
import { UpcomingTable } from '../components/creators-live/UpcomingTable';
import { MobileFilterBar, DesktopFilterSidebar } from '../components/creators-live/FilterSidebar';

export default function CreatorsLive() {
  const [pendingFilters, setPendingFilters] = useState<LiveFilterParams>({});
  const [appliedFilters, setAppliedFilters] = useState<LiveFilterParams>({});

  const { data: filterOptions } = useCreatorFilters();
  const { data: sessions, isLoading, isError } = useLiveSessions(appliedFilters);
  const { data: upcoming } = useUpcomingLives();

  const handleApply = () => setAppliedFilters({ ...pendingFilters });
  const handleReset = () => {
    setPendingFilters({});
    setAppliedFilters({});
  };

  const filterProps = {
    pending: pendingFilters,
    onChange: setPendingFilters,
    onApply: handleApply,
    onReset: handleReset,
    filterOptions,
  };

  return (
    <div className="min-h-screen bg-muted font-outfit">
      <div className="relative h-[130px]">
        <MarketingNav />
      </div>

      <div className="flex flex-col items-center gap-[11px] px-[20px] pt-[20px] pb-[20px] text-foreground md:px-0 md:pb-[50px]">
        <h1 className="text-center text-[24px] font-normal md:text-[48px]">
          Creators Are Live Now!
        </h1>
        <p className="max-w-[270px] text-center text-[12px] font-normal md:max-w-none md:text-[16px]">
          Join private live sessions, interact in real-time, and support your favourite creators.
        </p>
      </div>

      <div className="flex flex-col items-center gap-[20px] px-[16px] md:px-[40px] lg:flex-row lg:items-start lg:justify-center lg:gap-[66px] lg:px-[86px]">
        <MobileFilterBar {...filterProps} />
        <DesktopFilterSidebar {...filterProps} />
        <LiveGrid sessions={sessions} isLoading={isLoading} isError={isError} />
      </div>

      <UpcomingTable upcoming={upcoming} />
    </div>
  );
}

function LiveGrid({
  sessions,
  isLoading,
  isError,
}: {
  sessions: ReturnType<typeof useLiveSessions>['data'];
  isLoading: boolean;
  isError: boolean;
}) {
  if (isError) {
    return (
      <div className="w-full py-[60px] text-center font-outfit text-[18px] text-[#999]">
        Something went wrong. Please try again.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid w-full grid-cols-2 gap-[16px] sm:gap-[20px] md:gap-[40px] lg:w-auto lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <LiveCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="w-full py-[60px] text-center font-outfit text-[18px] text-[#999]">
        No live sessions right now. Check back soon!
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-2 gap-[16px] sm:gap-[20px] md:gap-[40px] lg:w-auto lg:grid-cols-3">
      {sessions.map((session) => (
        <LiveCard key={session.id} session={session} />
      ))}
    </div>
  );
}
