import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api/query-keys';
import { fetchBets, postBet } from './bet-api';
import type { SetBetRequest } from '../model/types';

export function useBetsQuery(auctionUuid: string | undefined, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.auctions.bets(auctionUuid ?? ''),
    queryFn: () => fetchBets(auctionUuid as string),
    enabled: Boolean(auctionUuid) && (options?.enabled ?? true),
  });
}

export function useSetBetMutation(auctionUuid: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SetBetRequest) => postBet(auctionUuid, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.auctions.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.auctions.detail(auctionUuid) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.auctions.bets(auctionUuid) }),
      ]);
    },
  });
}
