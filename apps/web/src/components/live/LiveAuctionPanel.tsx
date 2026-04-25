import { useEffect, useState } from 'react';
import { getSocket } from '../../lib/socket';
import { useAuctionSocket, type AuctionState, type AuctionItem } from './useAuctionSocket';

function fmt(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function AuctionTimer({ timeLeft }: { timeLeft: number }) {
  const cls = timeLeft <= 10 ? 'bg-red-500/20 text-red-400' : 'bg-foreground/10 text-foreground';
  return (
    <div
      className={`min-w-[48px] rounded-[6px] px-[8px] py-[4px] text-center text-[14px] font-bold ${cls}`}
    >
      {fmt(timeLeft)}
    </div>
  );
}

function BidInput({
  minBid,
  sessionId,
  auctionId,
}: {
  minBid: number;
  sessionId: string;
  auctionId: string;
}) {
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const onErr = (d: { message: string }) => setError(d.message);
    socket.on('live:auction-bid-error', onErr);
    return () => {
      socket.off('live:auction-bid-error', onErr);
    };
  }, []);

  function handleBid() {
    const amount = parseInt(bidAmount, 10);
    if (isNaN(amount) || amount < minBid) return;
    setError('');
    getSocket()?.emit('live:auction-bid', { sessionId, auctionId, amount });
    setBidAmount('');
  }

  return (
    <div className="flex flex-col gap-[6px]">
      <div className="flex gap-[8px]">
        <input
          type="number"
          min={minBid}
          value={bidAmount}
          onChange={(e) => {
            setBidAmount(e.target.value);
            setError('');
          }}
          placeholder={`Min ${minBid} coins`}
          className="flex-1 rounded-[8px] border border-border bg-background px-[10px] py-[6px] text-[13px] text-foreground placeholder-muted-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          onClick={handleBid}
          disabled={!bidAmount || parseInt(bidAmount, 10) < minBid}
          className="rounded-[8px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[14px] py-[6px] text-[13px] font-medium text-white disabled:opacity-40"
        >
          Bid
        </button>
      </div>
      {error && (
        <p className="rounded-[6px] bg-red-500/10 border border-red-500/20 px-[10px] py-[6px] text-[12px] text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

function ItemImage({ item }: { item: AuctionItem | null }) {
  if (!item || !item.image) return null;
  return (
    <img
      src={item.image}
      alt={item.title}
      className="h-[44px] w-[44px] rounded-[8px] object-cover shrink-0"
    />
  );
}

function AuctionDisplay({
  auction,
  item,
  timeLeft,
  userId,
  sessionId,
}: {
  auction: AuctionState;
  item: AuctionItem | null;
  timeLeft: number;
  userId?: string;
  sessionId: string;
}) {
  const minBid = (auction.currentBid ?? auction.startingBid - 1) + 1;
  const bidLabel = auction.currentBid ? 'Current bid' : 'Starting bid';
  const bidAmt = auction.currentBid ?? auction.startingBid;
  return (
    <>
      <div className="flex items-center gap-[10px]">
        <ItemImage item={item} />
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold text-foreground truncate">
            {item ? item.title : ''}
          </p>
          <p className="text-[11px] text-muted-foreground">Live Auction</p>
        </div>
        <AuctionTimer timeLeft={timeLeft} />
      </div>
      <div className="flex items-center justify-between rounded-[8px] bg-foreground/5 px-[12px] py-[8px]">
        <span className="text-[12px] text-muted-foreground">{bidLabel}</span>
        <span className="text-[14px] font-bold text-foreground">{bidAmt} coins</span>
      </div>
      {userId && <BidInput minBid={minBid} sessionId={sessionId} auctionId={auction.id} />}
    </>
  );
}

export function LiveAuctionPanel({ sessionId, userId }: { sessionId: string; userId?: string }) {
  const { auction, item, timeLeft, endMsg } = useAuctionSocket(sessionId);
  if (!auction && !endMsg) return null;
  if (endMsg)
    return (
      <div className="rounded-[12px] border border-[#a61651]/40 bg-card p-[14px]">
        <p className="text-center text-[14px] font-semibold text-foreground">{endMsg}</p>
      </div>
    );
  if (!auction) return null;
  return (
    <div className="rounded-[12px] border border-[#a61651]/40 bg-card p-[14px] flex flex-col gap-[10px]">
      <AuctionDisplay
        auction={auction}
        item={item}
        timeLeft={timeLeft}
        userId={userId}
        sessionId={sessionId}
      />
    </div>
  );
}
