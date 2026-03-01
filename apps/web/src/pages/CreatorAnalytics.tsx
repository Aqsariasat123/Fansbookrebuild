import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { BarChart } from '../components/analytics/BarChart';
import { TopPostsList } from '../components/analytics/TopPostsList';

interface MonthData {
  month: string;
  earnings?: number;
  count?: number;
}
interface TopPost {
  id: string;
  text: string | null;
  likeCount: number;
  commentCount: number;
}
interface AnalyticsData {
  earningsHistory: MonthData[];
  subscriberGrowth: MonthData[];
  topPosts: TopPost[];
}

const PERIODS = [
  { label: '7d', value: '7d' },
  { label: '30d', value: '30d' },
  { label: '90d', value: '90d' },
  { label: 'All Time', value: 'all' },
] as const;

type Period = (typeof PERIODS)[number]['value'];

export default function CreatorAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>('30d');

  useEffect(() => {
    setLoading(true);
    api
      .get(`/creator/dashboard/analytics?period=${period}`)
      .then((res) => setData(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="flex flex-col gap-[12px] md:flex-row md:items-center md:justify-between">
        <p className="text-[20px] text-foreground">Analytics</p>
        <div className="flex gap-[8px]">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`rounded-[50px] px-[16px] py-[6px] text-[12px] font-medium transition-colors md:text-[14px] ${
                period === p.value
                  ? 'bg-gradient-to-r from-[#01adf1] to-[#a61651] text-white'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-foreground border-t-transparent" />
        </div>
      ) : (
        <>
          <BarChart
            title="Earnings"
            data={(data?.earningsHistory || []).map((d) => ({
              label: d.month,
              value: d.earnings || 0,
            }))}
            prefix="$"
            gradient
          />
          <BarChart
            title="Subscriber Growth"
            data={(data?.subscriberGrowth || []).map((d) => ({
              label: d.month,
              value: d.count || 0,
            }))}
          />
          <TopPostsList posts={data?.topPosts || []} />
        </>
      )}
    </div>
  );
}
