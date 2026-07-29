import { Badge } from '@/shared/ui';
import { TRADING_STATUS_TONE } from '@/shared/config';
import { tradingStatusLabel } from '../lib/mappers';

export function AuctionStatusBadge({ status }: { status: string }) {
  const tone = TRADING_STATUS_TONE[status] ?? 'neutral';
  return <Badge tone={tone}>{tradingStatusLabel(status)}</Badge>;
}
