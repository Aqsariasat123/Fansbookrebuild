import { Link } from 'react-router-dom';

interface Seller {
  id: string;
  displayName: string;
  username: string;
  avatar: string | null;
  isVerified: boolean;
}
interface Bid {
  id: string;
  amount: number;
  createdAt: string;
  bidder: Seller;
}
interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'FIXED_PRICE' | 'AUCTION';
  category: string;
  images: string[];
  status: string;
  endsAt: string | null;
  seller: Seller;
  bids: Bid[];
}

export type { Seller, Bid, Listing };

export function ImageGallery({
  images,
  imgIdx,
  onSelect,
}: {
  images: string[];
  imgIdx: number;
  onSelect: (i: number) => void;
}) {
  if (images.length === 0) return null;
  return (
    <div className="mb-[16px]">
      <div className="aspect-[16/10] overflow-hidden rounded-[16px]">
        <img src={images[imgIdx]} alt="" className="size-full object-cover" />
      </div>
      {images.length > 1 && (
        <div className="mt-[8px] flex gap-[8px] overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={`size-[60px] shrink-0 overflow-hidden rounded-[8px] ${i === imgIdx ? 'ring-2 ring-[#01adf1]' : 'opacity-60'}`}
            >
              <img src={img} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function SellerInfo({ seller }: { seller: Seller }) {
  return (
    <Link to={`/u/${seller.username}`} className="mt-[16px] flex items-center gap-[10px]">
      <div className="size-[36px] overflow-hidden rounded-full">
        {seller.avatar ? (
          <img src={seller.avatar} alt="" className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-[#01adf1] to-[#a61651] text-[12px] text-white">
            {seller.displayName[0]}
          </div>
        )}
      </div>
      <div className="flex items-center gap-[4px]">
        <span className="text-[14px] font-medium text-foreground">{seller.displayName}</span>
        {seller.isVerified && (
          <img src="/icons/dashboard/verified.svg" alt="" className="size-[14px]" />
        )}
      </div>
    </Link>
  );
}

export function ActionSection({
  listing,
  actionLoading,
  bidAmount,
  onBuy,
  onBid,
  onBidAmountChange,
}: {
  listing: Listing;
  actionLoading: boolean;
  bidAmount: string;
  onBuy: () => void;
  onBid: () => void;
  onBidAmountChange: (v: string) => void;
}) {
  if (listing.status !== 'ACTIVE') return null;
  return (
    <div className="mt-[20px]">
      {listing.type === 'FIXED_PRICE' ? (
        <button
          onClick={onBuy}
          disabled={actionLoading}
          className="w-full rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[12px] text-[16px] font-medium text-white disabled:opacity-50"
        >
          {actionLoading ? 'Processing...' : `Buy Now — $${listing.price.toFixed(2)}`}
        </button>
      ) : (
        <div className="flex gap-[8px]">
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => onBidAmountChange(e.target.value)}
            placeholder="Bid amount"
            className="flex-1 rounded-[50px] bg-muted px-[16px] py-[10px] text-[14px] text-foreground outline-none"
          />
          <button
            onClick={onBid}
            disabled={actionLoading || !bidAmount}
            className="rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[24px] py-[10px] text-[14px] font-medium text-white disabled:opacity-50"
          >
            {actionLoading ? '...' : 'Place Bid'}
          </button>
        </div>
      )}
    </div>
  );
}

export function BidHistory({ bids }: { bids: Bid[] }) {
  if (bids.length === 0) return null;
  return (
    <div className="mt-[20px]">
      <p className="text-[14px] font-medium text-foreground">Bid History</p>
      <div className="mt-[8px] flex flex-col gap-[8px]">
        {bids.map((b) => (
          <div
            key={b.id}
            className="flex items-center justify-between rounded-[8px] bg-muted px-[12px] py-[8px]"
          >
            <span className="text-[13px] text-foreground">{b.bidder.displayName}</span>
            <span className="text-[13px] font-medium text-[#01adf1]">${b.amount.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
