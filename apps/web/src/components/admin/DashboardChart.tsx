import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

interface ChartPoint {
  date: string;
  count: number;
}

const METRICS = [
  { key: 'users', label: 'Users' },
  { key: 'posts', label: 'Posts' },
  { key: 'revenue', label: 'Revenue' },
  { key: 'messages', label: 'Messages' },
];

const PERIODS = [
  { key: '7d', label: '7 Days' },
  { key: '30d', label: '30 Days' },
  { key: '90d', label: '90 Days' },
];

export function DashboardChart() {
  const [metric, setMetric] = useState('users');
  const [period, setPeriod] = useState('30d');
  const [points, setPoints] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/admin/dashboard/chart?metric=${metric}&period=${period}`)
      .then(({ data: res }) => {
        if (res.success) setPoints(res.data.points);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [metric, period]);

  const maxVal = Math.max(...points.map((p) => p.count), 1);
  const chartHeight = 200;

  return (
    <div className="rounded-[16px] bg-white p-[24px] shadow-sm border border-[#e8e8e8]">
      <div className="flex items-center justify-between mb-[20px] flex-wrap gap-[10px]">
        <h3 className="font-outfit text-[18px] font-semibold text-black">Analytics</h3>
        <div className="flex gap-[8px]">
          {METRICS.map((m) => (
            <button
              key={m.key}
              onClick={() => setMetric(m.key)}
              className={`px-[12px] py-[4px] rounded-[20px] text-[12px] font-outfit transition-colors ${
                metric === m.key
                  ? 'bg-gradient-to-r from-[#01adf1] to-[#a61651] text-white'
                  : 'bg-[#f0f0f0] text-[#5d5d5d] hover:bg-[#e0e0e0]'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="flex gap-[6px]">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-[10px] py-[3px] rounded-[12px] text-[11px] font-outfit ${
                period === p.key ? 'bg-black text-white' : 'bg-[#f0f0f0] text-[#5d5d5d]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-[40px]">
          <div className="size-6 animate-spin rounded-full border-3 border-[#01adf1] border-t-transparent" />
        </div>
      ) : (
        <div className="relative" style={{ height: chartHeight + 30 }}>
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-[30px] w-[40px] flex flex-col justify-between text-[10px] text-[#999]">
            <span>{maxVal}</span>
            <span>{Math.round(maxVal / 2)}</span>
            <span>0</span>
          </div>
          {/* Bars */}
          <div className="ml-[45px] flex items-end gap-[2px]" style={{ height: chartHeight }}>
            {points.map((p, i) => {
              const h = (p.count / maxVal) * chartHeight;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-t-[3px] bg-gradient-to-t from-[#01adf1] to-[#5bc4f0] hover:opacity-80 transition-opacity relative group"
                  style={{ height: Math.max(h, 1) }}
                >
                  <div className="absolute -top-[24px] left-1/2 -translate-x-1/2 hidden group-hover:block bg-black text-white text-[10px] px-[6px] py-[2px] rounded whitespace-nowrap">
                    {p.count}
                  </div>
                </div>
              );
            })}
          </div>
          {/* X-axis labels */}
          <div className="ml-[45px] flex justify-between mt-[6px] text-[9px] text-[#999]">
            {points.length > 0 && <span>{points[0].date.slice(5)}</span>}
            {points.length > 1 && (
              <span>{points[Math.floor(points.length / 2)].date.slice(5)}</span>
            )}
            {points.length > 2 && <span>{points[points.length - 1].date.slice(5)}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
