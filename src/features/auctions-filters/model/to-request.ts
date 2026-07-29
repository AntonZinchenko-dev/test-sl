import { CITIES } from '@/shared/config/cities';
import { dateOnlyToIsoOffset } from '@/shared/lib/format';
import type { AuctionListRequest } from '@/entities/auction/model/types';
import type { AuctionsSearch } from './schema';

// Строит тело POST /auctions/list из search-параметров URL.
export function buildAuctionListRequest(search: AuctionsSearch): AuctionListRequest {
  const body: AuctionListRequest = {
    page: search.page,
    per_page: search.per_page,
  };

  if (search.cargo_num) body.cargo_num = search.cargo_num;
  if (search.status?.length) body.status = search.status;
  if (search.statuses?.length) body.statuses = search.statuses;
  if (search.auc_type?.length) body.auc_type = search.auc_type;
  if (search.load_city) body.load_city = search.load_city;
  if (search.unload_city) body.unload_city = search.unload_city;
  if (search.load_date_from) body.load_date_from = dateOnlyToIsoOffset(search.load_date_from);
  if (search.load_date_to) body.load_date_to = dateOnlyToIsoOffset(search.load_date_to, true);
  if (search.is_available !== undefined) body.is_available = search.is_available;
  if (search.is_bidder !== undefined) body.is_bidder = search.is_bidder;
  if (search.price_from !== undefined) body.current_price_from = search.price_from;
  if (search.price_to !== undefined) body.current_price_to = search.price_to;

  return body;
}

export function resolveCityName(gcId: number | undefined): string | undefined {
  return CITIES.find((c) => c.gc_id === gcId)?.name;
}
