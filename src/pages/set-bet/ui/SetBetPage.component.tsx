import { Link } from '@tanstack/react-router';
import { Card, Skeleton, ErrorState, buttonLinkClass, IconAlertCircle, IconCheckCircle, IconChevronLeft } from '@/shared/ui';
import { formatMoney } from '@/shared/lib';
import { auctionTypeLabel, useAuctionDetailQuery } from '@/entities/auction';
import { useSetBetMutation } from '@/entities/bet';
import { SetBetForm, type SetBetFormValues } from '@/features/set-bet';
import { useUiStore } from '@/shared/model';
import { ApiError } from '@/shared/api';

export function SetBetPage({ auctionUuid }: { auctionUuid: string }) {
  const { data, isLoading, isError } = useAuctionDetailQuery(auctionUuid);
  const mutation = useSetBetMutation(auctionUuid);
  const pushToast = useUiStore((s) => s.pushToast);

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-lg flex-col gap-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-56 rounded-2xl" />
      </div>
    );
  }
  if (isError || !data) {
    return <ErrorState title="Не удалось загрузить данные аукциона" />;
  }

  const { main, trading } = data;

  const onSubmit = (values: SetBetFormValues) => {
    mutation.mutate(
      { price: values.price },
      {
        onSuccess: () => pushToast('success', 'Ставка успешно установлена'),
        onError: (err) => {
          if (err instanceof ApiError && err.isValidation()) {
            const firstMsg = err.problem.errors[0]?.message ?? err.problem.message;
            pushToast('error', firstMsg);
          } else {
            pushToast('error', err instanceof Error ? err.message : 'Не удалось установить ставку');
          }
        },
      },
    );
  };

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4">
      <Link
        to="/auctions/$auctionUuid"
        params={{ auctionUuid }}
        search={{ tab: 'overview' }}
        className="inline-flex w-fit items-center gap-1 text-[13px] font-medium text-slate-500 no-underline hover:text-brand-600"
      >
        <IconChevronLeft width={14} height={14} />
        Назад к аукциону
      </Link>

      <Card className="p-5 sm:p-6">
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
          {trading.your.bet ? 'Изменить ставку' : 'Сделать ставку'}
        </h1>
        <div className="mt-1 mb-5 text-[13px] text-slate-500">
          № {main.cargo_num} · {auctionTypeLabel(main.auc_type)} · текущая цена{' '}
          <span className="font-semibold text-slate-700">{formatMoney(trading.price.current)}</span>
        </div>

        {mutation.isError && mutation.error instanceof ApiError && mutation.error.isValidation() ? (
          <div className="mb-4 flex flex-col gap-1 rounded-xl border border-red-200 bg-red-50 p-3.5 text-[13px] text-red-700">
            {mutation.error.problem.errors.map((e, i) => (
              <div key={`${e.field}-${i}`} className="flex items-start gap-1.5">
                <IconAlertCircle width={14} height={14} className="mt-0.5 shrink-0" />
                <span>
                  <span className="font-semibold">{e.field}:</span> {e.message}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        {mutation.isSuccess ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <IconCheckCircle width={22} height={22} />
            </div>
            <div className="text-[14.5px] font-semibold text-emerald-800">Ставка принята</div>
            <Link
              to="/auctions/$auctionUuid"
              params={{ auctionUuid }}
              search={{ tab: 'overview' }}
              className={buttonLinkClass('secondary', 'md')}
            >
              Вернуться к аукциону
            </Link>
          </div>
        ) : (
          <SetBetForm price={trading.price} canSetBet={trading.can_set_bet} isSubmitting={mutation.isPending} onSubmit={onSubmit} />
        )}
      </Card>
    </div>
  );
}
