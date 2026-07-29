import { describe, it, expect } from 'vitest';
import { parseAuctionsSearch, AUCTIONS_SEARCH_DEFAULTS } from './schema';

describe('parseAuctionsSearch', () => {
  it('falls back to defaults for empty input', () => {
    expect(parseAuctionsSearch({})).toEqual({ page: 1, per_page: 20 });
  });

  it('parses csv arrays', () => {
    const result = parseAuctionsSearch({ auc_type: 'Up,Down', page: '2' });
    expect(result.auc_type).toEqual(['Up', 'Down']);
    expect(result.page).toBe(2);
  });

  it('rejects invalid enum values and falls back', () => {
    const result = parseAuctionsSearch({ auc_type: 'NotAType' });
    expect(result.auc_type).toBeUndefined();
  });

  it('caps per_page and clamps page to a safe default when malformed', () => {
    const result = parseAuctionsSearch({ page: '-5' });
    expect(result).toEqual(AUCTIONS_SEARCH_DEFAULTS);
  });

  it('parses boolean params', () => {
    const result = parseAuctionsSearch({ is_available: 'true', is_bidder: 'false' });
    expect(result.is_available).toBe(true);
    expect(result.is_bidder).toBe(false);
  });
});
