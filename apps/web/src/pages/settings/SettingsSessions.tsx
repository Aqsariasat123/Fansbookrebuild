import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

interface SessionItem {
  id: string;
  deviceInfo: string | null;
  ipAddress: string | null;
  lastActive: string;
  createdAt: string;
}

export function SettingsSessions() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/settings/sessions')
      .then((res) => setSessions(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const revoke = async (id: string) => {
    try {
      await api.delete(`/settings/sessions/${id}`);
      setSessions((p) => p.filter((s) => s.id !== id));
    } catch {
      /* ignore */
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[16px]">
      <p className="text-[16px] text-foreground">Active Sessions</p>
      {sessions.length === 0 ? (
        <p className="text-[14px] text-muted-foreground">No active sessions</p>
      ) : (
        sessions.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between rounded-[12px] bg-muted p-[14px]"
          >
            <div>
              <p className="text-[14px] text-foreground">{s.deviceInfo || 'Unknown Device'}</p>
              <p className="text-[12px] text-muted-foreground">
                {s.ipAddress || 'Unknown IP'} &middot; Last active{' '}
                {new Date(s.lastActive).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => revoke(s.id)}
              className="rounded-[8px] bg-red-500/20 px-3 py-1 text-[12px] text-red-400 hover:bg-red-500/30"
            >
              Revoke
            </button>
          </div>
        ))
      )}
    </div>
  );
}
