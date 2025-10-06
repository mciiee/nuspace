import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { Community } from '@/features/campuscurrent/communities/types';
import * as Routes from '@/data/routes';

export function useVirtualCommunities(keyword: string = "") {
  return useInfiniteScroll<Community>({
    queryKey: ["campusCurrent", "communities"],
    apiEndpoint: `/${Routes.COMMUNITIES}`,
    size: 12,
    keyword,
    additionalParams: {},
    estimateSize: () => 200, // Estimate each community card to be 200px tall
    overscan: 4, // Only render 4 items outside viewport
  });
}

