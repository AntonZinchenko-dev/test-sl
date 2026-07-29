import { describe, it, expect } from 'vitest';
import { buildAuctionListRequest } from './to-request';
import { AUCTIONS_SEARCH_DEFAULTS } from './schema';

describe('buildAuctionListRequest', () => {
  it('builds a minimal body from defaults', () => {
    expect(buildAuctionListRequest(AUCTIONS_SEARCH_DEFAULTS)).toEqual({ page: 1, per_page: 20 });
  });

  it('maps price range to current_price_from/to', () => {
    const body = buildAuctionListRequest({ ...AUCTIONS_SEARCH_DEFAULTS, price_from: 100, price_to: 500 });
    expect(body.current_price_from).toBe(100);
    expect(body.current_price_to).toBe(500);
  });

  it('converts date-only load_date_from/to into ISO offset strings', () => {
    const body = buildAuctionListRequest({ ...AUCTIONS_SEARCH_DEFAULTS, load_date_from: '2026-05-26' });
    expect(body.load_date_from).toMatch(/^2026-05-26T00:00:00[+-]\d{2}:\d{2}$/);
  });

  it('omits undefined filters entirely', () => {
    const body = buildAuctionListRequest({ ...AUCTIONS_SEARCH_DEFAULTS, cargo_num: undefined });
    expect(body).not.toHaveProperty('cargo_num');
  });
});
