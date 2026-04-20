export interface Suggestion {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: string;
  actionLabel: string | null;
  actionData: { route?: string } | null;
  createdAt: string;
}

export type PriorityFilter = 'ALL' | 'HIGH' | 'MEDIUM' | 'LOW';

const TYPE_ROUTE: Record<string, string> = {
  POST_TIMING: '/creator/post/new',
  FAN_ENGAGEMENT: '/creator/messages',
  PPV_OPPORTUNITY: '/creator/post/new',
  REENGAGEMENT: '/creator/messages',
  CONTENT_STRATEGY: '/creator/post/new',
};

export function getActionRoute(s: Suggestion): string {
  return s.actionData?.route ?? TYPE_ROUTE[s.type] ?? '/creator/post/new';
}

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

export function SuggestionCard({
  s,
  onDismiss,
  onAction,
  dismissing,
}: {
  s: Suggestion;
  onDismiss: (id: string) => void;
  onAction: (route: string) => void;
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
          <button
            onClick={() => onAction(getActionRoute(s))}
            className="flex-1 rounded-full bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[16px] py-[8px] text-[13px] font-medium text-white transition-opacity hover:opacity-90"
          >
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

export function EmptyState({ filter }: { filter: PriorityFilter }) {
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
