import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { FraudEvent, FraudStats, FraudTable } from './AdminFraudParts';

const STAT_CARDS = (s?: FraudStats) => [
  { label: 'Blocked Today', value: s?.blockedToday ?? 0, color: 'text-red-400' },
  { label: 'Total Blocked', value: s?.blocked ?? 0, color: 'text-red-400' },
  { label: 'Total Flagged', value: s?.flagged ?? 0, color: 'text-yellow-400' },
  { label: 'Total Allowed', value: s?.allowed ?? 0, color: 'text-green-400' },
];

export default function AdminFraud() {
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data: stats } = useQuery<FraudStats>({
    queryKey: ['admin-fraud-stats'],
    queryFn: () => api.get('/admin/fraud/stats').then((r) => r.data.data),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-fraud', filter, page],
    queryFn: () =>
      api
        .get('/admin/fraud', { params: { outcome: filter || undefined, page } })
        .then((r) => r.data.data),
  });

  const events: FraudEvent[] = data?.items ?? [];
  const total: number = data?.total ?? 0;
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="flex flex-col gap-[24px] p-[24px]">
      <h1 className="text-[22px] font-bold text-white">Fraud Prevention</h1>

      <div className="grid grid-cols-2 gap-[16px] sm:grid-cols-4">
        {STAT_CARDS(stats).map((s) => (
          <div key={s.label} className="rounded-[12px] border border-gray-800 bg-card p-[20px]">
            <p className="text-[13px] text-gray-400">{s.label}</p>
            <p className={`text-[28px] font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-[8px]">
        {['', 'BLOCKED', 'FLAGGED', 'ALLOWED'].map((o) => (
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

      <FraudTable events={events} isLoading={isLoading} />

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
