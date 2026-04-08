import { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';

export interface ModerationLabel {
  name: string;
  confidence: number;
  parentName?: string;
}

export interface MediaItem {
  id: string;
  url: string;
  type: string;
  moderationScore: number | null;
  moderationLabels: ModerationLabel[] | null;
  createdAt: string;
  post: {
    id: string;
    author: { username: string; displayName: string; avatar: string | null };
  };
}

export interface ModerationStats {
  flagged: number;
  pending: number;
  safe: number;
  skipped: number;
}

export type StatusFilter = 'FLAGGED' | 'PENDING' | 'SAFE';

export function useModerationData(filter: StatusFilter, page: number) {
  const [stats, setStats] = useState<ModerationStats | null>(null);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(() => {
    api
      .get('/admin/moderation/stats')
      .then(({ data: r }) => {
        if (r.success) setStats(r.data as ModerationStats);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/admin/moderation?status=${filter}&page=${page}`)
      .then(({ data: r }) => {
        if (r.success) {
          setItems(r.data.items as MediaItem[]);
          setTotal(r.data.total as number);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter, page]);

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  return { stats, items, total, loading, loadStats, removeItem };
}
