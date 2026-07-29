import { AuctionDetailWidget } from '@/widgets/auction-detail';
import { EmptyState, ErrorState, DetailSkeleton, Button } from '@/shared/ui';
import { useAuctionDetailQuery } from '@/entities/auction';

export function AuctionDetailPage({ auctionUuid, tab }: { auctionUuid: string; tab: 'overview' | 'bets' }) {
  const { data, isLoading, isError, error, refetch } = useAuctionDetailQuery(auctionUuid);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (isError) {
    const notFound = (error as { status?: number })?.status === 404;
    return notFound ? (
      <EmptyState title="Аукцион не найден" description="Возможно, ссылка устарела или аукцион был удалён." />
    ) : (
      <ErrorState
        title="Не удалось загрузить аукцион"
        description="Проверьте соединение и попробуйте снова."
        action={
          <Button size="sm" onClick={() => refetch()}>
            Повторить
          </Button>
        }
      />
    );
  }

  if (!data) return null;
  return <AuctionDetailWidget auction={data} auctionUuid={auctionUuid} tab={tab} />;
}
