import { request } from '@/shared/api/http-client';
import type { AuctionListRequest, AuctionListResponseBase, AuctionShowResponse } from '../model/types';

export function fetchAuctionsList(body: AuctionListRequest): Promise<AuctionListResponseBase> {
  return request<AuctionListResponseBase>('/auctions/list', { method: 'POST', body });
}

export function fetchAuctionDetail(auctionUuid: string): Promise<AuctionShowResponse> {
  return request<AuctionShowResponse>(`/auctions/${auctionUuid}`);
}
