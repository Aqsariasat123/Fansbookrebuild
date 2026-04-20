import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { SuggestionCard, EmptyState } from './UpsellAdvisorParts';
import type { Suggestion, PriorityFilter } from './UpsellAdvisorParts';

export default function UpsellAdvisor() {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dismissing, setDismissing] = useState<string | null>(null);
  const [filter, setFilter] = useState<PriorityFilter>('ALL');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const load = useCallback((endpoint = '/creator/ai/upsell') => {
    return api.get(endpoint).then(({ data: r }) => {
      if (r.success) {
        setSuggestions(r.data as Suggestion[]);
        if ((r.data as Suggestion[]).length > 0) {
          setLastUpdated((r.data as Suggestion[])[0].createdAt);
        }
      }
    });
  }, []);

  useEffect(() => {
    load()
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [load]);

  async function handleRefresh() {
    setRefreshing(true);
    await api
      .post('/creator/ai/upsell/refresh')
      .then(({ data: r }) => {
        if (r.success) setSuggestions(r.data as Suggestion[]);
      })
      .catch(() => {});
    setRefreshing(false);
  }

  async function handleDismiss(id: string) {
    setDismissing(id);
    await api.post(`/creator/ai/upsell/${id}/dismiss`).catch(() => {});
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
    setDismissing(null);
  }

  const filtered =
    filter === 'ALL' ? suggestions : suggestions.filter((s) => s.priority === filter);
  const counts = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  suggestions.forEach((s) => {
    if (s.priority in counts) counts[s.priority as keyof typeof counts]++;
  });

  return (
    <div className="flex flex-col gap-[20px] max-w-[720px]">
      <div className="flex items-start justify-between gap-[12px]">
        <div>
          <p className="text-[20px] font-bold text-foreground">AI Revenue Advisor</p>
          <p className="text-[13px] text-muted-foreground mt-[2px]">
            Personalised suggestions to grow your revenue
          </p>
          {lastUpdated && (
            <p className="text-[11px] text-muted-foreground mt-[2px]">
              Last updated {new Date(lastUpdated).toLocaleString()}
            </p>
          )}
        </div>
        <button
          disabled={refreshing}
          onClick={handleRefresh}
          className="flex items-center gap-[6px] rounded-full border border-border px-[16px] py-[8px] text-[13px] font-medium text-foreground disabled:opacity-50"
        >
          {refreshing ? 'Generating…' : 'Refresh'}
        </button>
      </div>

      <div className="flex gap-[8px] flex-wrap">
        {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as PriorityFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-[14px] py-[6px] rounded-full text-[12px] font-medium border transition-colors ${filter === f ? 'bg-foreground text-background border-foreground' : 'bg-card text-muted-foreground border-border hover:border-foreground'}`}
          >
            {f === 'ALL'
              ? `All (${suggestions.length})`
              : `${f} (${counts[f as keyof typeof counts]})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-[60px]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-foreground border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        <div className="flex flex-col gap-[12px]">
          {filtered.map((s) => (
            <SuggestionCard
              key={s.id}
              s={s}
              onDismiss={handleDismiss}
              onAction={(route) => navigate(route)}
              dismissing={dismissing === s.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
