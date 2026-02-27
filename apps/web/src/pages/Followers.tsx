import { useState, useEffect } from 'react';
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
      <p className="text-[20px] text-[#f8f8f8]">My Followers Modal</p>

      {loading ? (
        <div className="flex justify-center py-[60px]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
        </div>
      ) : creators.length === 0 ? (
        <p className="text-center text-[#5d5d5d] py-[60px] text-[16px]">
          You are not following anyone yet
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-[30px]">
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
    <div className="bg-[#0e1012] rounded-[12px] h-[92px] flex items-center justify-between px-[27px]">
      <div className="flex items-center gap-[29px]">
        <img
          src={avatarSrc}
          alt={creator.displayName}
          className="size-[58px] rounded-full object-cover shrink-0"
        />
        <div className="flex flex-col">
          <p className="text-[16px] text-[#f8f8f8] leading-[normal]">{creator.displayName}</p>
          <p className="text-[12px] text-[#5d5d5d] leading-[normal]">@{creator.username}</p>
        </div>
      </div>
      <button
        onClick={() => {
          setBusy(true);
          onUnfollow(creator.id);
        }}
        disabled={busy}
        className="px-[18px] py-[12px] rounded-[80px] text-[20px] font-medium text-[#f8f8f8] shadow-[0px_2px_18px_0px_rgba(34,34,34,0.25)] hover:opacity-90 transition-opacity disabled:opacity-50"
        style={{
          backgroundImage: 'linear-gradient(-90deg, rgb(166, 22, 81) 0%, rgb(1, 173, 241) 100%)',
        }}
      >
        Unfollow
      </button>
    </div>
  );
}
