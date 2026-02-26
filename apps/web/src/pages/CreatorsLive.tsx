import { useState, useRef, useEffect } from 'react';
import { MarketingNav } from '../components/marketing/MarketingNav';
import { useLiveSessions, useUpcomingLives } from '../hooks/useLive';
import { useCreatorFilters } from '../hooks/useCreators';
import type { LiveCreatorCard, LiveFilterParams } from '@fansbook/shared';

/* ─── Category → Icon mapping ─── */
const CATEGORY_ICONS: Record<string, string> = {
  Artist: 'palette',
  Model: 'photo_camera',
  'Adult Creator': '18_up_rating',
  'Personal Trainer': 'sports_gymnastics',
  Comedian: 'comedy_mask',
  Musician: 'comedy_mask',
  Chef: 'palette',
};

/* ─── Dropdown Component ─── */
function Dropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-[10px] p-[10px]"
      >
        <span className="font-outfit text-[16px] font-normal text-[#f8f8f8]">
          {value || label}
        </span>
        <img src="/icons/creators/arrow_drop_down.svg" alt="" className="h-[24px] w-[24px]" />
      </button>
      {open && (
        <div className="absolute top-full left-0 z-50 mt-[4px] min-w-[160px] rounded-[8px] bg-[#252d32] py-[8px] shadow-lg">
          <button
            onClick={() => {
              onChange('');
              setOpen(false);
            }}
            className="block w-full px-[16px] py-[8px] text-left font-outfit text-[14px] text-[#999] hover:bg-[#333]"
          >
            All
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`block w-full px-[16px] py-[8px] text-left font-outfit text-[14px] hover:bg-[#333] ${
                value === opt ? 'text-[#01adf1]' : 'text-[#f8f8f8]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Format viewer count ─── */
function formatViewers(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(count % 1000 === 0 ? 0 : 2)}k`;
  }
  return String(count);
}

