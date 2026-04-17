import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

type PurchaseStatus = 'HELD' | 'DELIVERED' | 'CONFIRMED' | 'DISPUTED' | 'RELEASED' | 'REFUNDED';

interface Purchase {
  id: string;
  amount: number;
  status: PurchaseStatus;
  createdAt: string;
  deliveredAt: string | null;
  disputeReason: string | null;
  listing: { id: string; title: string; images: string[] };
  seller: { id: string; username: string; displayName: string; avatar: string | null };
}

const STATUS_CONFIG: Record<PurchaseStatus, { label: string; color: string }> = {
  HELD: { label: 'Awaiting Delivery', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  DELIVERED: {
    label: 'Confirm or Dispute',
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  },
  CONFIRMED: { label: 'Completed', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  RELEASED: { label: 'Completed', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  DISPUTED: { label: 'Under Review', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  REFUNDED: { label: 'Refunded', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
};

function DisputeModal({ purchaseId, onClose }: { purchaseId: string; onClose: () => void }) {
  const [reason, setReason] = useState('');
  const qc = useQueryClient();
  const mut = useMutation({
    mutationFn: () => api.post(`/purchases/${purchaseId}/dispute`, { reason }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-purchases'] });
      onClose();
    },
  });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-[440px] rounded-[16px] border border-border bg-card p-[24px]">
        <p className="text-[16px] font-semibold text-foreground mb-[12px]">Raise a Dispute</p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Describe the issue…"
          rows={4}
          className="w-full rounded-[8px] border border-border bg-background px-[12px] py-[10px] text-[13px] text-foreground outline-none resize-none"
        />
        {mut.isError && <p className="text-[12px] text-red-400 mt-2">Failed to raise dispute</p>}
        <div className="flex gap-[10px] mt-[16px]">
          <button
            onClick={onClose}
            className="flex-1 rounded-[8px] border border-border py-[10px] text-[13px] text-foreground"
          >
            Cancel
          </button>
          <button
            onClick={() => mut.mutate()}
            disabled={!reason.trim() || mut.isPending}
            className="flex-1 rounded-[8px] bg-red-500 py-[10px] text-[13px] font-semibold text-white disabled:opacity-50"
          >
            {mut.isPending ? 'Submitting…' : 'Submit Dispute'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyPurchases() {
  const [disputeId, setDisputeId] = useState<string | null>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['my-purchases'],
    queryFn: () => api.get('/purchases/my').then((r) => r.data.data),
  });

  const confirmMut = useMutation({
    mutationFn: (id: string) => api.post(`/purchases/${id}/confirm`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-purchases'] }),
  });

  const items: Purchase[] = data?.items ?? [];

  return (
    <div className="flex flex-col gap-[20px]">
      <div>
        <p className="text-[18px] font-semibold text-foreground">My Purchases</p>
        <p className="text-[13px] text-muted-foreground">
          Track your marketplace purchases and escrow status
        </p>
      </div>

      {isLoading && <p className="text-[13px] text-muted-foreground">Loading…</p>}
      {!isLoading && items.length === 0 && (
        <div className="rounded-[12px] border border-border bg-card p-[40px] text-center">
          <p className="text-[14px] text-muted-foreground">No purchases yet</p>
        </div>
      )}

      <div className="flex flex-col gap-[12px]">
        {items.map((p) => {
          const sc = STATUS_CONFIG[p.status];
          const img = p.listing.images[0];
          return (
            <div key={p.id} className="rounded-[12px] border border-border bg-card p-[16px]">
              <div className="flex items-start gap-[12px]">
                {img ? (
                  <img
                    src={img}
                    alt={p.listing.title}
                    className="h-[56px] w-[56px] rounded-[8px] object-cover shrink-0"
                  />
                ) : (
                  <div className="h-[56px] w-[56px] rounded-[8px] bg-muted shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-foreground truncate">
                    {p.listing.title}
                  </p>
                  <p className="text-[12px] text-muted-foreground">from @{p.seller.username}</p>
                  <p className="text-[15px] font-bold text-[#01adf1] mt-[2px]">
                    ${p.amount.toFixed(2)}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-[20px] border px-[10px] py-[3px] text-[11px] font-medium ${sc.color}`}
                >
                  {sc.label}
                </span>
              </div>
              {p.status === 'DELIVERED' && (
                <div className="mt-[12px] flex gap-[8px]">
                  <button
                    onClick={() => confirmMut.mutate(p.id)}
                    disabled={confirmMut.isPending}
                    className="flex-1 rounded-[8px] bg-green-500 py-[8px] text-[12px] font-semibold text-white disabled:opacity-50"
                  >
                    Confirm Receipt
                  </button>
                  <button
                    onClick={() => setDisputeId(p.id)}
                    className="flex-1 rounded-[8px] border border-red-500/50 py-[8px] text-[12px] font-semibold text-red-400"
                  >
                    Raise Dispute
                  </button>
                </div>
              )}
              {p.status === 'DISPUTED' && p.disputeReason && (
                <p className="mt-[8px] text-[11px] text-red-400">Dispute: {p.disputeReason}</p>
              )}
            </div>
          );
        })}
      </div>

      {disputeId && <DisputeModal purchaseId={disputeId} onClose={() => setDisputeId(null)} />}
    </div>
  );
}
