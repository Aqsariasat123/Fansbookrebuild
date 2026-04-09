import { useEffect, useState, useCallback } from 'react';
import { api } from '../../lib/api';

interface Suggestion {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: string;
  actionLabel: string | null;
  createdAt: string;
}

type PriorityFilter = 'ALL' | 'HIGH' | 'MEDIUM' | 'LOW';

const PRIORITY_COLOR: Record<string, string> = {
  HIGH: 'bg-red-100 text-red-700 border-red-200',
  MEDIUM: 'bg-amber-100 text-amber-700 border-amber-200',
  LOW: 'bg-green-100 text-green-700 border-green-200',
};

const TYPE_LABEL: Record<string, string> = {
  POST_TIMING: 'Post Timing',
  FAN_ENGAGEMENT: 'Fan Engagement',
  PPV_OPPORTUNITY: 'PPV Opportunity',
  REENGAGEMENT: 'Re-engagement',
  CONTENT_STRATEGY: 'Content Strategy',
};

const TYPE_ICON: Record<string, string> = {
  POST_TIMING: '🕐',
  FAN_ENGAGEMENT: '💬',
  PPV_OPPORTUNITY: '💰',
  REENGAGEMENT: '🔄',
  CONTENT_STRATEGY: '📈',
};

function SuggestionCard({
  s,
  onDismiss,
  dismissing,
}: {
  s: Suggestion;
  onDismiss: (id: string) => void;
  dismissing: boolean;
}) {
  return (
    <div className="rounded-[16px] bg-card border border-border p-[20px] flex flex-col gap-[12px]">
      <div className="flex items-start justify-between gap-[10px]">
        <div className="flex items-center gap-[10px]">
          <span className="text-[24px]">{TYPE_ICON[s.type] ?? '💡'}</span>
          <div>
            <p className="text-[14px] font-semibold text-foreground leading-snug">{s.title}</p>
            <p className="text-[11px] text-muted-foreground mt-[2px]">
              {TYPE_LABEL[s.type] ?? s.type}
            </p>
          </div>
        </div>
        <span
          className={`text-[11px] font-bold px-[8px] py-[3px] rounded-full border ${PRIORITY_COLOR[s.priority] ?? ''}`}
        >
          {s.priority}
        </span>
      </div>
      <p className="text-[13px] text-muted-foreground leading-relaxed">{s.description}</p>
      <div className="flex items-center gap-[8px] pt-[4px]">
        {s.actionLabel && (
          <button className="flex-1 rounded-full bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[16px] py-[8px] text-[13px] font-medium text-white">
            {s.actionLabel}
          </button>
        )}
        <button
          disabled={dismissing}
          onClick={() => onDismiss(s.id)}
          className="px-[16px] py-[8px] rounded-full border border-border text-[13px] text-muted-foreground hover:text-foreground disabled:opacity-40"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

function EmptyState({ filter }: { filter: PriorityFilter }) {
  return (
    <div className="rounded-[16px] bg-card border border-border py-[60px] text-center">
      <p className="text-[32px] mb-[12px]">✨</p>
      <p className="text-[15px] font-medium text-foreground">
        {filter === 'ALL'
          ? 'No suggestions right now'
          : `No ${filter.toLowerCase()} priority suggestions`}
      </p>
      <p className="text-[13px] text-muted-foreground mt-[4px]">
        All caught up! Refresh to generate new AI insights.
      </p>
    </div>
  );
}

export default function UpsellAdvisor() {
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
              dismissing={dismissing === s.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
