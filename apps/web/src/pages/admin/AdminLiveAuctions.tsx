import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

type AuctionStatus = 'ACTIVE' | 'ENDED' | 'CANCELLED';

interface LiveAuction {
  id: string;
  startingBid: number;
  winnerAmount: number | null;
  platformFee: number | null;
  purchaseId: string | null;
  status: AuctionStatus;
  durationSec: number;
  createdAt: string;
  listing: { title: string };
  creator: { username: string };
  winner: { username: string } | null;
}

interface Stats {
  _sum: { winnerAmount: number | null; platformFee: number | null };
  _count: { id: number };
}

const STATUS_COLORS: Record<AuctionStatus, string> = {
  ACTIVE: 'bg-blue-500/20 text-blue-400',
  ENDED: 'bg-green-500/20 text-green-400',
  CANCELLED: 'bg-gray-500/20 text-gray-400',
};

function deriveAuctionData(data: { items: LiveAuction[]; stats: Stats } | undefined) {
  if (!data) return { items: [] as LiveAuction[], totalRevenue: 0, totalFees: 0, count: 0 };
  const totalRevenue = data.stats._sum.winnerAmount ?? 0;
  const totalFees = data.stats._sum.platformFee ?? 0;
  return { items: data.items, totalRevenue, totalFees, count: data.stats._count.id };
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[12px] border border-border bg-card p-[16px]">
      <p className="text-[12px] text-muted-foreground">{label}</p>
      <p className="text-[18px] font-semibold text-foreground mt-[4px]">{value}</p>
    </div>
  );
}

function AuctionRow({
  a,
  onRelease,
  releasing,
}: {
  a: LiveAuction;
  onRelease: (id: string) => void;
  releasing: boolean;
}) {
  return (
    <tr className="border-b border-border last:border-0 hover:bg-muted/30">
      <td className="px-[14px] py-[10px] text-muted-foreground whitespace-nowrap">
        {new Date(a.createdAt).toLocaleDateString()}
      </td>
      <td className="px-[14px] py-[10px] text-foreground">@{a.creator.username}</td>
      <td className="px-[14px] py-[10px] text-foreground max-w-[160px] truncate">
        {a.listing.title}
      </td>
      <td className="px-[14px] py-[10px] text-muted-foreground">{a.durationSec}s</td>
      <td className="px-[14px] py-[10px] text-foreground">{a.startingBid}</td>
      <td className="px-[14px] py-[10px] font-semibold text-foreground">{a.winnerAmount ?? '—'}</td>
      <td className="px-[14px] py-[10px] text-muted-foreground">
        {a.platformFee ? a.platformFee.toFixed(2) : '—'}
      </td>
      <td className="px-[14px] py-[10px] text-foreground">
        {a.winner ? `@${a.winner.username}` : '—'}
      </td>
      <td className="px-[14px] py-[10px]">
        <span
          className={`rounded-full px-[8px] py-[2px] text-[10px] font-semibold ${STATUS_COLORS[a.status]}`}
        >
          {a.status}
        </span>
      </td>
      <td className="px-[14px] py-[10px]">
        {a.status === 'ENDED' && a.purchaseId && a.winnerAmount && (
          <button
            onClick={() => onRelease(a.id)}
            disabled={releasing}
            className="rounded-[6px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[10px] py-[4px] text-[11px] font-medium text-white disabled:opacity-50"
          >
            Release
          </button>
        )}
      </td>
    </tr>
  );
}

export default function AdminLiveAuctions() {
  const [statusFilter, setStatusFilter] = useState('');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-live-auctions', statusFilter],
    queryFn: () =>
      api
        .get(`/admin/live-auctions${statusFilter ? `?status=${statusFilter}` : ''}`)
        .then((r) => r.data.data),
  });

  const releaseMut = useMutation({
    mutationFn: (id: string) => api.post(`/admin/live-auctions/${id}/release`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-live-auctions'] }),
  });

  const { items, totalRevenue, totalFees, count } = deriveAuctionData(data);

  return (
    <div className="flex flex-col gap-[20px]">
      <p className="text-[20px] font-semibold text-foreground">Live Auction Report</p>

      <div className="grid grid-cols-2 gap-[12px] md:grid-cols-4">
        <StatCard label="Total Auctions" value={count} />
        <StatCard label="Total Revenue" value={`${totalRevenue.toFixed(0)} coins`} />
        <StatCard label="Platform Fees (5%)" value={`${totalFees.toFixed(2)} coins`} />
        <StatCard
          label="Creator Earnings (95%)"
          value={`${(totalRevenue - totalFees).toFixed(2)} coins`}
        />
      </div>

      <div className="flex gap-[8px]">
        {['', 'ACTIVE', 'ENDED', 'CANCELLED'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-[8px] px-[14px] py-[6px] text-[13px] font-medium transition-colors ${statusFilter === s ? 'bg-gradient-to-r from-[#01adf1] to-[#a61651] text-white' : 'border border-border text-foreground hover:border-foreground'}`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-[40px]">
          <div className="size-[32px] animate-spin rounded-full border-4 border-foreground border-t-transparent" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[12px] border border-border">
          <table className="w-full text-[13px]">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                {[
                  'Date',
                  'Creator',
                  'Item',
                  'Duration',
                  'Starting',
                  'Winning Bid',
                  'Fee (5%)',
                  'Winner',
                  'Status',
                  'Action',
                ].map((h) => (
                  <th
                    key={h}
                    className="px-[14px] py-[10px] text-left text-[12px] font-medium text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className="px-[14px] py-[24px] text-center text-muted-foreground"
                  >
                    No auctions found.
                  </td>
                </tr>
              )}
              {items.map((a) => (
                <AuctionRow
                  key={a.id}
                  a={a}
                  onRelease={releaseMut.mutate}
                  releasing={releaseMut.isPending}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
