import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { formatMoneyCompact } from '../lib/currency';
import { VerificationBanner } from '../components/shared/VerificationBanner';
import UpsellWidget from '../components/creator/UpsellWidget';

interface DashStats {
  totalEarnings: number;
  totalSubscribers: number;
  totalPosts: number;
  totalViews: number;
  totalFollowers: number;
}

const STAT_ICONS: Record<string, React.ReactNode> = {
  totalEarnings: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-[22px] w-[22px] text-foreground"
    >
      <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
    </svg>
  ),
  totalSubscribers: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-[22px] w-[22px] text-foreground"
    >
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  ),
  totalPosts: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-[22px] w-[22px] text-foreground"
    >
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
    </svg>
  ),
  totalFollowers: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-[22px] w-[22px] text-foreground"
    >
      <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  ),
};

const STAT_CARDS = [
  { key: 'totalEarnings', label: 'Total Earnings', prefix: '' },
  { key: 'totalSubscribers', label: 'Subscribers', prefix: '' },
  { key: 'totalPosts', label: 'Total Posts', prefix: '' },
  { key: 'totalFollowers', label: 'Followers', prefix: '' },
] as const;

const QUICK_ACTIONS = [
  { to: '/creator/post/new', label: 'New Post', gradient: true },
  { to: '/creator/go-live', label: 'Go Live', gradient: false },
  { to: '/creator/earnings', label: 'View Earnings', gradient: false },
  { to: '/creator/analytics', label: 'Analytics', gradient: false },
];

export default function CreatorDashboardHome() {
  const [stats, setStats] = useState<DashStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/creator/dashboard/stats')
      .then((res) => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-foreground border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[20px]">
      <VerificationBanner />
      <p className="text-[20px] text-foreground">Dashboard</p>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-[12px] md:grid-cols-4 md:gap-[16px]">
        {STAT_CARDS.map((card) => (
          <div key={card.key} className="rounded-[16px] bg-card p-[16px] md:p-[20px]">
            {STAT_ICONS[card.key]}
            <p className="mt-2 text-[22px] font-semibold text-foreground md:text-[28px]">
              {card.key === 'totalEarnings'
                ? stats
                  ? formatMoneyCompact(stats[card.key])
                  : '€0'
                : `${card.prefix}${stats ? formatNum(stats[card.key]) : '0'}`}
            </p>
            <p className="text-[12px] text-muted-foreground md:text-[14px]">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-[22px] bg-card p-[20px]">
        <p className="mb-[14px] text-[16px] text-foreground">Quick Actions</p>
        <div className="grid grid-cols-2 gap-[10px] md:grid-cols-4">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className={`rounded-[50px] px-[16px] py-[10px] text-center text-[13px] font-medium transition-opacity hover:opacity-80 ${
                action.gradient
                  ? 'bg-gradient-to-r from-[#01adf1] to-[#a61651] text-white'
                  : 'bg-muted text-foreground'
              }`}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Views stat */}
      <div className="rounded-[22px] bg-card p-[20px]">
        <p className="text-[16px] text-foreground">Story Views</p>
        <p className="mt-2 text-[28px] font-semibold text-primary">
          {formatNum(stats?.totalViews ?? 0)}
        </p>
        <p className="text-[12px] text-muted-foreground">Total views on your stories</p>
      </div>

      {/* AI Revenue Tips Widget */}
      <UpsellWidget />
    </div>
  );
}

function formatNum(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toFixed(n % 1 === 0 ? 0 : 2);
}
