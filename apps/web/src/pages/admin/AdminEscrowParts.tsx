import type { Dispatch, SetStateAction } from 'react';

type Tab = 'all' | 'disputes';

const STATUS_OPTIONS = ['HELD', 'DELIVERED', 'CONFIRMED', 'RELEASED', 'DISPUTED', 'REFUNDED'];

export function TabBar({
  tab,
  statusFilter,
  onTabChange,
  onFilterChange,
}: {
  tab: Tab;
  statusFilter: string;
  onTabChange: Dispatch<SetStateAction<Tab>>;
  onFilterChange: Dispatch<SetStateAction<string>>;
}) {
  return (
    <div className="flex items-center gap-[8px]">
      {(['disputes', 'all'] as const).map((t) => (
        <button
          key={t}
          onClick={() => onTabChange(t)}
          className={`rounded-[8px] px-[16px] py-[8px] text-[13px] font-medium transition-colors ${tab === t ? 'bg-gradient-to-r from-[#01adf1] to-[#a61651] text-white' : 'border border-border text-muted-foreground hover:text-foreground'}`}
        >
          {t === 'disputes' ? 'Disputes' : 'All Transactions'}
        </button>
      ))}
      {tab === 'all' && (
        <select
          value={statusFilter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="ml-auto rounded-[8px] border border-border bg-background px-[10px] py-[7px] text-[12px] text-foreground outline-none"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export interface Stat {
  status: string;
  _count: { id: number };
  _sum: { amount: number };
}

export function StatsGrid({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 gap-[10px] md:grid-cols-3 lg:grid-cols-6">
      {stats.map((s) => (
        <div key={s.status} className="rounded-[10px] border border-border bg-card p-[12px]">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{s.status}</p>
          <p className="text-[16px] font-bold text-foreground">{s._count.id}</p>
          <p className="text-[11px] text-[#01adf1]">${(s._sum.amount ?? 0).toFixed(0)}</p>
        </div>
      ))}
    </div>
  );
}
