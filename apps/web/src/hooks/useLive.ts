import { useQuery } from '@tanstack/react-query';
import type { LiveFilterParams } from '@fansbook/shared';
import { getLiveSessionsApi, getUpcomingLivesApi } from '../lib/live';

export function useLiveSessions(filters?: LiveFilterParams) {
  return useQuery({
    queryKey: ['live-sessions', filters],
    queryFn: () => getLiveSessionsApi(filters),
  });
}

export function useUpcomingLives() {
  return useQuery({
    queryKey: ['upcoming-lives'],
    queryFn: getUpcomingLivesApi,
    staleTime: 1000 * 60 * 5,
  });
}
