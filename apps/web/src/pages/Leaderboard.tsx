import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

type LeaderType = 'subscribers' | 'earnings' | 'posts' | 'rising';
type Period = 'week' | 'month' | 'all';

const TYPES: { label: string; value: LeaderType }[] = [
  { label: 'Top Creators', value: 'subscribers' },
  { label: 'Top Earners', value: 'earnings' },
  { label: 'Most Active', value: 'posts' },
  { label: 'Rising Stars', value: 'rising' },
];

const PERIODS: { label: string; value: Period }[] = [
  { label: 'Weekly', value: 'week' },
  { label: 'Monthly', value: 'month' },
  { label: 'All Time', value: 'all' },
];

interface LeaderEntry {
  rank: number;
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  isVerified: boolean;
  value: number;
}

export default function Leaderboard() {
  const [type, setType] = useState<LeaderType>('subscribers');
  const [period, setPeriod] = useState<Period>('month');
  const [entries, setEntries] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/leaderboard?type=${type}&period=${period}`)
      .then(({ data: r }) => setEntries(r.data))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [type, period]);

  const getValueLabel = () => {
    if (type === 'subscribers') return 'Followers';
    if (type === 'earnings') return 'Earned';
    if (type === 'posts') return 'Posts';
    return 'New Followers';
  };

  return (
    <div className="flex flex-col gap-[20px]">
      <p className="text-[24px] font-semibold text-foreground">Leaderboard</p>

      {/* Type tabs */}
      <div className="flex gap-[8px] overflow-x-auto">
        {TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => setType(t.value)}
            className={`shrink-0 rounded-[50px] px-[16px] py-[6px] text-[12px] font-medium md:text-[14px] ${
              type === t.value
                ? 'bg-gradient-to-r from-[#01adf1] to-[#a61651] text-white'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Period filter */}
      <div className="flex gap-[8px]">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`text-[13px] ${period === p.value ? 'text-[#01adf1] font-medium' : 'text-muted-foreground'}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-[60px]">
          <div className="size-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
        </div>
      ) : entries.length === 0 ? (
        <p className="py-[40px] text-center text-[14px] text-muted-foreground">No data available</p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto rounded-[16px] md:block">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#00b4d8] to-[#0096c7]">
                  {['Rank', 'Creator', getValueLabel()].map((h) => (
                    <th
                      key={h}
                      className="px-[14px] py-[14px] text-left text-[13px] font-semibold text-white"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-card">
                {entries.map((e) => (
                  <tr key={e.id} className="border-b border-muted last:border-0">
                    <td className="px-[14px] py-[12px]">
                      <span
                        className={`text-[16px] font-bold ${e.rank <= 3 ? 'text-[#01adf1]' : 'text-foreground'}`}
                      >
                        #{e.rank}
                      </span>
                    </td>
                    <td className="px-[14px] py-[12px]">
                      <Link
                        to={`/u/${e.username}`}
                        className="flex items-center gap-[10px] hover:opacity-80"
                      >
                        <div className="size-[36px] shrink-0 overflow-hidden rounded-full">
                          {e.avatar ? (
                            <img src={e.avatar} alt="" className="size-full object-cover" />
                          ) : (
                            <div className="flex size-full items-center justify-center bg-gradient-to-br from-[#01adf1] to-[#a61651] text-[12px] text-white">
                              {e.displayName[0]}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-[4px]">
                            <span className="text-[14px] text-foreground">{e.displayName}</span>
                            {e.isVerified && (
                              <img
                                src="/icons/dashboard/verified.svg"
                                alt=""
                                className="size-[14px]"
                              />
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground">@{e.username}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-[14px] py-[12px] text-[14px] font-medium text-foreground">
                      {type === 'earnings' ? `$${e.value.toFixed(2)}` : e.value.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-[8px] md:hidden">
            {entries.map((e) => (
              <Link
                key={e.id}
                to={`/u/${e.username}`}
                className="flex items-center gap-[12px] rounded-[12px] bg-card p-[12px]"
              >
                <span
                  className={`min-w-[28px] text-[16px] font-bold ${e.rank <= 3 ? 'text-[#01adf1]' : 'text-muted-foreground'}`}
                >
                  #{e.rank}
                </span>
                <div className="size-[36px] shrink-0 overflow-hidden rounded-full">
                  {e.avatar ? (
                    <img src={e.avatar} alt="" className="size-full object-cover" />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-gradient-to-br from-[#01adf1] to-[#a61651] text-[12px] text-white">
                      {e.displayName[0]}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-foreground">{e.displayName}</p>
                  <p className="text-[11px] text-muted-foreground">@{e.username}</p>
                </div>
                <span className="text-[14px] font-medium text-[#01adf1]">
                  {type === 'earnings' ? `$${e.value.toFixed(2)}` : e.value}
                </span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
