import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface Highlight {
  id: string;
  name: string;
  coverUrl: string | null;
  storyIds: string[];
}

interface Props {
  userId: string;
}

export function StoryHighlights({ userId }: Props) {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [viewingIdx, setViewingIdx] = useState<number | null>(null);

  useEffect(() => {
    api
      .get(`/story-highlights/${userId}`)
      .then((res) => setHighlights(res.data.data || []))
      .catch(() => {});
  }, [userId]);

  if (highlights.length === 0) return null;

  return (
    <>
      <div className="flex gap-4 overflow-x-auto px-4 py-3 scrollbar-hide">
        {highlights.map((h, idx) => (
          <button
            key={h.id}
            onClick={() => setViewingIdx(idx)}
            className="flex shrink-0 flex-col items-center gap-1.5"
          >
            <div className="flex size-16 items-center justify-center rounded-full border-2 border-white/20 bg-[#1a1e22] overflow-hidden">
              {h.coverUrl ? (
                <img
                  src={h.coverUrl}
                  alt={h.name}
                  className="size-full rounded-full object-cover"
                />
              ) : (
                <span className="text-xl font-semibold text-white/70">
                  {h.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <span className="max-w-[72px] truncate text-xs text-white/60">{h.name}</span>
          </button>
        ))}
      </div>

      {viewingIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="relative flex flex-col items-center gap-4 rounded-xl bg-[#1a1e22] p-6 text-white">
            <h3 className="text-lg font-semibold">{highlights[viewingIdx].name}</h3>
            <p className="text-sm text-white/50">
              {highlights[viewingIdx].storyIds.length} stories in this highlight
            </p>
            <button
              onClick={() => setViewingIdx(null)}
              className="rounded-full bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
