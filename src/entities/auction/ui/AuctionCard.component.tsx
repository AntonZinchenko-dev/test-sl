import { Link } from '@tanstack/react-router';
import { Badge } from '@/shared/ui/Badge.component';
import { Button } from '@/shared/ui/Button.component';
import { Tooltip } from '@/shared/ui/Tooltip.component';
import { buttonLinkClass } from '@/shared/ui/button-link-style';
import { IconRoute, IconCalendar, IconBox } from '@/shared/ui/icons.component';
import { formatDate, formatMoney, formatNumber } from '@/shared/lib/format';
import type { AuctionListItem } from '../model/types';
import { auctionTypeLabel, getPrimaryAction, auctionStatusLabel } from '../lib/mappers';
import { AuctionStatusBadge } from './AuctionStatusBadge.component';
import { usePrefetchAuctionDetail } from '../api/use-auction-queries';

const AUC_TYPE_TONE: Record<string, 'brand' | 'positive' | 'negative' | 'neutral'> = {
  Request: 'neutral',
  Up: 'positive',
  Down: 'negative',
  FixPrice: 'brand',
};

export function AuctionCard({ item }: { item: AuctionListItem }) {
  const action = getPrimaryAction(item);
  const prefetch = usePrefetchAuctionDetail();
  const auctionUuid = item.main.order_uid;

  return (
    <div
      className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card transition-shadow duration-150 hover:shadow-card-hover sm:p-5"
      onMouseEnter={() => prefetch(auctionUuid)}
      onFocus={() => prefetch(auctionUuid)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            to="/auctions/$auctionUuid"
            params={{ auctionUuid }}
            search={{ tab: 'overview' }}
            className="truncate text-[15px] font-bold text-slate-900 no-underline hover:text-brand-700"
          >
            № {item.main.cargo_num}
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <Badge tone={AUC_TYPE_TONE[item.main.auc_type] ?? 'neutral'}>{auctionTypeLabel(item.main.auc_type)}</Badge>
            <span className="text-xs text-slate-400">{auctionStatusLabel(item.trading.status)}</span>
          </div>
        </div>
        <AuctionStatusBadge status={item.trading.status_mobile} />
      </div>

      <Tooltip content={`${item.route.load.city} → ${item.route.unload.city}`} className="flex items-center gap-2 text-[13.5px] font-semibold text-slate-700">
        <IconRoute width={16} height={16} className="shrink-0 text-slate-400" />
        <span className="truncate">{item.route.load.city}</span>
        <span className="shrink-0 text-slate-300">→</span>
        <span className="truncate">{item.route.unload.city}</span>
      </Tooltip>

      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <IconCalendar width={14} height={14} className="shrink-0 text-slate-400" />
        <span className="whitespace-nowrap">{formatDate(item.route.load.date)}</span>
        <span className="text-slate-300">→</span>
        <span className="whitespace-nowrap">{formatDate(item.route.unload.date)}</span>
      </div>

      <Tooltip
        content={`${item.cargo.name} · ${formatNumber(item.cargo.weight, 1)} т · ${formatNumber(item.cargo.volume, 1)} м³ · ${item.cargo.body_type}`}
        className="flex items-center gap-2 text-xs text-slate-500"
      >
        <IconBox width={14} height={14} className="shrink-0 text-slate-400" />
        <span className="truncate">
          {item.cargo.name} · {formatNumber(item.cargo.weight, 1)} т · {formatNumber(item.cargo.volume, 1)} м³ · {item.cargo.body_type}
        </span>
      </Tooltip>

      {item.trading.your?.bet ? (
        <Badge tone="info" className="self-start">
          Моя ставка: {formatMoney(item.trading.your.last_bet)}
        </Badge>
      ) : null}

      <div className="mt-1 flex items-end justify-between gap-3 border-t border-slate-100 pt-3">
        <div className="min-w-0">
          <div className="text-lg font-extrabold leading-tight text-slate-900">{formatMoney(item.trading.price?.current ?? null)}</div>
          <div className="truncate text-[11.5px] text-slate-400">
            {item.main.price_per_km ? `${formatNumber(item.main.price_per_km, 1)} ₽/км` : null}
            {item.main.price_per_km && item.trading.step ? ' · ' : null}
            {item.trading.step ? `шаг ${formatMoney(item.trading.step)}` : null}
          </div>
        </div>

        {action.kind === 'disabled' ? (
          <Button variant="secondary" size="sm" disabled className="shrink-0">
            {action.label}
          </Button>
        ) : action.kind === 'view-bets' ? (
          <Link
            to="/auctions/$auctionUuid"
            params={{ auctionUuid }}
            search={{ tab: 'bets' }}
            className={buttonLinkClass('ghost', 'sm', 'shrink-0')}
          >
            {action.label}
          </Link>
        ) : (
          <Link to="/auctions/$auctionUuid/bet" params={{ auctionUuid }} className={buttonLinkClass('primary', 'sm', 'shrink-0')}>
            {action.label}
          </Link>
        )}
      </div>
    </div>
  );
}
