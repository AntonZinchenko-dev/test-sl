import { AUCTION_TYPE_LABELS, AUCTION_STATUS_LABELS, TRADING_STATUS_LABELS } from '@/shared/config';
import type { AuctionListItem } from '../model/types';

export function auctionTypeLabel(type: string): string {
  return AUCTION_TYPE_LABELS[type] ?? type;
}

export function auctionStatusLabel(status: string): string {
  return AUCTION_STATUS_LABELS[status] ?? status;
}

export function tradingStatusLabel(status: string): string {
  return TRADING_STATUS_LABELS[status] ?? status;
}

export type PrimaryActionKind = 'place-bet' | 'edit-bet' | 'view-bets' | 'disabled';

export interface PrimaryAction {
  kind: PrimaryActionKind;
  label: string;
}

// Определяет primary action карточки аукциона на основе can_set_bet / наличия своей ставки.
export function getPrimaryAction(item: AuctionListItem): PrimaryAction {
  const { trading } = item;
  if (!trading.can_set_bet) {
    if (trading.your?.bet) return { kind: 'view-bets', label: 'Смотреть ставки' };
    return { kind: 'disabled', label: 'Торги недоступны' };
  }
  if (trading.your?.bet) return { kind: 'edit-bet', label: 'Изменить ставку' };
  return { kind: 'place-bet', label: 'Сделать ставку' };
}

export function hasOwnBet(item: AuctionListItem): boolean {
  return Boolean(item.trading.your?.bet);
}
