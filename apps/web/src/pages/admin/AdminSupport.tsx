import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { SupportTicket, TicketRow, TicketPanel } from './AdminSupportParts';
import { StatCard } from '../../components/admin/StatCard';

interface SupportStats {
  open: number;
  escalated: number;
  resolved: number;
  total: number;
}

const FILTERS = ['', 'OPEN', 'ESCALATED', 'RESOLVED'];

function SupportStatCards({ stats }: { stats?: SupportStats }) {
  return (
    <div className="grid grid-cols-2 gap-[16px] sm:grid-cols-4">
      <StatCard icon="inbox" label="Open" value={stats?.open ?? 0} color="#3b82f6" />
      <StatCard
        icon="priority_high"
        label="Escalated"
        value={stats?.escalated ?? 0}
        color="#f59e0b"
      />
      <StatCard icon="check_circle" label="Resolved" value={stats?.resolved ?? 0} color="#10b981" />
      <StatCard
        icon="confirmation_number"
        label="Total"
        value={stats?.total ?? 0}
        color="#8b5cf6"
      />
    </div>
  );
}

function TicketTable({
  tickets,
  isLoading,
  selectedId,
  onSelect,
}: {
  tickets: SupportTicket[];
  isLoading: boolean;
  selectedId?: string;
  onSelect: (t: SupportTicket) => void;
}) {
  return (
    <div className="flex-1 rounded-[12px] border border-gray-200 bg-white overflow-hidden shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-[13px] text-gray-500">
            {['Title', 'User', 'Status', 'Updated'].map((h) => (
              <th key={h} className="px-[16px] py-[12px] text-left font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={4} className="px-[16px] py-[24px] text-center text-gray-400">
                Loading…
              </td>
            </tr>
          )}
          {!isLoading && tickets.length === 0 && (
            <tr>
              <td colSpan={4} className="px-[16px] py-[24px] text-center text-gray-400">
                No tickets found.
              </td>
            </tr>
          )}
          {tickets.map((t) => (
            <TicketRow
              key={t.id}
              ticket={t}
              selected={selectedId === t.id}
              onSelect={() => onSelect(t)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminSupport() {
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');
  const qc = useQueryClient();

  const { data: stats } = useQuery<SupportStats>({
    queryKey: ['admin-support-stats'],
    queryFn: () => api.get('/admin/support/stats').then((r) => r.data.data),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-support', filter, page],
    queryFn: () =>
      api
        .get('/admin/support', { params: { status: filter || undefined, page } })
        .then((r) => r.data.data),
  });

  const replyMut = useMutation({
    mutationFn: (content: string) =>
      api.post(`/admin/support/${selected!.id}/reply`, { content }).then((r) => r.data),
    onSuccess: () => {
      setReplyText('');
      qc.invalidateQueries({ queryKey: ['admin-support'] });
      api
        .get(`/admin/support/${selected!.id}`)
        .then((r) => r.data.success && setSelected(r.data.data));
    },
  });

  const resolveMut = useMutation({
    mutationFn: () => api.patch(`/admin/support/${selected!.id}/resolve`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-support', 'admin-support-stats'] });
      setSelected((prev) => (prev ? { ...prev, status: 'RESOLVED' } : null));
    },
  });

  const tickets: SupportTicket[] = data?.items ?? [];
  const total: number = data?.total ?? 0;
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="flex flex-col gap-[24px] p-[24px]">
      <h1 className="text-[22px] font-bold text-gray-800">Support Tickets</h1>

      <SupportStatCards stats={stats} />

      <div className="flex gap-[8px]">
        {FILTERS.map((o) => (
          <button
            key={o}
            onClick={() => {
              setFilter(o);
              setPage(1);
            }}
            className={`rounded-full px-[16px] py-[8px] text-[13px] font-medium transition ${filter === o ? 'bg-[#01adf1] text-white' : 'border border-gray-700 text-gray-400 hover:border-gray-500'}`}
          >
            {o || 'All'}
          </button>
        ))}
      </div>

      <div className="flex gap-[16px]">
        <TicketTable
          tickets={tickets}
          isLoading={isLoading}
          selectedId={selected?.id}
          onSelect={setSelected}
        />
        {selected && (
          <TicketPanel
            ticket={selected}
            replyText={replyText}
            onReplyChange={setReplyText}
            onSendReply={() => replyMut.mutate(replyText)}
            onResolve={() => resolveMut.mutate()}
            sendingReply={replyMut.isPending}
            resolving={resolveMut.isPending}
            onClose={() => setSelected(null)}
          />
        )}
      </div>

      {total > 20 && (
        <div className="flex items-center gap-[12px] justify-end">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-[8px] border border-gray-700 px-[12px] py-[6px] text-[13px] text-gray-300 disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-[13px] text-gray-400">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-[8px] border border-gray-700 px-[12px] py-[6px] text-[13px] text-gray-300 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
