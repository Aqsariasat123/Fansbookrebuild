import { useQuery } from '@tanstack/react-query';
import type { LiveFilterParams } from '@fansbook/shared';
import { getLiveSessionsApi, getFollowingLiveApi, getUpcomingLivesApi } from '../lib/live';

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
