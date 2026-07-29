import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api';
import { fetchAuctionsList, fetchAuctionDetail } from './auction-api';
import type { AuctionListRequest } from '../model/types';

export function useAuctionsListQuery(body: AuctionListRequest) {
  return useQuery({
    queryKey: queryKeys.auctions.list(body),
    queryFn: () => fetchAuctionsList(body),
    placeholderData: (prev) => prev,
  });
}

export function useAuctionDetailQuery(auctionUuid: string | undefined) {
  return useQuery({
    queryKey: queryKeys.auctions.detail(auctionUuid ?? ''),
    queryFn: () => fetchAuctionDetail(auctionUuid as string),
    enabled: Boolean(auctionUuid),
  });
}

export function usePrefetchAuctionDetail() {
  const queryClient = useQueryClient();
  return (auctionUuid: string) =>
    queryClient.prefetchQuery({
      queryKey: queryKeys.auctions.detail(auctionUuid),
      queryFn: () => fetchAuctionDetail(auctionUuid),
      staleTime: 15_000,
    });
}
