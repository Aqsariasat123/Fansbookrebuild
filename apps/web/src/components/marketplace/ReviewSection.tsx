import { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import ReviewForm from './ReviewForm';

interface ReviewBuyer {
  id: string;
  displayName: string;
  username: string;
  avatar: string | null;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  buyer: ReviewBuyer;
}

interface Props {
  listingId: string;
  sellerId: string;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-[14px] text-yellow-400">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= rating ? '' : 'opacity-30'}>
          &#9733;
        </span>
      ))}
    </span>
  );
}

export default function ReviewSection({ listingId, sellerId }: Props) {
  const user = useAuthStore((s) => s.user);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    try {
      const { data: res } = await api.get(`/marketplace-reviews/${listingId}`);
      setReviews(res.data.reviews);
      setAvgRating(res.data.avgRating);
      setTotalReviews(res.data.totalReviews);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [listingId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const alreadyReviewed = reviews.some((r) => r.buyer.id === user?.id);
  const canReview = user && user.id !== sellerId && !alreadyReviewed;

  if (loading) return null;

  return (
    <div className="mt-[20px]">
      <div className="flex items-center gap-[8px]">
        <p className="text-[16px] font-semibold text-foreground">Reviews</p>
        {totalReviews > 0 && (
          <span className="text-[14px] text-muted-foreground">
            <Stars rating={Math.round(avgRating)} /> {avgRating} ({totalReviews})
          </span>
        )}
      </div>

      {canReview && <ReviewForm listingId={listingId} onSubmitted={fetchReviews} />}

      {reviews.length === 0 && (
        <p className="mt-[8px] text-[13px] text-muted-foreground">No reviews yet.</p>
      )}

      <div className="mt-[12px] flex flex-col gap-[12px]">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-[12px] bg-muted px-[14px] py-[10px]">
            <div className="flex items-center gap-[8px]">
              <div className="size-[28px] overflow-hidden rounded-full">
                {r.buyer.avatar ? (
                  <img src={r.buyer.avatar} alt="" className="size-full object-cover" />
                ) : (
                  <div className="flex size-full items-center justify-center bg-gradient-to-br from-[#01adf1] to-[#a61651] text-[10px] text-white">
                    {r.buyer.displayName[0]}
                  </div>
                )}
              </div>
              <span className="text-[13px] font-medium text-foreground">{r.buyer.displayName}</span>
              <Stars rating={r.rating} />
              <span className="ml-auto text-[11px] text-muted-foreground">
                {new Date(r.createdAt).toLocaleDateString()}
              </span>
            </div>
            {r.comment && <p className="mt-[6px] text-[13px] text-muted-foreground">{r.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
