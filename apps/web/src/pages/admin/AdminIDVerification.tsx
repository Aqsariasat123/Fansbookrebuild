import { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';
import { VerificationTable, type VerificationItem } from './AdminIDVerificationTable';

interface Stats {
  total: number;
  pending: number;
  manualReview: number;
  approved: number;
  rejected: number;
  today: number;
  rejectionRate: number;
}

type TabKey = 'QUEUE' | 'APPROVED' | 'REJECTED' | 'ALL';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'QUEUE', label: 'Pending Queue' },
  { key: 'APPROVED', label: 'Approved' },
  { key: 'REJECTED', label: 'Rejected' },
  { key: 'ALL', label: 'All' },
];

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-[12px] border border-gray-200 bg-white p-[20px] shadow-sm">
      <p className="text-[11px] text-gray-500 uppercase tracking-wide mb-[6px]">{label}</p>
      <p className={`text-[26px] font-bold ${highlight ? 'text-[#01adf1]' : 'text-gray-900'}`}>
        {value}
      </p>
    </div>
  );
}

function buildStatusFilter(tab: TabKey): string | undefined {
  if (tab === 'QUEUE') return undefined;
  if (tab === 'APPROVED') return 'APPROVED';
  if (tab === 'REJECTED') return 'REJECTED';
  return undefined;
}

export default function AdminIDVerification() {
  const [tab, setTab] = useState<TabKey>('QUEUE');
  const [stats, setStats] = useState<Stats | null>(null);
  const [items, setItems] = useState<VerificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchStats = useCallback(async () => {
    try {
      const { data: r } = await api.get('/admin/verifications/stats');
      if (r.success) setStats(r.data as Stats);
    } catch {
      // swallow
    }
  }, []);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const statusParam = buildStatusFilter(tab);
      const params: Record<string, string> = { limit: '50' };
      if (statusParam) params.status = statusParam;
      if (search.trim()) params.q = search.trim();

      const { data: r } = await api.get('/admin/verifications', { params });
      if (r.success) {
        let result = r.data.items as VerificationItem[];
        if (tab === 'QUEUE') {
          result = result.filter((i) => i.status === 'PENDING' || i.status === 'MANUAL_REVIEW');
        }
        setItems(result);
      }
    } catch {
      // swallow
    } finally {
      setLoading(false);
    }
  }, [tab, search]);

  useEffect(() => {
    void fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  function handleRefresh() {
    void fetchStats();
    void fetchItems();
  }

  return (
    <div className="p-[24px] md:p-[32px]">
      <div className="mb-[28px]">
        <h1 className="text-[22px] font-bold text-gray-900">ID Verification</h1>
        <p className="text-[13px] text-gray-500 mt-[2px]">
          Review and manage user identity verification requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px] mb-[28px]">
        <StatCard label="Total Verified" value={stats?.approved ?? '—'} highlight />
        <StatCard label="Pending Queue" value={stats ? stats.pending + stats.manualReview : '—'} />
        <StatCard label="Manual Review" value={stats?.manualReview ?? '—'} />
        <StatCard label="Rejection Rate" value={stats ? `${stats.rejectionRate}%` : '—'} />
      </div>

      {/* Tabs + search */}
      <div className="mb-[16px] flex flex-wrap items-center justify-between gap-[12px]">
        <div className="flex gap-[8px]">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-[16px] py-[7px] text-[13px] font-medium transition-colors ${
                tab === t.key
                  ? 'bg-gradient-to-r from-[#01adf1] to-[#a61651] text-white'
                  : 'border border-gray-300 text-gray-600 hover:text-gray-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by username or email…"
          className="rounded-[8px] border border-gray-300 bg-white px-[12px] py-[7px] text-[13px] text-gray-900 outline-none focus:border-[#01adf1] w-[240px]"
        />
      </div>

      {/* Table */}
      <div className="rounded-[12px] border border-gray-200 overflow-hidden bg-white">
        <VerificationTable items={items} loading={loading} onRefresh={handleRefresh} />
      </div>
    </div>
  );
}
