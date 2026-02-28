import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

interface DashStats {
  totalEarnings: number;
  totalSubscribers: number;
  totalPosts: number;
  totalViews: number;
  totalFollowers: number;
}

const STAT_CARDS = [
  { key: 'totalEarnings', label: 'Total Earnings', prefix: '$', icon: '💰' },
  { key: 'totalSubscribers', label: 'Subscribers', prefix: '', icon: '⭐' },
  { key: 'totalPosts', label: 'Total Posts', prefix: '', icon: '📝' },
  { key: 'totalFollowers', label: 'Followers', prefix: '', icon: '👥' },
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
      <p className="text-[20px] text-foreground">Dashboard</p>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-[12px] md:grid-cols-4 md:gap-[16px]">
        {STAT_CARDS.map((card) => (
          <div key={card.key} className="rounded-[16px] bg-card p-[16px] md:p-[20px]">
            <span className="text-[20px]">{card.icon}</span>
            <p className="mt-2 text-[22px] font-semibold text-foreground md:text-[28px]">
              {card.prefix}
              {stats ? formatNum(stats[card.key]) : '0'}
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
    </div>
  );
}

function formatNum(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toFixed(n % 1 === 0 ? 0 : 2);
}
