import { request } from '@/shared/api';
import type { BetListResponse, SetBetRequest } from '../model/types';

export function fetchBets(auctionUuid: string, all = false): Promise<BetListResponse> {
  return request<BetListResponse>(`/auctions/${auctionUuid}/bets`, { searchParams: { all } });
}

export function postBet(auctionUuid: string, payload: SetBetRequest): Promise<unknown> {
  return request(`/auctions/${auctionUuid}/bets`, { method: 'POST', body: payload });
}
