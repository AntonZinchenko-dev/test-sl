import { clsx } from 'clsx';
import { AuctionCard } from '@/entities/auction/ui/AuctionCard.component';
import { AuctionCardSkeleton } from '@/shared/ui/Skeleton.component';
import { EmptyState, ErrorState } from '@/shared/ui/EmptyState.component';
import { Pagination } from '@/shared/ui/Pagination.component';
import { Button } from '@/shared/ui/Button.component';
import { useAuctionsListQuery } from '@/entities/auction/api/use-auction-queries';
import { buildAuctionListRequest } from '@/features/auctions-filters/model/to-request';
import type { AuctionsSearch } from '@/features/auctions-filters/model/schema';

interface AuctionsListWidgetProps {
  search: AuctionsSearch;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

export function AuctionsListWidget({ search, onPageChange, onPerPageChange }: AuctionsListWidgetProps) {
  const body = buildAuctionListRequest(search);
  const { data, isLoading, isError, refetch, isFetching } = useAuctionsListQuery(body);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="Загрузка аукционов">
        {Array.from({ length: 6 }).map((_, i) => (
          <AuctionCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Не удалось загрузить аукционы"
        description="Проверьте соединение и попробуйте снова."
        action={
          <Button size="sm" onClick={() => refetch()}>
            Повторить
          </Button>
        }
      />
    );
  }

  const items = data?.data ?? [];
  if (!items.length) {
    return <EmptyState title="Ничего не найдено" description="Измените фильтры или сбросьте их, чтобы увидеть больше аукционов." />;
  }

  return (
    <div className="flex flex-col gap-4">
      {data?.meta ? (
        <div className="flex items-center justify-between text-[13px] text-slate-500">
          <span>
            Найдено <span className="font-semibold text-slate-700">{data.meta.total}</span> аукционов
          </span>
          <span className="hidden sm:inline">
            Стр. {data.meta.current_page} из {data.meta.last_page}
          </span>
        </div>
      ) : null}

      <div
        className={clsx(
          'grid grid-cols-1 gap-4 transition-opacity duration-150 sm:grid-cols-2 xl:grid-cols-3',
          isFetching && 'opacity-60',
        )}
      >
        {items.map((item) => (
          <AuctionCard key={item.main.order_uid} item={item} />
        ))}
      </div>

      {data?.meta ? (
        <Pagination
          page={data.meta.current_page}
          lastPage={data.meta.last_page}
          total={data.meta.total}
          perPage={search.per_page}
          onChange={onPageChange}
          onPerPageChange={onPerPageChange}
        />
      ) : null}
    </div>
  );
}
