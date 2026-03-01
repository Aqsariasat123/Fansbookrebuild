import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { StatCard } from '../../components/admin/StatCard';
import { DashboardChart } from '../../components/admin/DashboardChart';

interface DashboardData {
  totalUsers: number;
  totalFans: number;
  totalCreators: number;
  activeUsers24h: number;
  totalPosts: number;
  totalMessages: number;
  totalRevenue: number;
  pendingWithdrawals: number;
  pendingReports: number;
  totalSubscriptions: number;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/dashboard')
      .then(({ data: res }) => {
        if (res.success) setData(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-[60px]">
        <div className="size-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-center py-[40px] text-[#999]">Failed to load dashboard data</p>;
  }

  return (
    <div>
      <p className="mb-[24px] font-outfit text-[32px] font-normal text-black">Dashboard</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[16px] mb-[24px]">
        <StatCard icon="👥" label="Total Users" value={data.totalUsers} color="#01adf1" />
        <StatCard icon="🎭" label="Fans" value={data.totalFans} color="#8b5cf6" />
        <StatCard icon="⭐" label="Creators" value={data.totalCreators} color="#f59e0b" />
        <StatCard icon="🟢" label="Active (24h)" value={data.activeUsers24h} color="#10b981" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-[16px] mb-[24px]">
        <StatCard icon="📝" label="Total Posts" value={data.totalPosts} color="#3b82f6" />
        <StatCard icon="💬" label="Messages" value={data.totalMessages} color="#6366f1" />
        <StatCard
          icon="💰"
          label="Total Revenue"
          value={`$${Number(data.totalRevenue).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          color="#10b981"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-[16px] mb-[24px]">
        <StatCard
          icon="📋"
          label="Active Subscriptions"
          value={data.totalSubscriptions}
          color="#0ea5e9"
        />
        <StatCard
          icon="⏳"
          label="Pending Withdrawals"
          value={data.pendingWithdrawals}
          color={data.pendingWithdrawals > 0 ? '#ef4444' : '#10b981'}
        />
        <StatCard
          icon="🚩"
          label="Pending Reports"
          value={data.pendingReports}
          color={data.pendingReports > 0 ? '#ef4444' : '#10b981'}
        />
      </div>

      <DashboardChart />
    </div>
  );
}
