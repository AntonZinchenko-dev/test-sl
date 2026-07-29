import { BetRow, useBetsQuery } from '@/entities/bet';
import { EmptyState, Skeleton, IconUsers, IconEyeOff } from '@/shared/ui';

export function BetsHistoryList({ auctionUuid, hidden }: { auctionUuid: string; hidden: boolean }) {
  const { data, isLoading, isError } = useBetsQuery(auctionUuid, { enabled: !hidden });

  if (hidden) {
    return (
      <EmptyState
        icon={<IconEyeOff width={20} height={20} />}
        title="История ставок скрыта"
        description="Организатор скрыл историю ставок для этого аукциона."
      />
    );
  }
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2.5">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-[68px] rounded-xl" />
        ))}
      </div>
    );
  }
  if (isError) {
    return <EmptyState title="Не удалось загрузить ставки" description="Попробуйте обновить страницу." />;
  }
  const bets = data?.bets ?? [];
  if (!bets.length) {
    return <EmptyState title="Ставок пока нет" description="Как только участники сделают ставки, они появятся здесь." />;
  }

  const participants = new Set(bets.map((b) => b.subscriber_id)).size;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500">
        <IconUsers width={15} height={15} />
        Участников: <span className="font-semibold text-slate-700">{participants}</span>
        <span className="text-slate-300">·</span>
        Ставок: <span className="font-semibold text-slate-700">{bets.length}</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {bets.map((bet, i) => (
          <BetRow key={bet.id} bet={bet} index={i} />
        ))}
      </div>
    </div>
  );
}
