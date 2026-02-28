import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

interface FollowedCreator {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  followedAt: string;
}

export default function Followers() {
  const [creators, setCreators] = useState<FollowedCreator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/followers')
      .then(({ data: r }) => {
        if (r.success) setCreators(r.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUnfollow = async (creatorId: string) => {
    try {
      const { data: r } = await api.delete(`/followers/${creatorId}`);
      if (r.success) setCreators((prev) => prev.filter((c) => c.id !== creatorId));
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex flex-col gap-[20px]">
      <p className="text-[20px] text-foreground">My Followers Modal</p>

      {loading ? (
        <div className="flex justify-center py-[60px]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
        </div>
      ) : creators.length === 0 ? (
        <p className="text-center text-muted-foreground py-[60px] text-[16px]">
          You are not following anyone yet
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2 md:gap-[30px]">
          {creators.map((c) => (
            <FollowerCard key={c.id} creator={c} onUnfollow={handleUnfollow} />
          ))}
        </div>
      )}
    </div>
  );
}

function FollowerCard({
  creator,
  onUnfollow,
}: {
  creator: FollowedCreator;
  onUnfollow: (id: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const avatarSrc = creator.avatar || '/icons/dashboard/person.svg';

  return (
    <div className="flex h-[72px] items-center justify-between rounded-[12px] bg-card px-[16px] md:h-[92px] md:px-[27px]">
      <Link to={`/u/${creator.username}`} className="flex items-center gap-[16px] md:gap-[29px]">
        <img
          src={avatarSrc}
          alt={creator.displayName}
          className="size-[48px] shrink-0 rounded-full object-cover md:size-[58px]"
        />
        <div className="flex flex-col">
          <p className="text-[14px] leading-[normal] text-foreground md:text-[16px]">
            {creator.displayName}
          </p>
          <p className="text-[10px] leading-[normal] text-muted-foreground md:text-[12px]">
            @{creator.username}
          </p>
        </div>
      </Link>
      <button
        onClick={() => {
          setBusy(true);
          onUnfollow(creator.id);
        }}
        disabled={busy}
        className="rounded-[80px] px-[14px] py-[8px] text-[14px] font-medium text-foreground shadow-[0px_2px_18px_0px_rgba(34,34,34,0.25)] transition-opacity hover:opacity-90 disabled:opacity-50 md:px-[18px] md:py-[12px] md:text-[20px]"
        style={{
          backgroundImage: 'linear-gradient(-90deg, rgb(166, 22, 81) 0%, rgb(1, 173, 241) 100%)',
        }}
      >
        Unfollow
      </button>
    </div>
  );
}
