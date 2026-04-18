import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { getSocket } from '../../lib/socket';
import { formatMoney } from '../../lib/currency';

interface Listing {
  id: string;
  title: string;
  price: number | null;
  images: string[];
}

interface Props {
  sessionId: string;
  pinnedItemId: string | null;
  onPinChange: (id: string | null) => void;
}

export function InStreamShopPanel({ sessionId, pinnedItemId, onPinChange }: Props) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get(`/live/${sessionId}/shop-listings`)
      .then(({ data }) => {
        if (data.success) setListings(data.data);
      })
      .catch(() => {});
  }, [sessionId]);

  function handlePin(id: string) {
    setLoading(true);
    const socket = getSocket();
    socket?.emit('live:pin-item', { sessionId, itemId: id });
    onPinChange(id);
    setLoading(false);
  }

  function handleUnpin() {
    setLoading(true);
    const socket = getSocket();
    socket?.emit('live:unpin-item', { sessionId });
    onPinChange(null);
    setLoading(false);
  }

  const filtered = listings.filter((l) => l.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="rounded-[12px] border border-border bg-card p-[16px] flex flex-col gap-[12px]">
      <div className="flex items-center justify-between">
        <p className="text-[14px] font-semibold text-foreground">In-Stream Shopping</p>
        {pinnedItemId && (
          <button
            onClick={handleUnpin}
            disabled={loading}
            className="text-[12px] text-red-400 hover:text-red-300"
          >
            Unpin Item
          </button>
        )}
      </div>

      {pinnedItemId && (
        <div className="rounded-[8px] bg-green-500/10 border border-green-500/30 px-[12px] py-[8px] text-[12px] text-green-400">
          Item pinned — viewers can see it and purchase now.
        </div>
      )}

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search your listings…"
        className="rounded-[8px] border border-border bg-background px-[12px] py-[8px] text-[13px] text-foreground placeholder-muted-foreground outline-none"
      />

      <div className="flex flex-col gap-[8px] max-h-[240px] overflow-y-auto">
        {filtered.length === 0 && (
          <p className="text-[12px] text-muted-foreground text-center py-[16px]">
            No active listings found.
          </p>
        )}
        {filtered.map((l) => (
          <div
            key={l.id}
            className={`flex items-center gap-[10px] rounded-[8px] border p-[10px] ${
              pinnedItemId === l.id
                ? 'border-green-500/50 bg-green-500/10'
                : 'border-border bg-background'
            }`}
          >
            {l.images[0] ? (
              <img
                src={l.images[0]}
                alt={l.title}
                className="h-[40px] w-[40px] rounded-[6px] object-cover shrink-0"
              />
            ) : (
              <div className="h-[40px] w-[40px] rounded-[6px] bg-muted shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-foreground truncate">{l.title}</p>
              <p className="text-[11px] text-muted-foreground">{formatMoney(l.price ?? 0)}</p>
            </div>
            {pinnedItemId === l.id ? (
              <span className="text-[11px] text-green-400 font-medium">Pinned</span>
            ) : (
              <button
                onClick={() => handlePin(l.id)}
                disabled={loading}
                className="rounded-[6px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[10px] py-[4px] text-[11px] font-medium text-white disabled:opacity-50"
              >
                Pin
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
