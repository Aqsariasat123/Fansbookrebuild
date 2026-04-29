import { formatMoney } from '../../lib/currency';

export const DURATIONS = [30, 60, 90, 120];

export function fmtTime(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

export interface CardProps {
  l: { id: string; title: string; price: number | null; images: string[] };
  isAuctionLive: boolean;
  isPinned: boolean;
  isSetup: boolean;
  hasActiveAuction: boolean;
  startingBid: string;
  duration: number;
  loading: boolean;
  onPin: () => void;
  onToggleAuction: () => void;
  onStartAuction: () => void;
  onBidChange: (v: string) => void;
  onDuration: (d: number) => void;
}

export function ListingCard({
  l,
  isAuctionLive,
  isPinned,
  isSetup,
  hasActiveAuction,
  startingBid,
  duration,
  loading,
  onPin,
  onToggleAuction,
  onStartAuction,
  onBidChange,
  onDuration,
}: CardProps) {
  const borderCls =
    isAuctionLive || isPinned
      ? 'border-green-500/50 bg-green-500/10'
      : 'border-border bg-background';
  return (
    <div className={`flex flex-col gap-[10px] rounded-[8px] border p-[12px] ${borderCls}`}>
      <div className="flex items-center gap-[12px]">
        {l.images[0] ? (
          <img
            src={l.images[0]}
            alt={l.title}
            className="h-[52px] w-[52px] rounded-[6px] object-cover shrink-0"
          />
        ) : (
          <div className="h-[52px] w-[52px] rounded-[6px] bg-muted shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-medium text-foreground truncate">{l.title}</p>
          <p className="text-[13px] text-muted-foreground">{formatMoney(l.price ?? 0)}</p>
        </div>
        {isAuctionLive ? (
          <span className="text-[13px] text-[#a61651] font-medium shrink-0">Auction Live</span>
        ) : isPinned ? (
          <span className="text-[13px] text-green-400 font-medium shrink-0">Pinned</span>
        ) : (
          <div className="flex gap-[6px] shrink-0">
            <button
              onClick={onPin}
              disabled={loading || hasActiveAuction}
              className="rounded-[6px] border border-border px-[12px] py-[6px] text-[13px] text-foreground hover:border-foreground disabled:opacity-40"
            >
              Pin
            </button>
            <button
              onClick={onToggleAuction}
              disabled={hasActiveAuction}
              className="rounded-[6px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[12px] py-[6px] text-[13px] font-medium text-white disabled:opacity-40"
            >
              Auction
            </button>
          </div>
        )}
      </div>
      {isSetup && (
        <div className="border-t border-border pt-[10px] flex flex-col gap-[10px]">
          <div className="flex items-center gap-[10px]">
            <label className="text-[13px] text-muted-foreground whitespace-nowrap">
              Starting bid
            </label>
            <input
              type="number"
              min="1"
              value={startingBid}
              onChange={(e) => onBidChange(e.target.value)}
              className="w-[90px] rounded-[6px] border border-border bg-background px-[10px] py-[6px] text-[13px] text-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="text-[13px] text-muted-foreground">coins</span>
          </div>
          <div className="flex items-center gap-[8px]">
            <span className="text-[13px] text-muted-foreground whitespace-nowrap">Duration</span>
            {DURATIONS.map((d) => (
              <button
                key={d}
                onClick={() => onDuration(d)}
                className={`rounded-[6px] px-[10px] py-[5px] text-[12px] font-medium transition-colors ${duration === d ? 'bg-gradient-to-r from-[#01adf1] to-[#a61651] text-white' : 'border border-border text-foreground hover:border-foreground'}`}
              >
                {d}s
              </button>
            ))}
          </div>
          <button
            onClick={onStartAuction}
            className="rounded-[6px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[8px] text-[14px] font-medium text-white"
          >
            Start Auction
          </button>
        </div>
      )}
    </div>
  );
}

export function AuctionStatusBar({
  itemTitle,
  timeLeft,
  currentBid,
  startingBid,
  onCancel,
}: {
  itemTitle: string;
  timeLeft: number;
  currentBid: number | null;
  startingBid: number;
  onCancel: () => void;
}) {
  const timeCls = timeLeft <= 10 ? 'text-red-400' : 'text-foreground';
  const bidText = currentBid
    ? `Current bid: ${currentBid} coins`
    : `Starting bid: ${startingBid} coins`;
  return (
    <div className="rounded-[8px] border border-[#a61651]/40 bg-[#a61651]/5 p-[14px] flex flex-col gap-[10px]">
      <div className="flex items-center justify-between">
        <p className="text-[14px] font-semibold text-foreground">🔴 Live Auction: {itemTitle}</p>
        <span className={`text-[16px] font-bold ${timeCls}`}>{fmtTime(timeLeft)}</span>
      </div>
      <p className="text-[13px] text-muted-foreground">{bidText}</p>
      <button onClick={onCancel} className="text-[13px] text-red-400 hover:text-red-300 text-left">
        Cancel auction
      </button>
    </div>
  );
}
