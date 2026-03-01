import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import FollowButton from '../components/shared/FollowButton';

interface FollowUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  isVerified?: boolean;
  isFollowing?: boolean;
  followedAt: string;
}

type Tab = 'followers' | 'following';

export default function Followers() {
  const [tab, setTab] = useState<Tab>('following');
  const [users, setUsers] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const fetchUsers = useCallback(
    async (reset: boolean, currentTab: Tab, cursorVal: string | null) => {
      reset ? setLoading(true) : setLoadingMore(true);
      const endpoint = currentTab === 'followers' ? '/social/users/followers' : '/followers';
      const params = new URLSearchParams({ limit: '20' });
      if (cursorVal) params.set('cursor', cursorVal);
      try {
        const { data: r } = await api.get(`${endpoint}?${params}`);
        applyResults(r, reset);
      } catch {
        if (reset) setUsers([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  function applyResults(
    r: { data?: { items?: FollowUser[]; nextCursor?: string }; nextCursor?: string },
    reset: boolean,
  ) {
    const items: FollowUser[] = r.data?.items || (r.data as unknown as FollowUser[]) || [];
    const next = r.data?.nextCursor || r.nextCursor || null;
    reset ? setUsers(items) : setUsers((p) => [...p, ...items]);
    setCursor(next);
    setHasMore(!!next);
  }

  useEffect(() => {
    setCursor(null);
    setUsers([]);
    fetchUsers(true, tab, null);
  }, [tab, fetchUsers]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !loadingMore) fetchUsers(false, tab, cursor);
      },
      { rootMargin: '200px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loadingMore, fetchUsers, tab, cursor]);

  const handleUnfollow = async (userId: string) => {
    try {
      const { data: r } = await api.delete(`/followers/${userId}`);
      if (r.success) setUsers((p) => p.filter((c) => c.id !== userId));
    } catch {
      /* */
    }
  };

  return (
    <div className="flex flex-col gap-[20px]">
      <p className="text-[20px] font-medium text-foreground">
        {tab === 'followers' ? 'Followers' : 'Following'}
      </p>
      <div className="flex gap-[4px] rounded-[12px] bg-muted p-[4px]">
        {(['following', 'followers'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-[10px] py-[10px] text-[14px] font-medium transition-colors ${tab === t ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {t === 'following' ? 'Following' : 'Followers'}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="flex justify-center py-[60px]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
        </div>
      ) : users.length === 0 ? (
        <EmptyFollowers tab={tab} />
      ) : (
        <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2 md:gap-[30px]">
          {users.map((u) => (
            <UserRow key={u.id} user={u} tab={tab} onUnfollow={handleUnfollow} />
          ))}
        </div>
      )}
      <div ref={sentinelRef} className="h-[1px]" />
      {loadingMore && (
        <div className="flex justify-center py-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#01adf1] border-t-transparent" />
        </div>
      )}
    </div>
  );
}

function EmptyFollowers({ tab }: { tab: Tab }) {
  return (
    <div className="flex flex-col items-center gap-[8px] py-[60px]">
      <p className="text-[16px] text-muted-foreground">
        {tab === 'followers' ? 'No followers yet' : 'You are not following anyone yet'}
      </p>
      {tab === 'following' && (
        <Link to="/explore" className="text-[14px] text-primary hover:underline">
          Discover creators
        </Link>
      )}
    </div>
  );
}

function UserRow({
  user,
  tab,
  onUnfollow,
}: {
  user: FollowUser;
  tab: Tab;
  onUnfollow: (id: string) => void;
}) {
  return (
    <div className="flex h-[72px] items-center justify-between rounded-[12px] bg-card px-[16px] md:h-[92px] md:px-[27px]">
      <Link
        to={`/u/${user.username}`}
        className="flex min-w-0 items-center gap-[16px] md:gap-[29px]"
      >
        <div className="size-[48px] shrink-0 overflow-hidden rounded-full md:size-[58px]">
          {user.avatar ? (
            <img src={user.avatar} alt="" className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center bg-muted text-[18px] font-medium text-muted-foreground">
              {user.displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-[4px]">
            <p className="truncate text-[14px] leading-[normal] text-foreground md:text-[16px]">
              {user.displayName}
            </p>
            {user.isVerified && (
              <img src="/icons/dashboard/verified.svg" alt="" className="size-[14px]" />
            )}
          </div>
          <p className="text-[10px] leading-[normal] text-muted-foreground md:text-[12px]">
            @{user.username}
          </p>
        </div>
      </Link>
      {tab === 'following' ? (
        <button
          onClick={() => onUnfollow(user.id)}
          className="shrink-0 rounded-[80px] px-[14px] py-[8px] text-[14px] font-medium text-foreground shadow-[0px_2px_18px_0px_rgba(34,34,34,0.25)] transition-opacity hover:opacity-90 md:px-[18px] md:py-[12px] md:text-[20px]"
          style={{
            backgroundImage: 'linear-gradient(-90deg, rgb(166, 22, 81) 0%, rgb(1, 173, 241) 100%)',
          }}
        >
          Unfollow
        </button>
      ) : (
        <FollowButton userId={user.id} initialFollowing={user.isFollowing} size="md" />
      )}
    </div>
  );
}
