import { clsx } from 'clsx';
import { Badge, IconTrophy } from '@/shared/ui';
import { formatDateTime, formatMoney } from '@/shared/lib';
import type { BetItem } from '../model/types';

export function BetRow({ bet, index }: { bet: BetItem; index: number }) {
  const place = bet.place ?? index + 1;

  return (
    <div
      className={clsx(
        'flex flex-col gap-3 rounded-xl border p-3.5 sm:flex-row sm:items-center sm:gap-4',
        bet.is_rejected ? 'border-slate-100 bg-slate-50/70 opacity-70' : bet.is_win ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-200 bg-white',
      )}
    >
      <div
        className={clsx(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold',
          bet.is_win ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500',
        )}
        aria-label={`Место ${place}`}
      >
        {bet.is_win ? <IconTrophy width={15} height={15} /> : place}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-semibold text-slate-800">{bet.organization_name || bet.contact_name || 'Перевозчик'}</span>
          {bet.is_win ? <Badge tone="positive">Победитель</Badge> : null}
          {bet.is_rejected ? <Badge tone="negative">Отменена</Badge> : null}
          {bet.is_counter ? <Badge tone="info">Встречная</Badge> : null}
        </div>
        <div className="mt-0.5 text-[12px] text-slate-400">{formatDateTime(bet.created_at)}</div>
        {bet.is_rejected && bet.cancel_reason ? (
          <div className="mt-1 text-[12px] font-medium text-red-600">Причина отмены: {bet.cancel_reason}</div>
        ) : null}
      </div>

      <div className="flex shrink-0 items-baseline justify-between gap-4 border-t border-slate-100 pt-2 sm:justify-end sm:border-t-0 sm:pt-0 sm:text-right">
        <div>
          <div className="text-[15px] font-bold text-slate-900">{formatMoney(bet.price_with_vat)}</div>
          <div className="text-[11.5px] text-slate-400">без НДС {formatMoney(bet.price_no_vat)}</div>
        </div>
      </div>
    </div>
  );
}
