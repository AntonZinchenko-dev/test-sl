export const AUCTION_TYPES = ['Request', 'Up', 'Down', 'FixPrice'] as const;
export type AuctionType = (typeof AUCTION_TYPES)[number] | 'Unknown';

export const AUCTION_TYPE_LABELS: Record<string, string> = {
  Request: 'Заявочный',
  Up: 'На повышение',
  Down: 'На понижение',
  FixPrice: 'Фикс. цена',
  Unknown: '—',
};

export const AUCTION_STATUSES = [
  'Planning',
  'Auction',
  'DeterminateWinner',
  'WaitDeal',
  'InProgress',
  'Finished',
  'Stopped',
  'Canceled',
] as const;
export type AuctionStatus = (typeof AUCTION_STATUSES)[number] | 'Unknown';

export const AUCTION_STATUS_NUMERIC: Record<string, number> = Object.fromEntries(
  AUCTION_STATUSES.map((s, i) => [s, i + 1]),
);
export const AUCTION_STATUS_BY_NUMERIC: Record<number, string> = Object.fromEntries(
  AUCTION_STATUSES.map((s, i) => [i + 1, s]),
);

export const AUCTION_STATUS_LABELS: Record<string, string> = {
  Planning: 'Планирование',
  Auction: 'Торги идут',
  DeterminateWinner: 'Определение победителя',
  WaitDeal: 'Ожидание сделки',
  InProgress: 'В работе',
  Finished: 'Завершён',
  Stopped: 'Остановлен',
  Canceled: 'Отменён',
  Unknown: '—',
};

export const TRADING_STATUSES = [
  'NotParticipating',
  'Leading',
  'Losing',
  'OnPending',
  'Confirmed',
  'ChoosingWinner',
  'Winner',
  'Accepted',
  'Unknown',
] as const;
export type TradingStatus = (typeof TRADING_STATUSES)[number];

export const TRADING_STATUS_LABELS: Record<string, string> = {
  NotParticipating: 'Не участвует',
  Leading: 'Лидирует',
  Losing: 'Перебит',
  OnPending: 'На рассмотрении',
  Confirmed: 'Подтверждён',
  ChoosingWinner: 'Выбор победителя',
  Winner: 'Победитель',
  Accepted: 'Принято',
  Unknown: '—',
};

export const TRADING_STATUS_TONE: Record<string, 'neutral' | 'positive' | 'negative' | 'warning'> = {
  NotParticipating: 'neutral',
  Leading: 'positive',
  Losing: 'negative',
  OnPending: 'warning',
  Confirmed: 'positive',
  ChoosingWinner: 'warning',
  Winner: 'positive',
  Accepted: 'positive',
  Unknown: 'neutral',
};
