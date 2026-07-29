// Публичный API слайса `features/auctions-filters`.
// `FiltersForm`/`FilterChip`/`countActiveFilters` — деталь реализации, используется
// только внутри слайса (панелью и мобильным триггером), наружу не отдаётся.
export { FiltersPanel } from './ui/FiltersPanel.component';
export { FiltersMobileTrigger } from './ui/FiltersMobileTrigger.component';

export { auctionsSearchSchema, parseAuctionsSearch, AUCTIONS_SEARCH_DEFAULTS } from './model/schema';
export type { AuctionsSearch } from './model/schema';
export { buildAuctionListRequest, resolveCityName } from './model/to-request';
