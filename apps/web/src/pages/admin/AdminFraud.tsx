import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { type FraudStats, FraudEvent, FraudTable } from './AdminFraudParts';
import { StatCard } from '../../components/admin/StatCard';

const OUTCOME_FILTERS = ['', 'BLOCKED', 'FLAGGED', 'ALLOWED'];

function FraudStatCards({ stats }: { stats?: FraudStats }) {
  return (
    <div className="grid grid-cols-2 gap-[16px] sm:grid-cols-4">
      <StatCard
        icon="block"
        label="Blocked Today"
        value={stats?.blockedToday ?? 0}
        color="#ef4444"
      />
      <StatCard icon="gpp_bad" label="Total Blocked" value={stats?.blocked ?? 0} color="#ef4444" />
      <StatCard icon="flag" label="Total Flagged" value={stats?.flagged ?? 0} color="#f59e0b" />
      <StatCard
        icon="check_circle"
        label="Total Allowed"
        value={stats?.allowed ?? 0}
        color="#10b981"
      />
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center gap-[12px] justify-end">
      <button
        disabled={page === 1}
        onClick={onPrev}
        className="rounded-[8px] border border-gray-700 px-[12px] py-[6px] text-[13px] text-gray-300 disabled:opacity-40"
      >
        Prev
      </button>
      <span className="text-[13px] text-gray-400">
        Page {page} of {totalPages}
      </span>
      <button
        disabled={page >= totalPages}
        onClick={onNext}
        className="rounded-[8px] border border-gray-700 px-[12px] py-[6px] text-[13px] text-gray-300 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}

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
      <h1 className="text-[22px] font-bold text-gray-800">Fraud Prevention</h1>

      <FraudStatCards stats={stats} />

      <div className="flex gap-[8px]">
        {OUTCOME_FILTERS.map((o) => (
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
        <Pagination
          page={page}
          totalPages={totalPages}
          onPrev={() => setPage((p) => p - 1)}
          onNext={() => setPage((p) => p + 1)}
        />
      )}
    </div>
  );
}
