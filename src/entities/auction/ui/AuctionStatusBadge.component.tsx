import { Badge } from '@/shared/ui/Badge.component';
import { TRADING_STATUS_TONE } from '@/shared/config/enums';
import { tradingStatusLabel } from '../lib/mappers';

export function AuctionStatusBadge({ status }: { status: string }) {
  const tone = TRADING_STATUS_TONE[status] ?? 'neutral';
  return <Badge tone={tone}>{tradingStatusLabel(status)}</Badge>;
}
