import type { AuctionListRequest } from '@/entities/auction/model/types';

export const queryKeys = {
  auctions: {
    all: ['auctions'] as const,
    list: (body: AuctionListRequest) => ['auctions', 'list', body] as const,
    detail: (uuid: string) => ['auctions', 'detail', uuid] as const,
    bets: (uuid: string) => ['auctions', 'bets', uuid] as const,
  },
};
