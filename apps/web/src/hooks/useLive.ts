import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { LiveFilterParams } from '@fansbook/shared';
import { getLiveSessionsApi, getFollowingLiveApi, getUpcomingLivesApi } from '../lib/live';
import { getSocket } from '../lib/socket';
import { useSocketStore } from '../stores/socketStore';
import { api } from '../lib/api';

export function useLiveSessions(filters?: LiveFilterParams) {
  return useQuery({
    queryKey: ['live-sessions', filters],
    queryFn: () => getLiveSessionsApi(filters),
  });
}

export function useFollowingLive() {
  return useQuery({
    queryKey: ['following-live'],
    queryFn: getFollowingLiveApi,
  });
}

export function useUpcomingLives() {
  return useQuery({
    queryKey: ['upcoming-lives'],
    queryFn: getUpcomingLivesApi,
    staleTime: 1000 * 60 * 5,
  });
}

// Auto-refresh live sessions list when a stream starts or ends.
// Re-runs when socket connects/reconnects so listeners are never missed.
export function useLiveSessionsSync() {
  const qc = useQueryClient();
  const isConnected = useSocketStore((s) => s.isConnected);
  useEffect(() => {
    if (!isConnected) return;
    const socket = getSocket();
    if (!socket) return;
    const invalidate = () => {
      qc.invalidateQueries({ queryKey: ['live-sessions'] });
      qc.invalidateQueries({ queryKey: ['following-live'] });
    };
    socket.on('live:new-session', invalidate);
    socket.on('live:session-ended', invalidate);
    return () => {
      socket.off('live:new-session', invalidate);
      socket.off('live:session-ended', invalidate);
    };
  }, [qc, isConnected]);
}

// Watches for live events and calls setSessionId with updated value
export function useCreatorLiveSync(
  profile: { id: string } | null,
  setSessionId: (id: string | null) => void,
) {
  const creatorId = profile?.id;
  const isConnected = useSocketStore((s) => s.isConnected);
  useEffect(() => {
    if (!creatorId || !isConnected) return;
    const socket = getSocket();
    if (!socket) return;
    const refresh = () => {
      api
        .get('/live')
        .then(({ data }: { data: { data?: { creatorId: string; id: string }[] } }) => {
          const s = (data.data ?? []).find((x) => x.creatorId === creatorId);
          setSessionId(s ? s.id : null);
        })
        .catch(() => {});
    };
    socket.on('live:new-session', refresh);
    socket.on('live:session-ended', refresh);
    return () => {
      socket.off('live:new-session', refresh);
      socket.off('live:session-ended', refresh);
    };
  }, [creatorId, setSessionId, isConnected]);
}
