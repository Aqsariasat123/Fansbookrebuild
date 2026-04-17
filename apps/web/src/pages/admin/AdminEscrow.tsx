import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { TabBar, StatsGrid, type Stat } from './AdminEscrowParts';

type PurchaseStatus = 'HELD' | 'DELIVERED' | 'CONFIRMED' | 'DISPUTED' | 'RELEASED' | 'REFUNDED';
type Tab = 'all' | 'disputes';

export interface Purchase {
  id: string;
  amount: number;
  status: PurchaseStatus;
  disputeReason: string | null;
  listing: { title: string; images: string[] };
  buyer: { username: string };
  seller: { username: string };
}

const STATUS_COLORS: Record<PurchaseStatus, string> = {
  HELD: 'bg-blue-500/20 text-blue-400',
  DELIVERED: 'bg-yellow-500/20 text-yellow-400',
  CONFIRMED: 'bg-green-500/20 text-green-400',
  RELEASED: 'bg-green-500/20 text-green-400',
  DISPUTED: 'bg-red-500/20 text-red-400',
  REFUNDED: 'bg-gray-500/20 text-gray-400',
};

function buildUrl(tab: Tab, statusFilter: string) {
  if (tab === 'disputes') return '/admin/escrow/disputes';
  return `/admin/escrow${statusFilter ? `?status=${statusFilter}` : ''}`;
}

function parseData(data: unknown): { items: Purchase[]; stats: Stat[] } {
  const d = data as { items?: Purchase[]; stats?: Stat[] } | undefined;
  return { items: d?.items ?? [], stats: d?.stats ?? [] };
}

function ResolveModal({ purchase, onClose }: { purchase: Purchase; onClose: () => void }) {
  const [action, setAction] = useState<'RELEASE' | 'REFUND'>('RELEASE');
  const [note, setNote] = useState('');
  const qc = useQueryClient();
  const mut = useMutation({
    mutationFn: () => api.post(`/admin/escrow/${purchase.id}/resolve`, { action, note }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-escrow'] });
      onClose();
    },
  });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-[460px] rounded-[16px] border border-border bg-card p-[24px]">
        <p className="text-[16px] font-semibold text-foreground mb-[4px]">Resolve Dispute</p>
        <p className="text-[12px] text-muted-foreground mb-[16px]">
          {purchase.listing.title} — ${purchase.amount.toFixed(2)}
        </p>
        {purchase.disputeReason && (
          <div className="mb-[16px] rounded-[8px] bg-red-500/10 border border-red-500/20 p-[10px]">
            <p className="text-[11px] text-red-400 font-medium">Buyer reason:</p>
            <p className="text-[12px] text-foreground mt-[2px]">{purchase.disputeReason}</p>
          </div>
        )}
        <div className="flex gap-[8px] mb-[12px]">
          {(['RELEASE', 'REFUND'] as const).map((a) => (
            <button
              key={a}
              onClick={() => setAction(a)}
              className={`flex-1 rounded-[8px] py-[8px] text-[12px] font-semibold border transition-colors ${action === a ? (a === 'RELEASE' ? 'bg-green-500 text-white border-green-500' : 'bg-red-500 text-white border-red-500') : 'border-border text-muted-foreground'}`}
            >
              {a === 'RELEASE' ? 'Release to Seller' : 'Refund to Buyer'}
            </button>
          ))}
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Admin note (optional)…"
          rows={3}
          className="w-full rounded-[8px] border border-border bg-background px-[12px] py-[8px] text-[12px] text-foreground outline-none resize-none"
        />
        {mut.isError && <p className="text-[11px] text-red-400 mt-2">Failed to resolve</p>}
        <div className="flex gap-[8px] mt-[12px]">
          <button
            onClick={onClose}
            className="flex-1 rounded-[8px] border border-border py-[8px] text-[12px] text-foreground"
          >
            Cancel
          </button>
          <button
            onClick={() => mut.mutate()}
            disabled={mut.isPending}
            className="flex-1 rounded-[8px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[8px] text-[12px] font-semibold text-white disabled:opacity-50"
          >
            {mut.isPending ? 'Resolving…' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

function PurchaseCard({ p, onResolve }: { p: Purchase; onResolve: (p: Purchase) => void }) {
  return (
    <div className="rounded-[12px] border border-border bg-card p-[14px]">
      <div className="flex items-start justify-between gap-[12px]">
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-foreground truncate">{p.listing.title}</p>
          <p className="text-[11px] text-muted-foreground mt-[2px]">
            Buyer: @{p.buyer.username} → Seller: @{p.seller.username}
          </p>
          {p.disputeReason && (
            <p className="text-[11px] text-red-400 mt-[4px]">Dispute: {p.disputeReason}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-[6px] shrink-0">
          <span
            className={`rounded-[20px] px-[8px] py-[2px] text-[10px] font-medium ${STATUS_COLORS[p.status]}`}
          >
            {p.status}
          </span>
          <p className="text-[14px] font-bold text-[#01adf1]">${p.amount.toFixed(2)}</p>
        </div>
      </div>
      {p.status === 'DISPUTED' && (
        <button
          onClick={() => onResolve(p)}
          className="mt-[10px] w-full rounded-[8px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[7px] text-[12px] font-semibold text-white"
        >
          Resolve Dispute
        </button>
      )}
    </div>
  );
}

function EmptyState({ tab }: { tab: Tab }) {
  return (
    <div className="rounded-[12px] border border-border bg-card p-[40px] text-center">
      <p className="text-[14px] text-muted-foreground">
        {tab === 'disputes' ? 'No open disputes' : 'No transactions'}
      </p>
    </div>
  );
}

export default function AdminEscrow() {
  const [tab, setTab] = useState<Tab>('disputes');
  const [statusFilter, setStatusFilter] = useState('');
  const [resolvingPurchase, setResolvingPurchase] = useState<Purchase | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-escrow', tab, statusFilter],
    queryFn: () => api.get(buildUrl(tab, statusFilter)).then((r) => r.data.data as unknown),
  });

  const { items, stats } = parseData(data);
  const showStats = tab === 'all' && stats.length > 0;
  const showEmpty = !isLoading && items.length === 0;

  return (
    <div className="flex flex-col gap-[20px]">
      <div>
        <p className="text-[20px] font-semibold text-foreground">Escrow & Disputes</p>
        <p className="text-[13px] text-muted-foreground">
          Manage marketplace escrow transactions and resolve disputes
        </p>
      </div>
      {showStats && <StatsGrid stats={stats} />}
      <TabBar
        tab={tab}
        statusFilter={statusFilter}
        onTabChange={setTab}
        onFilterChange={setStatusFilter}
      />
      {isLoading && <p className="text-[13px] text-muted-foreground">Loading…</p>}
      {showEmpty && <EmptyState tab={tab} />}
      <div className="flex flex-col gap-[10px]">
        {items.map((p) => (
          <PurchaseCard key={p.id} p={p} onResolve={setResolvingPurchase} />
        ))}
      </div>
      {resolvingPurchase && (
        <ResolveModal purchase={resolvingPurchase} onClose={() => setResolvingPurchase(null)} />
      )}
    </div>
  );
}
