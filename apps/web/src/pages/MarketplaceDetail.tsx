import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';

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

function ImageGallery({
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

function SellerInfo({ seller }: { seller: Seller }) {
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
      <div>
        <div className="flex items-center gap-[4px]">
          <span className="text-[14px] font-medium text-foreground">{seller.displayName}</span>
          {seller.isVerified && (
            <img src="/icons/dashboard/verified.svg" alt="" className="size-[14px]" />
          )}
        </div>
      </div>
    </Link>
  );
}

function ActionSection({
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

function BidHistory({ bids }: { bids: Bid[] }) {
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

function extractErrorMsg(err: unknown): string {
  return (
    (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed'
  );
}

export default function MarketplaceDetail() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/marketplace/${id}`)
      .then(({ data: r }) => setListing(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleBuy = async () => {
    setActionLoading(true);
    setMsg('');
    try {
      await api.post(`/marketplace/${id}/buy`);
      setMsg('Purchase complete!');
    } catch (err: unknown) {
      setMsg(extractErrorMsg(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleBid = async () => {
    if (!bidAmount) return;
    setActionLoading(true);
    setMsg('');
    try {
      await api.post(`/marketplace/${id}/bid`, { amount: parseFloat(bidAmount) });
      setMsg('Bid placed!');
      const res = await api.get(`/marketplace/${id}`);
      setListing(res.data.data);
      setBidAmount('');
    } catch (err: unknown) {
      setMsg(extractErrorMsg(err));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
      </div>
    );
  if (!listing) return <div className="py-20 text-center text-foreground">Listing not found</div>;

  return (
    <div className="mx-auto max-w-[700px]">
      <Link
        to="/marketplace"
        className="mb-4 inline-block text-[14px] text-muted-foreground hover:text-foreground"
      >
        &larr; Back to Marketplace
      </Link>

      <div className="rounded-[22px] bg-card p-[20px]">
        <ImageGallery images={listing.images} imgIdx={imgIdx} onSelect={setImgIdx} />

        <p className="text-[20px] font-semibold text-foreground">{listing.title}</p>
        <p className="mt-[4px] text-[24px] font-bold text-[#01adf1]">${listing.price.toFixed(2)}</p>
        <span className="mt-[4px] inline-block rounded-[50px] bg-muted px-[12px] py-[4px] text-[11px] text-muted-foreground">
          {listing.category.replace(/_/g, ' ')} &middot;{' '}
          {listing.type === 'AUCTION' ? 'Auction' : 'Fixed Price'}
        </span>

        {listing.description && (
          <p className="mt-[12px] whitespace-pre-wrap text-[14px] text-muted-foreground">
            {listing.description}
          </p>
        )}

        <SellerInfo seller={listing.seller} />

        <ActionSection
          listing={listing}
          actionLoading={actionLoading}
          bidAmount={bidAmount}
          onBuy={handleBuy}
          onBid={handleBid}
          onBidAmountChange={setBidAmount}
        />

        {msg && <p className="mt-[12px] text-center text-[13px] text-[#01adf1]">{msg}</p>}

        <BidHistory bids={listing.bids} />
      </div>
    </div>
  );
}
