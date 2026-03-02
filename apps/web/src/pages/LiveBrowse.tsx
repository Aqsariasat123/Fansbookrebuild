import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LiveCreatorCard, UpcomingLive } from '@fansbook/shared';
import { useLiveSessions, useFollowingLive, useUpcomingLives } from '../hooks/useLive';
import { LiveCard, LiveCardSkeleton } from '../components/creators-live/LiveCard';

type Tab = 'for-you' | 'following' | 'upcoming';

export default function LiveBrowse() {
  const [tab, setTab] = useState<Tab>('for-you');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const filters = debouncedSearch ? { q: debouncedSearch } : undefined;
  const { data: forYou, isLoading: loadingForYou } = useLiveSessions(filters);
  const { data: following, isLoading: loadingFollowing } = useFollowingLive();
  const { data: upcoming, isLoading: loadingUpcoming } = useUpcomingLives();

  const tabs: { key: Tab; label: string }[] = [
    { key: 'for-you', label: 'For You' },
    { key: 'following', label: 'Following' },
    { key: 'upcoming', label: 'Upcoming' },
  ];

  return (
    <div className="space-y-[20px]">
      {/* Search bar */}
      <div className="relative">
        <img
          src="/icons/dashboard/search.svg"
          alt=""
          className="absolute left-[16px] top-1/2 h-[18px] w-[18px] -translate-y-1/2 opacity-50"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search live creators..."
          className="h-[48px] w-full rounded-[52px] bg-[#15191c] pl-[44px] pr-[16px] font-outfit text-[14px] text-foreground placeholder:text-[#5d5d5d] focus:outline-none focus:ring-1 focus:ring-[#01adf1]"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-[8px]">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-[20px] px-[16px] py-[8px] font-outfit text-[13px] transition-colors ${
              tab === t.key
                ? 'bg-gradient-to-r from-[#01adf1] to-[#a61651] text-white'
                : 'bg-[#15191c] text-[#5d5d5d] hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'for-you' && <ForYouTab sessions={forYou} isLoading={loadingForYou} />}
      {tab === 'following' && <FollowingTab sessions={following} isLoading={loadingFollowing} />}
      {tab === 'upcoming' && <UpcomingTab sessions={upcoming} isLoading={loadingUpcoming} />}
    </div>
  );
}

function ForYouTab({ sessions, isLoading }: { sessions?: LiveCreatorCard[]; isLoading: boolean }) {
  if (isLoading) return <SkeletonGrid />;
  if (!sessions?.length) return <EmptyState message="No one is live right now" />;
  return (
    <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sessions.map((s) => (
        <LiveCard key={s.id} session={s} />
      ))}
    </div>
  );
}

function FollowingTab({
  sessions,
  isLoading,
}: {
  sessions?: LiveCreatorCard[];
  isLoading: boolean;
}) {
  if (isLoading) return <SkeletonGrid />;
  if (!sessions?.length) return <EmptyState message="No followed creators are live right now" />;
  return (
    <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sessions.map((s) => (
        <LiveCard key={s.id} session={s} />
      ))}
    </div>
  );
}

function UpcomingTab({ sessions, isLoading }: { sessions?: UpcomingLive[]; isLoading: boolean }) {
  const navigate = useNavigate();

  if (isLoading) return <SkeletonGrid />;
  if (!sessions?.length) return <EmptyState message="No upcoming live sessions scheduled" />;

  return (
    <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sessions.map((s) => (
        <div
          key={s.id}
          className="flex h-[200px] w-full flex-col justify-between rounded-[22px] bg-card px-[20px] py-[16px]"
        >
          <div className="flex items-center gap-[10px]">
            <div className="h-[40px] w-[40px] shrink-0 overflow-hidden rounded-full bg-muted">
              {s.avatar ? (
                <img src={s.avatar} alt={s.username} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[16px] font-bold text-muted-foreground">
                  {s.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="font-outfit text-foreground">
              <p className="text-[14px]">@{s.username}</p>
            </div>
          </div>
          <p className="line-clamp-2 font-outfit text-[13px] text-foreground">{s.title}</p>
          <div className="flex items-center justify-between">
            <span className="font-outfit text-[11px] text-[#5d5d5d]">
              {new Date(s.scheduledAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <button
              onClick={() => navigate(`/u/${s.username}`)}
              className="rounded-[4px] bg-[#15191c] px-[10px] py-[6px] font-outfit text-[11px] text-foreground hover:bg-[#1e2328]"
            >
              View Profile
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <LiveCardSkeleton key={i} />
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-[200px] items-center justify-center rounded-[22px] bg-card">
      <p className="font-outfit text-[14px] text-[#5d5d5d]">{message}</p>
    </div>
  );
}
