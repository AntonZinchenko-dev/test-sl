// Публичный API слайса `entities/auction`. Остальные слои обязаны импортировать
// только отсюда, не залезая напрямую в ui/api/lib/model — так слайс можно менять
// изнутри, не трогая потребителей (правило Public API в Feature-Sliced Design).
export { AuctionCard } from './ui/AuctionCard.component';
export { AuctionStatusBadge } from './ui/AuctionStatusBadge.component';

export { useAuctionsListQuery, useAuctionDetailQuery, usePrefetchAuctionDetail } from './api/use-auction-queries';

export { auctionTypeLabel, auctionStatusLabel, tradingStatusLabel, getPrimaryAction, hasOwnBet } from './lib/mappers';
export type { PrimaryAction, PrimaryActionKind } from './lib/mappers';

export type {
  AuctionListItem,
  AuctionListRequest,
  AuctionListMeta,
  AuctionListResponseBase,
  AuctionShowResponse,
  AuctionShowTradingPrice,
  AuctionShowTrading,
} from './model/types';
