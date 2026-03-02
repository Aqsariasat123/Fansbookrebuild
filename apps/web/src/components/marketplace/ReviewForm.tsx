import { useState } from 'react';
import { api } from '../../lib/api';

interface Props {
  listingId: string;
  onSubmitted: () => void;
}

function StarSelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-[4px]">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`text-[24px] ${star <= value ? 'text-yellow-400' : 'text-[#5d5d5d]'}`}
        >
          &#9733;
        </button>
      ))}
    </div>
  );
}

export default function ReviewForm({ listingId, onSubmitted }: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) {
      setError('Please select a rating');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/marketplace-reviews', {
        listingId,
        rating,
        comment: comment.trim() || undefined,
      });
      onSubmitted();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to submit review';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-[16px] rounded-[12px] bg-muted p-[16px]">
      <p className="mb-[8px] text-[14px] font-medium text-foreground">Leave a Review</p>
      <StarSelector value={rating} onChange={setRating} />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a comment (optional)"
        rows={3}
        className="mt-[8px] w-full resize-none rounded-[8px] bg-background p-[10px] text-[13px] text-foreground outline-none placeholder:text-[#5d5d5d]"
      />
      {error && <p className="mt-[4px] text-[12px] text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading || rating < 1}
        className="mt-[8px] rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[20px] py-[8px] text-[13px] font-medium text-white disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