/* ─── Live Card Component ─── */
function LiveCard({ session }: { session: LiveCreatorCard }) {
  const categoryIcon = session.category
    ? CATEGORY_ICONS[session.category] || 'palette'
    : 'palette';

  return (
    <div className="flex h-[235px] w-full items-center rounded-[22px] bg-[#0e1012] px-[16px] py-[16px] sm:h-[278px] sm:w-[227px] sm:px-[23px] sm:py-[20px]">
      <div className="flex w-full flex-col items-start gap-[14px] sm:w-[180px] sm:gap-[22px]">
        {/* Live badge */}
        <span className="flex items-center gap-[4px] rounded-[3px] bg-[#e02a2a] px-[6px] py-[3px] sm:gap-[5px] sm:rounded-[4px] sm:px-[8px] sm:py-[4px]">
          <img src="/icons/creators/live_dot.svg" alt="" className="h-[3px] w-[3px] sm:h-[4px] sm:w-[4px]" />
          <span className="font-outfit text-[10px] font-normal text-[#f8f8f8] sm:text-[12px]">Live</span>
        </span>

        {/* Creator info */}
        <div className="flex items-center gap-[8px] sm:gap-[10px]">
          <div className="h-[34px] w-[34px] shrink-0 overflow-hidden rounded-full bg-[#333] sm:h-[40px] sm:w-[40px]">
            {session.avatar ? (
              <img
                src={session.avatar}
                alt={session.displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[14px] font-bold text-[#555] sm:text-[16px]">
                {session.displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="font-outfit leading-none text-[#f8f8f8]">
            <p className="text-[13px] sm:text-[16px]">{session.displayName}</p>
            <p className="mt-[2px] text-[10px] text-[#5d5d5d] sm:text-[12px]">@{session.username}</p>
          </div>
        </div>

        {/* Details */}
        <div className="flex w-full flex-col items-start gap-[8px] sm:gap-[10px]">
          {/* Category */}
          <div className="flex items-center gap-[8px] sm:gap-[10px]">
            <img
              src={`/icons/creators/${categoryIcon}.svg`}
              alt=""
              className="h-[15px] w-[15px] sm:h-[18px] sm:w-[18px]"
            />
            <span className="font-outfit text-[10px] font-normal text-[#f8f8f8] sm:text-[12px]">
              {session.category || 'Creator'}
            </span>
          </div>

          {/* Viewers */}
          <div className="flex items-center gap-[8px] sm:gap-[10px]">
            <img
              src="/icons/creators/visibility.svg"
              alt=""
              className="h-[15px] w-[15px] sm:h-[18px] sm:w-[18px]"
            />
            <span className="font-outfit text-[10px] font-normal text-[#f8f8f8] sm:text-[12px]">
              {formatViewers(session.viewerCount)} Viewers
            </span>
          </div>

          {/* Stream title */}
          <div className="flex w-full items-center gap-[8px] sm:gap-[10px]">
            <img
              src="/icons/creators/videocam.svg"
              alt=""
              className="h-[15px] w-[15px] shrink-0 sm:h-[18px] sm:w-[18px]"
            />
            <span className="line-clamp-1 font-outfit text-[10px] font-normal text-[#f8f8f8] sm:text-[12px]">
              {session.title}
            </span>
          </div>
        </div>

        {/* Join button */}
        <button className="rounded-[3px] bg-gradient-to-r from-[#01adf1] to-[#a61651] p-[8px] font-outfit text-[10px] font-normal text-[#f8f8f8] sm:rounded-[4px] sm:p-[10px] sm:text-[12px]">
          Join Live Session
        </button>
      </div>
    </div>
  );
}

/* ─── Live Card Skeleton ─── */
function LiveCardSkeleton() {
  return (
    <div className="flex h-[235px] w-full animate-pulse items-center rounded-[22px] bg-[#0e1012] px-[16px] py-[16px] sm:h-[278px] sm:w-[227px] sm:px-[23px] sm:py-[20px]">
      <div className="flex w-[180px] flex-col items-start gap-[22px]">
        <div className="h-[22px] w-[50px] rounded bg-[#333]" />
        <div className="flex items-center gap-[10px]">
          <div className="h-[40px] w-[40px] rounded-full bg-[#333]" />
          <div>
            <div className="h-[14px] w-[80px] rounded bg-[#333]" />
            <div className="mt-[4px] h-[10px] w-[60px] rounded bg-[#333]" />
          </div>
        </div>
        <div className="flex w-full flex-col gap-[10px]">
          <div className="h-[14px] w-[100px] rounded bg-[#333]" />
          <div className="h-[14px] w-[90px] rounded bg-[#333]" />
          <div className="h-[14px] w-full rounded bg-[#333]" />
        </div>
        <div className="h-[32px] w-[120px] rounded bg-[#333]" />
      </div>
    </div>
  );
}

/* ─── Format scheduled time ─── */
function formatScheduledTime(isoDate: string): string {
  const date = new Date(isoDate);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  const h = hours % 12 || 12;
  const m = minutes.toString().padStart(2, '0');
  return `${h}:${m} ${ampm}`;
}

/* ─── Main CreatorsLive Page ─── */
export default function CreatorsLive() {
  const [pendingFilters, setPendingFilters] = useState<LiveFilterParams>({});
  const [appliedFilters, setAppliedFilters] = useState<LiveFilterParams>({});

  const { data: filterOptions } = useCreatorFilters();
  const { data: sessions, isLoading, isError } = useLiveSessions(appliedFilters);
  const { data: upcoming } = useUpcomingLives();

  const handleApply = () => {
    setAppliedFilters({ ...pendingFilters });
  };

  const handleReset = () => {
    setPendingFilters({});
    setAppliedFilters({});
  };

  return (
    <div className="min-h-screen bg-[#15191c] font-outfit">
      {/* Nav */}
      <div className="relative h-[130px]">
        <MarketingNav />
      </div>

      {/* Hero */}
      <div className="flex flex-col items-center gap-[11px] px-[20px] pt-[20px] pb-[20px] text-[#f8f8f8] md:px-0 md:pb-[50px]">
        <h1 className="text-center text-[24px] font-normal md:text-[48px]">
          Creators Are Live Now!
        </h1>
        <p className="max-w-[270px] text-center text-[12px] font-normal md:max-w-none md:text-[16px]">
          Join private live sessions, interact in real-time, and support your favourite creators.
        </p>
      </div>

      {/* Main content: Sidebar + Grid */}
      <div className="flex flex-col items-center gap-[20px] px-[16px] md:px-[40px] lg:flex-row lg:items-start lg:justify-center lg:gap-[66px] lg:px-[86px]">
        {/* Mobile: compact filter bar */}
        <div className="flex w-full items-center gap-[16px] lg:hidden">
          <div className="flex flex-1 items-center gap-[16px] rounded-[8px] bg-[#252d32] px-[24px] py-[12px]">
            <img src="/icons/creators/filter_list.svg" alt="" className="h-[24px] w-[24px]" />
            <Dropdown
              label="Filters"
              value={pendingFilters.category || ''}
              options={filterOptions?.categories || []}
              onChange={(val) => setPendingFilters((f) => ({ ...f, category: val || undefined }))}
            />
          </div>
          <div className="flex items-center gap-[12px]">
            <button
              onClick={handleApply}
              className="rounded-[4px] bg-gradient-to-l from-[#a61651] to-[#01adf1] px-[14px] py-[10px] font-outfit text-[16px] font-normal text-[#f8f8f8]"
            >
              Apply
            </button>
            <button
              onClick={handleReset}
              className="rounded-[4px] border border-[#f8f8f8] px-[14px] py-[10px] font-outfit text-[16px] font-normal text-[#f8f8f8]"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Desktop: Sidebar Filters */}
        <div className="hidden lg:flex h-[596px] w-[281px] shrink-0 items-center rounded-[22px] bg-[#0e1012] px-[24px] py-[14px]">
          <div className="flex w-[161px] flex-col items-start gap-[70px]">
            <div className="flex w-[122px] flex-col items-start gap-[40px]">
              <div className="flex items-center gap-[10px] p-[10px]">
                <img src="/icons/creators/filter_list.svg" alt="" className="h-[24px] w-[24px]" />
                <span className="font-outfit text-[16px] font-normal text-[#f8f8f8]">
                  Filters:
                </span>
              </div>
              <div className="flex w-full flex-col items-start gap-[40px]">
                <Dropdown
                  label="Category"
                  value={pendingFilters.category || ''}
                  options={filterOptions?.categories || []}
                  onChange={(val) => setPendingFilters((f) => ({ ...f, category: val || undefined }))}
                />
                <Dropdown
                  label="Gender"
                  value={pendingFilters.gender || ''}
                  options={filterOptions?.genders || []}
                  onChange={(val) => setPendingFilters((f) => ({ ...f, gender: val || undefined }))}
                />
                <Dropdown
                  label="Region"
                  value={pendingFilters.region || ''}
                  options={filterOptions?.countries || []}
                  onChange={(val) => setPendingFilters((f) => ({ ...f, region: val || undefined }))}
                />
                <Dropdown
                  label="Sort By"
                  value={
                    pendingFilters.sortBy === 'viewers'
                      ? 'Most Viewers'
                      : pendingFilters.sortBy === 'newest'
                        ? 'Newest'
                        : ''
                  }
                  options={['Most Viewers', 'Newest']}
                  onChange={(val) =>
                    setPendingFilters((f) => ({
                      ...f,
                      sortBy: val === 'Most Viewers' ? 'viewers' : val === 'Newest' ? 'newest' : undefined,
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex w-full items-center gap-[21px]">
              <button
                onClick={handleApply}
                className="rounded-[4px] bg-gradient-to-l from-[#a61651] to-[#01adf1] px-[14px] py-[10px] font-outfit text-[16px] font-normal text-[#f8f8f8]"
              >
                Apply
              </button>
              <button
                onClick={handleReset}
                className="rounded-[4px] border border-[#f8f8f8] px-[14px] py-[10px] font-outfit text-[16px] font-normal text-[#f8f8f8]"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Live Cards Grid */}
        <div className="grid w-full grid-cols-2 gap-[16px] sm:gap-[20px] md:gap-[40px] lg:w-auto lg:grid-cols-3">
          {isError ? (
            <div className="col-span-3 py-[60px] text-center font-outfit text-[18px] text-[#999]">
              Something went wrong. Please try again.
            </div>
          ) : isLoading ? (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <LiveCardSkeleton key={i} />
              ))}
            </>
          ) : sessions && sessions.length > 0 ? (
            <>
              {sessions.map((session) => (
                <LiveCard key={session.id} session={session} />
              ))}
            </>
          ) : (
            <div className="col-span-3 py-[60px] text-center font-outfit text-[18px] text-[#999]">
              No live sessions right now. Check back soon!
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Lives Section */}
      <div className="mt-[30px] flex flex-col items-center gap-[5px] px-[20px] text-[#f8f8f8] md:mt-[60px] md:gap-[11px]">
        <h2 className="text-center text-[24px] font-normal md:text-[48px]">
          Upcoming Lives
        </h2>
        <p className="text-center text-[12px] font-normal md:text-[16px]">
          Don't miss out! Get notified when your favorite creators go live.
        </p>
      </div>

      {/* Upcoming Lives Table */}
      <div className="flex justify-center px-[16px] pt-[30px] pb-[60px] md:px-[40px] md:pt-[40px] md:pb-[80px] lg:px-[86px]">
        <div className="w-full max-w-[1108px] overflow-hidden rounded-[22px] bg-[#0e1012]">
          {/* Table Header */}
          <div className="relative px-[16px] pt-[16px] md:px-[60px] md:pt-[52px] lg:px-[161px]">
            <div className="flex items-center">
              <span className="flex-1 text-center font-outfit text-[12px] font-medium text-[#f8f8f8] md:text-[16px]">
                Creator
              </span>
              <span className="flex-1 text-center font-outfit text-[12px] font-medium text-[#f8f8f8] md:text-[16px]">
                Time
              </span>
              <span className="flex-1 text-center font-outfit text-[12px] font-medium text-[#f8f8f8] md:text-[16px]">
                Action
              </span>
            </div>
            <div className="mx-auto mt-[10px] h-px w-full bg-[#5d5d5d] md:mt-[14px]" />
          </div>

          {/* Table Rows */}
          <div className="px-[16px] pt-[12px] pb-[20px] md:px-[60px] md:pt-[20px] md:pb-[46px] lg:px-[161px]">
            {upcoming && upcoming.length > 0 ? (
              upcoming.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center py-[12px] md:py-[20px]"
                >
                  {/* Creator */}
                  <div className="flex flex-1 items-center justify-center gap-[8px] md:gap-[17px]">
                    <div className="h-[20px] w-[20px] shrink-0 overflow-hidden rounded-full bg-[#333] md:h-[38px] md:w-[38px]">
                      {item.avatar ? (
                        <img
                          src={item.avatar}
                          alt={item.username}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[8px] font-bold text-[#555] md:text-[14px]">
                          {item.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="font-outfit text-[12px] font-normal text-[#f8f8f8] md:text-[16px]">
                      @{item.username}
                    </span>
                  </div>

                  {/* Time */}
                  <div className="flex-1 text-center font-outfit text-[12px] font-normal text-[#f8f8f8] md:text-[16px]">
                    {formatScheduledTime(item.scheduledAt)}
                  </div>

                  {/* Action */}
                  <div className="flex flex-1 items-center justify-center">
                    <button className="flex items-center gap-[5px] rounded-[4px] border border-[#5d5d5d] p-[5px] md:gap-[10px] md:p-[10px]">
                      <img
                        src="/icons/creators/notification_add.svg"
                        alt=""
                        className="h-[10px] w-[10px] md:h-[20px] md:w-[20px]"
                      />
                      <span className="font-outfit text-[12px] font-normal text-[#f8f8f8] md:text-[16px]">
                        Notify me
                      </span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-[40px] text-center font-outfit text-[16px] text-[#999]">
                No upcoming lives scheduled.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
