import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import {
  ImageGallery,
  SellerInfo,
  ActionSection,
  BidHistory,
} from '../components/marketplace/ListingParts';
import ReviewSection from '../components/marketplace/ReviewSection';
import type { Listing } from '../components/marketplace/ListingParts';

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

        <ReviewSection listingId={listing.id} sellerId={listing.seller.id} />
      </div>
    </div>
  );
}
