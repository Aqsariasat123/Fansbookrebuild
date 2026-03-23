import { api } from '../lib/api';

export interface AIConfig {
  suggestEnabled: boolean;
  polishEnabled: boolean;
  persona: string | null;
  toneProfile: string | null;
  greeting: string | null;
}

export interface UsageStats {
  inputTokens: number;
  outputTokens: number;
  cost: number;
  byFeature: Record<string, { count: number; cost: number }>;
}

export function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-[16px] py-[16px] border-b border-muted last:border-0">
      <div>
        <p className="text-[14px] font-medium text-foreground">{label}</p>
        <p className="text-[12px] text-muted-foreground mt-[2px]">{description}</p>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onChange(!checked);
        }}
        className={`shrink-0 relative w-[48px] h-[26px] rounded-full overflow-hidden transition-colors duration-200 ${checked ? 'bg-[#2e80c8]' : 'bg-muted'}`}
      >
        <span
          className={`pointer-events-none absolute top-[3px] left-[3px] size-[20px] rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? 'translate-x-[22px]' : 'translate-x-0'}`}
        />
      </button>
    </div>
  );
}

export function UsageCard({ usage }: { usage: UsageStats | null }) {
  if (!usage) return null;
  const totalCost = usage.cost ?? 0;
  const suggestCount = usage.byFeature?.suggest_reply?.count ?? 0;
  const polishCount = usage.byFeature?.polish?.count ?? 0;

  return (
    <div className="bg-muted/50 rounded-[12px] p-[16px] mb-[24px]">
      <p className="text-[12px] text-muted-foreground mb-[8px] font-medium uppercase tracking-wide">
        This Month
      </p>
      <div className="flex gap-[24px]">
        <div>
          <p className="text-[20px] font-bold text-foreground">{suggestCount}</p>
          <p className="text-[11px] text-muted-foreground">Suggestions used</p>
        </div>
        <div>
          <p className="text-[20px] font-bold text-foreground">{polishCount}</p>
          <p className="text-[11px] text-muted-foreground">Polishes used</p>
        </div>
        <div>
          <p className="text-[20px] font-bold text-foreground">€{totalCost.toFixed(3)}</p>
          <p className="text-[11px] text-muted-foreground">API cost</p>
        </div>
      </div>
    </div>
  );
}

export function ToneProfileCard({
  toneProfile,
  refreshingTone,
  onRefresh,
}: {
  toneProfile: string | null;
  refreshingTone: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="bg-card border border-muted rounded-[12px] p-[16px] mb-[24px]">
      <div className="flex items-start justify-between gap-[12px]">
        <div>
          <p className="text-[14px] font-medium text-foreground">Auto-learned Tone Profile</p>
          <p className="text-[12px] text-muted-foreground mt-[2px]">
            AI analyzes your past messages to match your natural writing style.
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshingTone}
          className="shrink-0 rounded-[8px] border border-muted px-[12px] py-[6px] text-[12px] text-foreground hover:bg-muted disabled:opacity-50 transition-colors"
        >
          {refreshingTone ? 'Analyzing...' : 'Refresh'}
        </button>
      </div>
      {toneProfile ? (
        <p className="mt-[12px] text-[13px] text-muted-foreground bg-muted/50 rounded-[8px] p-[10px]">
          {toneProfile}
        </p>
      ) : (
        <p className="mt-[12px] text-[12px] text-muted-foreground italic">
          No tone profile yet. Send at least 10 messages then click Refresh.
        </p>
      )}
    </div>
  );
}

export async function fetchAISettings(): Promise<AIConfig> {
  const { data: r } = await api.get('/creator/ai/settings');
  return r.success
    ? r.data
    : { suggestEnabled: true, polishEnabled: true, persona: '', toneProfile: null, greeting: '' };
}

export async function fetchUsage(month: string): Promise<UsageStats | null> {
  const { data: r } = await api.get(`/creator/ai/usage?month=${month}`);
  return r.success ? r.data : null;
}

export async function saveAISettings(config: AIConfig): Promise<boolean> {
  const { data: r } = await api.post('/creator/ai/settings', {
    suggestEnabled: config.suggestEnabled,
    polishEnabled: config.polishEnabled,
    persona: config.persona ?? '',
    greeting: config.greeting ?? '',
  });
  return r.success;
}

export async function refreshToneProfile(): Promise<string | null> {
  const { data: r } = await api.post('/creator/ai/tone-refresh');
  return r.success ? r.data.toneProfile : null;
}
