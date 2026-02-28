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

export default function CreatorAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/creator/dashboard/analytics')
      .then((res) => setData(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[20px]">
      <p className="text-[20px] text-foreground">Analytics</p>
      <BarChart
        title="Earnings (Last 6 Months)"
        data={(data?.earningsHistory || []).map((d) => ({
          label: d.month,
          value: d.earnings || 0,
        }))}
        prefix="$"
        gradient
      />
      <BarChart
        title="Subscriber Growth"
        data={(data?.subscriberGrowth || []).map((d) => ({ label: d.month, value: d.count || 0 }))}
      />
      <TopPostsList posts={data?.topPosts || []} />
    </div>
  );
}
