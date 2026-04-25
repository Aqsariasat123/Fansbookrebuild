import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { getSocket } from '../../lib/socket';
import { ListingCard, AuctionStatusBar } from './AuctionListingCard';

interface Listing {
  id: string;
  title: string;
  price: number | null;
  images: string[];
}

interface ActiveAuction {
  id: string;
  listingId: string;
  startingBid: number;
  currentBid: number | null;
  endsAt: string;
  itemTitle: string;
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
  const [auctionItem, setAuctionItem] = useState<string | null>(null);
  const [startingBid, setStartingBid] = useState('1');
  const [duration, setDuration] = useState(60);
  const [activeAuction, setActiveAuction] = useState<ActiveAuction | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    api
      .get(`/live/${sessionId}/shop-listings`)
      .then(({ data }) => {
        if (data.success) setListings(data.data);
      })
      .catch(() => {});
  }, [sessionId]);

  useEffect(() => {
    if (!activeAuction) return;
    const endsAt = activeAuction.endsAt;
    const tick = setInterval(() => {
      setTimeLeft(Math.max(0, Math.round((new Date(endsAt).getTime() - Date.now()) / 1000)));
    }, 500);
    return () => clearInterval(tick);
  }, [activeAuction]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const onStarted = (d: {
      auction: { id: string; startingBid: number; currentBid: number | null; endsAt: string };
      item: { id: string; title: string };
    }) => {
      setActiveAuction({
        id: d.auction.id,
        listingId: d.item.id,
        startingBid: d.auction.startingBid,
        currentBid: d.auction.currentBid,
        endsAt: d.auction.endsAt,
        itemTitle: d.item.title,
      });
      setAuctionItem(null);
    };
    const onUpdate = (d: { auctionId: string; amount: number; endsAt: string }) => {
      setActiveAuction((prev) =>
        prev && prev.id === d.auctionId
          ? { ...prev, currentBid: d.amount, endsAt: d.endsAt }
          : prev,
      );
    };
    const onEnded = () => {
      setActiveAuction(null);
      setTimeLeft(0);
    };
    const onCancelled = () => {
      setActiveAuction(null);
      setTimeLeft(0);
    };
    socket.on('live:auction-started', onStarted);
    socket.on('live:auction-update', onUpdate);
    socket.on('live:auction-ended', onEnded);
    socket.on('live:auction-cancelled', onCancelled);
    return () => {
      socket.off('live:auction-started', onStarted);
      socket.off('live:auction-update', onUpdate);
      socket.off('live:auction-ended', onEnded);
      socket.off('live:auction-cancelled', onCancelled);
    };
  }, []);

  function handlePin(id: string) {
    setLoading(true);
    getSocket()?.emit('live:pin-item', { sessionId, itemId: id });
    onPinChange(id);
    setLoading(false);
  }
  function handleUnpin() {
    setLoading(true);
    getSocket()?.emit('live:unpin-item', { sessionId });
    onPinChange(null);
    setLoading(false);
  }
  function handleStartAuction(listingId: string) {
    const bid = parseFloat(startingBid);
    if (isNaN(bid) || bid < 1) return;
    getSocket()?.emit('live:auction-start', {
      sessionId,
      listingId,
      startingBid: bid,
      durationSec: duration,
    });
  }
  function handleCancelAuction() {
    if (!activeAuction) return;
    getSocket()?.emit('live:auction-cancel', { sessionId, auctionId: activeAuction.id });
  }

  const filtered = listings.filter((l) => l.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="rounded-[12px] border border-border bg-card p-[16px] flex flex-col gap-[12px]">
      <div className="flex items-center justify-between">
        <p className="text-[14px] font-semibold text-foreground">In-Stream Shopping</p>
        {pinnedItemId && !activeAuction && (
          <button
            onClick={handleUnpin}
            disabled={loading}
            className="text-[12px] text-red-400 hover:text-red-300"
          >
            Unpin
          </button>
        )}
      </div>

      {activeAuction && (
        <AuctionStatusBar
          itemTitle={activeAuction.itemTitle}
          timeLeft={timeLeft}
          currentBid={activeAuction.currentBid}
          startingBid={activeAuction.startingBid}
          onCancel={handleCancelAuction}
        />
      )}

      {!activeAuction && pinnedItemId && (
        <div className="rounded-[8px] bg-green-500/10 border border-green-500/30 px-[12px] py-[8px] text-[12px] text-green-400">
          Item pinned — viewers can purchase now.
        </div>
      )}

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search your listings…"
        className="rounded-[8px] border border-border bg-background px-[12px] py-[8px] text-[13px] text-foreground placeholder-muted-foreground outline-none"
      />

      <div className="flex flex-col gap-[8px] max-h-[300px] overflow-y-auto">
        {filtered.length === 0 && (
          <p className="text-[12px] text-muted-foreground text-center py-[16px]">
            No active listings found.
          </p>
        )}
        {filtered.map((l) => (
          <ListingCard
            key={l.id}
            l={l}
            isAuctionLive={!!activeAuction && activeAuction.listingId === l.id}
            isPinned={pinnedItemId === l.id}
            isSetup={auctionItem === l.id && !activeAuction}
            hasActiveAuction={!!activeAuction}
            startingBid={startingBid}
            duration={duration}
            loading={loading}
            onPin={() => handlePin(l.id)}
            onToggleAuction={() => setAuctionItem(auctionItem === l.id ? null : l.id)}
            onStartAuction={() => handleStartAuction(l.id)}
            onBidChange={setStartingBid}
            onDuration={setDuration}
          />
        ))}
      </div>
    </div>
  );
}
