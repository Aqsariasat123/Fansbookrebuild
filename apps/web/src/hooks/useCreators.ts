import { useQuery } from '@tanstack/react-query';
import type { CreatorsFilterParams } from '@fansbook/shared';
import { getCreatorsApi, getCreatorFiltersApi } from '../lib/creators';

export function useCreators(filters: CreatorsFilterParams) {
  return useQuery({
    queryKey: ['creators', filters],
    queryFn: () => getCreatorsApi(filters),
  });
}

export function useCreatorFilters() {
  return useQuery({
    queryKey: ['creator-filters'],
    queryFn: getCreatorFiltersApi,
    staleTime: 1000 * 60 * 30, // 30 min cache
  });
}
