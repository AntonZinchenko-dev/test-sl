import { z } from 'zod';
import { TRADING_STATUSES, AUCTION_STATUS_NUMERIC, AUCTION_TYPES } from '@/shared/config/enums';

const csv = () =>
  z.preprocess((v) => {
    if (typeof v === 'string' && v.length) return v.split(',');
    if (Array.isArray(v)) return v;
    return undefined;
  }, z.array(z.string()).optional());

const numCsv = () =>
  z.preprocess((v) => {
    if (typeof v === 'string' && v.length) return v.split(',').map(Number);
    if (Array.isArray(v)) return v;
    return undefined;
  }, z.array(z.number()).optional());

const boolParam = () =>
  z.preprocess((v) => {
    if (v === 'true' || v === true) return true;
    if (v === 'false' || v === false) return false;
    return undefined;
  }, z.boolean().optional());

// Search-params схема списка аукционов. Всё опционально, с безопасными fallback через .catch().
export const auctionsSearchSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  per_page: z.coerce.number().int().min(1).max(100).catch(20),
  cargo_num: z.string().trim().max(64).optional().catch(undefined),
  status: csv()
    .refine((arr) => !arr || arr.every((s) => (TRADING_STATUSES as readonly string[]).includes(s)), 'invalid status')
    .catch(undefined),
  statuses: numCsv()
    .refine((arr) => !arr || arr.every((n) => Object.values(AUCTION_STATUS_NUMERIC).includes(n)), 'invalid statuses')
    .catch(undefined),
  auc_type: csv()
    .refine((arr) => !arr || arr.every((s) => (AUCTION_TYPES as readonly string[]).includes(s)), 'invalid auc_type')
    .catch(undefined),
  load_city: z.string().trim().max(64).optional().catch(undefined),
  unload_city: z.string().trim().max(64).optional().catch(undefined),
  load_date_from: z.string().optional().catch(undefined),
  load_date_to: z.string().optional().catch(undefined),
  is_available: boolParam().catch(undefined),
  is_bidder: boolParam().catch(undefined),
  price_from: z.coerce.number().nonnegative().optional().catch(undefined),
  price_to: z.coerce.number().nonnegative().optional().catch(undefined),
});

export type AuctionsSearch = z.infer<typeof auctionsSearchSchema>;

export const AUCTIONS_SEARCH_DEFAULTS: AuctionsSearch = {
  page: 1,
  per_page: 20,
};

// Безопасный парсинг: любые «мусорные» параметры откатываются на fallback вместо падения приложения.
export function parseAuctionsSearch(raw: unknown): AuctionsSearch {
  const result = auctionsSearchSchema.safeParse(raw);
  return result.success ? result.data : AUCTIONS_SEARCH_DEFAULTS;
}
