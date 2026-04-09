import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

interface Suggestion {
  id: string;
  type: string;
  title: string;
  priority: string;
}

const PRIORITY_COLOR: Record<string, string> = {
  HIGH: 'text-red-500',
  MEDIUM: 'text-amber-500',
  LOW: 'text-green-500',
};

const TYPE_ICON: Record<string, string> = {
  POST_TIMING: '🕐',
  FAN_ENGAGEMENT: '💬',
  PPV_OPPORTUNITY: '💰',
  REENGAGEMENT: '🔄',
  CONTENT_STRATEGY: '📈',
};

export default function UpsellWidget() {
  const [items, setItems] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/creator/ai/upsell')
      .then(({ data: r }) => {
        if (r.success) {
          const high = (r.data as Suggestion[]).filter((s) => s.priority === 'HIGH').slice(0, 2);
          setItems(high.length > 0 ? high : (r.data as Suggestion[]).slice(0, 2));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (items.length === 0) return null;

  return (
    <div className="rounded-[22px] bg-card p-[20px]">
      <div className="flex items-center justify-between mb-[14px]">
        <p className="text-[16px] text-foreground font-medium">AI Revenue Tips</p>
        <Link to="/creator/upsell" className="text-[12px] text-primary hover:underline">
          View all
        </Link>
      </div>
      <div className="flex flex-col gap-[10px]">
        {items.map((s) => (
          <div key={s.id} className="flex items-start gap-[10px] rounded-[12px] bg-muted p-[12px]">
            <span className="text-[18px] mt-[1px]">{TYPE_ICON[s.type] ?? '💡'}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-foreground font-medium leading-snug">{s.title}</p>
              <p
                className={`text-[11px] font-semibold mt-[2px] ${PRIORITY_COLOR[s.priority] ?? 'text-muted-foreground'}`}
              >
                {s.priority} PRIORITY
              </p>
            </div>
          </div>
        ))}
      </div>
      <Link
        to="/creator/upsell"
        className="mt-[12px] block text-center text-[13px] font-medium text-primary hover:underline"
      >
        See all suggestions →
      </Link>
    </div>
  );
}
