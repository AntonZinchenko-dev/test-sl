import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { Input } from '@/shared/ui/Input.component';
import { Button } from '@/shared/ui/Button.component';
import { IconAlertCircle, IconLock } from '@/shared/ui/icons.component';
import { formatMoney } from '@/shared/lib/format';
import { buildSetBetSchema, type SetBetFormValues } from '../model/schema';
import type { AuctionShowTradingPrice } from '@/entities/auction/model/types';

interface SetBetFormProps {
  price: AuctionShowTradingPrice;
  canSetBet: boolean;
  isSubmitting: boolean;
  onSubmit: (values: SetBetFormValues) => void;
}

export function SetBetForm({ price, canSetBet, isSubmitting, onSubmit }: SetBetFormProps) {
  const schema = useMemo(() => buildSetBetSchema({ min: price.min, max: price.max, step: price.step }), [price]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SetBetFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { price: price.available ?? price.current ?? undefined },
  });

  useEffect(() => {
    if (price.available != null) setValue('price', price.available);
  }, [price.available, setValue]);

  if (!canSetBet) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-[13.5px] text-slate-500">
        <IconLock width={18} height={18} className="mt-0.5 shrink-0 text-slate-400" />
        <span>Установка ставки сейчас недоступна для этого аукциона (торги закрыты, приостановлены или вы не допущены к участию).</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="rounded-xl bg-brand-50/60 p-3.5 text-[13px] text-slate-600">
        <div className="flex flex-wrap items-center justify-between gap-1">
          <span>Доступная цена</span>
          <span className="text-[15px] font-bold text-brand-700">{formatMoney(price.available)}</span>
        </div>
        {(price.min != null && price.max != null) || price.step != null ? (
          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 border-t border-brand-100 pt-1.5 text-[12px] text-slate-500">
            {price.min != null && price.max != null ? (
              <span>
                Диапазон: {formatMoney(price.min)} – {formatMoney(price.max)}
              </span>
            ) : null}
            {price.step != null ? <span>Шаг: {formatMoney(price.step)}</span> : null}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="bet-price" className="text-[12px] font-semibold text-slate-500">
          Ваша ставка, ₽
        </label>
        <Input id="bet-price" type="number" step="any" invalid={Boolean(errors.price)} {...register('price')} />
        {errors.price ? (
          <div className="flex items-center gap-1.5 text-[12.5px] font-medium text-red-600">
            <IconAlertCircle width={13} height={13} />
            {errors.price.message}
          </div>
        ) : null}
      </div>

      <Button type="submit" disabled={isSubmitting} fullWidth size="lg">
        {isSubmitting ? 'Отправка…' : 'Отправить ставку'}
      </Button>
    </form>
  );
}
