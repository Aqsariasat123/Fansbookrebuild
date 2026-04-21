import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

interface SidebarBadges {
  wallet: number;
  sales: number;
  referrals: number;
  subscriptions: number;
}

export function useSidebarBadges() {
  const { data } = useQuery<SidebarBadges>({
    queryKey: ['sidebar-badges'],
    queryFn: async () => {
      const res = await api.get('/sidebar-badges');
      return res.data.data as SidebarBadges;
    },
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
  return data ?? { wallet: 0, sales: 0, referrals: 0, subscriptions: 0 };
}
