import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

type Creator = {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  category: string | null;
};

export default function StepSuggested({ interests }: { interests: string[] }) {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [followed, setFollowed] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const category = interests[0] || '';
    api
      .get('/creators', { params: { limit: 8, category } })
      .then((res) => setCreators(res.data.data?.items || []))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [interests]);

  const toggleFollow = async (id: string) => {
    try {
      if (followed.has(id)) {
        await api.delete(`/followers/${id}`);
        setFollowed((p) => {
          const n = new Set(p);
          n.delete(id);
          return n;
        });
      } else {
        await api.post(`/followers/${id}`);
        setFollowed((p) => new Set(p).add(id));
      }
    } catch {
      /* ignore */
    }
  };

  if (!loaded) {
    return (
      <div className="flex flex-col gap-[12px]">
        <p className="text-[16px] font-medium text-foreground">Suggested Creators</p>
        <div className="py-[40px] flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#01adf1] border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[12px]">
      <p className="text-[16px] font-medium text-foreground">Suggested Creators</p>
      <p className="text-[13px] text-muted-foreground">Follow creators that interest you.</p>
      {creators.length === 0 ? (
        <p className="py-[40px] text-center text-[14px] text-muted-foreground">
          No suggested creators yet. Complete onboarding to discover them later!
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-[12px]">
          {creators.map((c) => (
            <div
              key={c.id}
              className="flex flex-col items-center gap-[8px] rounded-[12px] bg-muted p-[12px]"
            >
              <div className="size-[48px] overflow-hidden rounded-full bg-background">
                {c.avatar ? (
                  <img src={c.avatar} alt="" className="size-full object-cover" />
                ) : (
                  <div className="flex size-full items-center justify-center text-[20px] text-muted-foreground">
                    {c.displayName[0]}
                  </div>
                )}
              </div>
              <p className="text-[13px] font-medium text-foreground truncate max-w-full">
                {c.displayName}
              </p>
              <p className="text-[11px] text-muted-foreground">@{c.username}</p>
              <button
                onClick={() => toggleFollow(c.id)}
                className={`w-full rounded-[50px] py-[6px] text-[12px] font-medium transition-colors ${
                  followed.has(c.id)
                    ? 'bg-muted-foreground/20 text-foreground'
                    : 'bg-gradient-to-r from-[#01adf1] to-[#a61651] text-white'
                }`}
              >
                {followed.has(c.id) ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
