import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import type { AIClip } from './AIClipsParts';

export function ClipThumbnail({
  thumbnailPath,
  duration,
}: {
  thumbnailPath: string | null;
  duration: number;
}) {
  const [imgError, setImgError] = useState(false);
  const showImg = thumbnailPath && !imgError;
  return (
    <div className="relative h-[140px] w-full bg-muted flex items-center justify-center">
      {showImg ? (
        <img
          src={thumbnailPath!}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-muted-foreground"
        >
          <polygon points="5,3 19,12 5,21" />
        </svg>
      )}
      <span className="absolute bottom-[6px] right-[6px] rounded-[4px] bg-black/70 px-[6px] py-[2px] text-[11px] text-white z-10">
        {duration}s
      </span>
    </div>
  );
}

export function PublishModal({ clip, onClose }: { clip: AIClip; onClose: () => void }) {
  const [caption, setCaption] = useState(clip.title);
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState('');
  const qc = useQueryClient();

  const mut = useMutation({
    mutationFn: () =>
      api.post(`/creator/clips/${clip.id}/publish`, {
        caption,
        isPaid,
        price: isPaid ? Number(price) : undefined,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ai-clip-jobs'] });
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-[440px] rounded-[16px] border border-border bg-card p-[24px]">
        <p className="text-[16px] font-semibold text-foreground mb-[16px]">Publish Clip</p>
        <div className="mb-[12px]">
          <label className="text-[12px] text-muted-foreground">Caption</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
            className="mt-[4px] w-full resize-none rounded-[8px] bg-muted px-[12px] py-[8px] text-[13px] text-foreground outline-none"
          />
        </div>
        <div className="mb-[12px] flex items-center gap-[10px]">
          <button
            type="button"
            onClick={() => setIsPaid(!isPaid)}
            className={`relative h-[22px] w-[40px] rounded-full transition-colors ${isPaid ? 'bg-[#01adf1]' : 'bg-muted'}`}
          >
            <span
              className={`absolute top-[3px] size-[16px] rounded-full bg-white transition-all ${isPaid ? 'left-[21px]' : 'left-[3px]'}`}
            />
          </button>
          <span className="text-[13px] text-foreground">Paid content</span>
        </div>
        {isPaid && (
          <div className="mb-[12px]">
            <label className="text-[12px] text-muted-foreground">Price ($)</label>
            <input
              type="number"
              min="0.99"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="mt-[4px] w-full rounded-[8px] bg-muted px-[12px] py-[8px] text-[13px] text-foreground outline-none"
            />
          </div>
        )}
        {mut.isError && <p className="text-[12px] text-red-400 mb-[8px]">Failed to publish</p>}
        <div className="flex gap-[8px]">
          <button
            onClick={onClose}
            className="flex-1 rounded-[8px] border border-border py-[10px] text-[13px] text-foreground"
          >
            Cancel
          </button>
          <button
            onClick={() => mut.mutate()}
            disabled={mut.isPending}
            className="flex-1 rounded-[8px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[10px] text-[13px] font-semibold text-white disabled:opacity-50"
          >
            {mut.isPending ? 'Publishing…' : 'Publish to Feed'}
          </button>
        </div>
      </div>
    </div>
  );
}
