import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

interface CreatorRow {
  id: string;
  username: string;
  displayName: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  byFeature: Record<string, number>;
  lastUsed: string;
}

interface UsageData {
  month: string;
  totals: { inputTokens: number; outputTokens: number; cost: number };
  byFeature: Record<string, { count: number; cost: number }>;
  byCreator: CreatorRow[];
}

function MonthPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const months: string[] = [];
  const now = new Date();
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d.toISOString().slice(0, 7));
  }
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-[8px] border border-gray-200 bg-white px-[12px] py-[6px] text-[13px] text-gray-900 outline-none"
    >
      {months.map((m) => (
        <option key={m} value={m}>
          {m}
        </option>
      ))}
    </select>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-[12px] border border-gray-200 bg-white p-[20px]">
      <p className="text-[12px] text-gray-500 uppercase tracking-wide mb-[6px]">{label}</p>
      <p className="text-[26px] font-bold text-gray-900">{value}</p>
      {sub && <p className="text-[12px] text-gray-500 mt-[2px]">{sub}</p>}
    </div>
  );
}

function CreatorTableRow({ row }: { row: CreatorRow }) {
  const rowTokens = row.inputTokens + row.outputTokens;
  const isHigh = row.cost > 5;
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="px-[20px] py-[12px]">
        <p className="font-medium text-gray-900 text-[13px]">{row.displayName}</p>
        <p className="text-gray-500 text-[12px]">@{row.username}</p>
      </td>
      <td className="px-[16px] py-[12px] text-gray-300 text-[13px]">
        {row.byFeature.suggest_reply ?? 0}
      </td>
      <td className="px-[16px] py-[12px] text-gray-300 text-[13px]">{row.byFeature.polish ?? 0}</td>
      <td className="px-[16px] py-[12px] text-gray-300 text-[13px]">
        {rowTokens.toLocaleString()}
      </td>
      <td className="px-[16px] py-[12px] text-[13px]">
        <span className={`font-semibold ${isHigh ? 'text-red-400' : 'text-green-400'}`}>
          €{row.cost.toFixed(3)}
        </span>
        {isHigh && (
          <span className="ml-[6px] text-[11px] bg-red-900/50 text-red-400 px-[6px] py-[2px] rounded-full">
            High
          </span>
        )}
      </td>
      <td className="px-[16px] py-[12px] text-gray-500 text-[13px]">
        {new Date(row.lastUsed).toLocaleDateString()}
      </td>
    </tr>
  );
}

function CreatorTable({ data, loading }: { data: UsageData | null; loading: boolean }) {
  return (
    <div className="rounded-[12px] border border-gray-200 overflow-hidden">
      <div className="px-[20px] py-[14px] border-b border-gray-700 flex items-center justify-between">
        <p className="text-[14px] font-semibold text-gray-900">By Creator</p>
        <p className="text-[12px] text-gray-500">{data?.byCreator.length ?? 0} creators active</p>
      </div>
      {loading ? (
        <div className="flex justify-center py-[40px]">
          <div className="size-6 animate-spin rounded-full border-4 border-[#2e80c8] border-t-transparent" />
        </div>
      ) : !data?.byCreator.length ? (
        <p className="text-center text-[13px] text-gray-500 py-[40px]">
          No AI usage recorded for {data?.month}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 text-left text-[13px] text-gray-500">
                <th className="px-[20px] py-[10px] font-medium">Creator</th>
                <th className="px-[16px] py-[10px] font-medium">Suggestions</th>
                <th className="px-[16px] py-[10px] font-medium">Polishes</th>
                <th className="px-[16px] py-[10px] font-medium">Tokens</th>
                <th className="px-[16px] py-[10px] font-medium">Cost</th>
                <th className="px-[16px] py-[10px] font-medium">Last Used</th>
              </tr>
            </thead>
            <tbody>
              {data.byCreator.map((row) => (
                <CreatorTableRow key={row.id} row={row} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function getFeatureCount(data: UsageData | null, feature: string): number {
  if (!data) return 0;
  const f = data.byFeature[feature];
  return f ? f.count : 0;
}

function getTotalCost(data: UsageData | null): number {
  return data ? data.totals.cost : 0;
}

function getTotalTokens(data: UsageData | null): number {
  if (!data) return 0;
  return data.totals.inputTokens + data.totals.outputTokens;
}

async function fetchUsage(month: string, setData: (d: UsageData) => void) {
  const { data: r } = await api.get(`/admin/ai/usage?month=${month}`);
  if (r.success) setData(r.data as UsageData);
}

export default function AdminAIUsage() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchUsage(month, setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [month]);

  const suggestCount = getFeatureCount(data, 'suggest_reply');
  const polishCount = getFeatureCount(data, 'polish');
  const totalCost = getTotalCost(data);
  const totalTokens = getTotalTokens(data);

  return (
    <div className="p-[24px] md:p-[32px]">
      <div className="flex items-center justify-between flex-wrap gap-[12px] mb-[28px]">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900">AI Usage Dashboard</h1>
          <p className="text-[13px] text-gray-500 mt-[2px]">
            Platform-wide AI feature usage and cost tracking
          </p>
        </div>
        <MonthPicker value={month} onChange={setMonth} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px] mb-[28px]">
        <StatCard
          label="Total Cost"
          value={`€${totalCost.toFixed(3)}`}
          sub={totalCost > 5 ? '⚠️ Above €5 threshold' : 'Within budget'}
        />
        <StatCard label="Total Tokens" value={totalTokens.toLocaleString()} />
        <StatCard label="Suggestions" value={String(suggestCount)} sub="suggest_reply calls" />
        <StatCard label="Polishes" value={String(polishCount)} sub="polish calls" />
      </div>

      <CreatorTable data={data} loading={loading} />
    </div>
  );
}
