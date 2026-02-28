import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

interface FollowUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  isVerified?: boolean;
  followedAt: string;
}

export default function Following() {
  const [users, setUsers] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const load = (p: number) => {
    api
      .get(`/social/users/following?page=${p}&limit=20`)
      .then((res) => {
        const items = res.data.data?.items || res.data.data || [];
        if (p === 1) setUsers(items);
        else setUsers((prev) => [...prev, ...items]);
        setHasMore(items.length === 20);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(1);
  }, []);

  const handleUnfollow = async (id: string) => {
    try {
      await api.delete(`/followers/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      /* ignore */
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-foreground border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[16px]">
      <p className="text-[20px] text-foreground">Following</p>

      {users.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-[22px] bg-card py-16">
          <p className="text-[16px] text-muted-foreground">Not following anyone yet</p>
          <Link to="/explore" className="text-[14px] text-primary hover:underline">
            Discover Creators
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-[10px]">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex items-center gap-[12px] rounded-[16px] bg-card p-[14px]"
            >
              <Link to={`/u/${u.username}`} className="shrink-0">
                <div className="size-[48px] overflow-hidden rounded-full">
                  {u.avatar ? (
                    <img src={u.avatar} alt="" className="size-full object-cover" />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-gradient-to-br from-[#01adf1] to-[#a61651] text-[16px] text-white">
                      {u.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </Link>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <Link
                    to={`/u/${u.username}`}
                    className="text-[14px] text-foreground hover:underline"
                  >
                    {u.displayName}
                  </Link>
                  {u.isVerified && (
                    <img src="/icons/dashboard/verified.svg" alt="" className="size-[14px]" />
                  )}
                </div>
                <p className="text-[12px] text-muted-foreground">@{u.username}</p>
              </div>
              <button
                onClick={() => handleUnfollow(u.id)}
                className="rounded-[50px] bg-muted px-4 py-[6px] text-[12px] text-muted-foreground hover:text-foreground"
              >
                Unfollow
              </button>
            </div>
          ))}
          {hasMore && (
            <button
              onClick={() => {
                setPage((p) => p + 1);
                load(page + 1);
              }}
              className="mx-auto rounded-[50px] bg-muted px-6 py-2 text-[14px] text-muted-foreground hover:text-foreground"
            >
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
}
