import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { formatMoney } from '../../lib/currency';

type PurchaseStatus = 'HELD' | 'DELIVERED' | 'CONFIRMED' | 'DISPUTED' | 'RELEASED' | 'REFUNDED';

interface Sale {
  id: string;
  amount: number;
  status: PurchaseStatus;
  createdAt: string;
  listing: { id: string; title: string; images: string[] };
  buyer: { id: string; username: string; displayName: string };
}

const STATUS_CONFIG: Record<PurchaseStatus, { label: string; color: string }> = {
  HELD: { label: 'In Escrow', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  DELIVERED: {
    label: 'Awaiting Confirmation',
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  },
  CONFIRMED: {
    label: 'Funds Released',
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
  },
  RELEASED: {
    label: 'Funds Released',
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
  },
  DISPUTED: {
    label: 'Dispute — Admin Reviewing',
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
  REFUNDED: {
    label: 'Refunded to Buyer',
    color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  },
};

const STATS = [
  { key: 'totalEarned', label: 'Total Earned', prefix: '€', color: 'text-green-400' },
  { key: 'pendingEscrow', label: 'In Escrow', prefix: '€', color: 'text-blue-400' },
  { key: 'total', label: 'Total Sales', prefix: '', color: 'text-foreground' },
] as const;

function SaleCard({
  s,
  onDeliver,
  delivering,
}: {
  s: Sale;
  onDeliver: (id: string) => void;
  delivering: boolean;
}) {
  const sc = STATUS_CONFIG[s.status];
  const img = s.listing.images[0];
  return (
    <div className="rounded-[12px] border border-border bg-card p-[16px]">
      <div className="flex items-start gap-[12px]">
        {img ? (
          <img
            src={img}
            alt={s.listing.title}
            className="h-[52px] w-[52px] rounded-[8px] object-cover shrink-0"
          />
        ) : (
          <div className="h-[52px] w-[52px] rounded-[8px] bg-muted shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-foreground truncate">{s.listing.title}</p>
          <p className="text-[12px] text-muted-foreground">Buyer: @{s.buyer.username}</p>
          <p className="text-[15px] font-bold text-[#01adf1] mt-[2px]">{formatMoney(s.amount)}</p>
        </div>
        <span
          className={`shrink-0 rounded-[20px] border px-[10px] py-[3px] text-[11px] font-medium ${sc.color}`}
        >
          {sc.label}
        </span>
      </div>
      {s.status === 'HELD' && (
        <button
          onClick={() => onDeliver(s.id)}
          disabled={delivering}
          className="mt-[12px] w-full rounded-[8px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[8px] text-[12px] font-semibold text-white disabled:opacity-50"
        >
          {delivering ? 'Marking…' : 'Mark as Delivered'}
        </button>
      )}
      {s.status === 'DISPUTED' && (
        <p className="mt-[8px] text-[11px] text-red-400">
          Admin is reviewing this dispute. You will be notified of the outcome.
        </p>
      )}
    </div>
  );
}

export default function MySales() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['my-sales'],
    queryFn: () => api.get('/sales/my').then((r) => r.data.data),
  });

  const deliverMut = useMutation({
    mutationFn: (id: string) => api.post(`/sales/${id}/delivered`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-sales'] }),
  });

  const items: Sale[] = data?.items ?? [];

  return (
    <div className="flex flex-col gap-[20px]">
      <div>
        <p className="text-[18px] font-semibold text-foreground">My Sales</p>
        <p className="text-[13px] text-muted-foreground">
          Track your marketplace sales and escrow payouts
        </p>
      </div>

      <div className="grid grid-cols-2 gap-[12px] md:grid-cols-3">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-[12px] border border-border bg-card p-[16px]">
            <p className="text-[12px] text-muted-foreground">{s.label}</p>
            <p className={`text-[20px] font-bold mt-[4px] ${s.color}`}>
              {s.prefix}
              {s.key === 'total' ? (data?.total ?? 0) : ((data?.[s.key] ?? 0) as number).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {isLoading && <p className="text-[13px] text-muted-foreground">Loading…</p>}
      {!isLoading && items.length === 0 && (
        <div className="rounded-[12px] border border-border bg-card p-[40px] text-center">
          <p className="text-[14px] text-muted-foreground">No sales yet</p>
        </div>
      )}

      <div className="flex flex-col gap-[12px]">
        {items.map((s) => (
          <SaleCard
            key={s.id}
            s={s}
            onDeliver={(id) => deliverMut.mutate(id)}
            delivering={deliverMut.isPending}
          />
        ))}
      </div>
    </div>
  );
}
