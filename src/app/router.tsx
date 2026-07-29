import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { z } from 'zod';
import { AppShell } from '@/widgets/app-shell/ui/AppShell.component';
import { AuctionsListPage } from '@/pages/auctions-list/ui/AuctionsListPage.component';
import { AuctionDetailPage } from '@/pages/auction-detail/ui/AuctionDetailPage.component';
import { SetBetPage } from '@/pages/set-bet/ui/SetBetPage.component';
import { NotFoundPage } from '@/pages/not-found/ui/NotFoundPage.component';
import { parseAuctionsSearch, type AuctionsSearch } from '@/features/auctions-filters/model/schema';

const rootRoute = createRootRoute({ component: AppShell, notFoundComponent: NotFoundPage });

const auctionsListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  validateSearch: (search): AuctionsSearch => parseAuctionsSearch(search),
  component: () => <AuctionsListPage search={auctionsListRoute.useSearch()} />,
});

const detailSearchSchema = z.object({ tab: z.enum(['overview', 'bets']).catch('overview') });

const auctionDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auctions/$auctionUuid',
  validateSearch: (search) => detailSearchSchema.parse(search),
  component: () => {
    const { auctionUuid } = auctionDetailRoute.useParams();
    const { tab } = auctionDetailRoute.useSearch();
    return <AuctionDetailPage auctionUuid={auctionUuid} tab={tab} />;
  },
});

const setBetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auctions/$auctionUuid/bet',
  component: () => {
    const { auctionUuid } = setBetRoute.useParams();
    return <SetBetPage auctionUuid={auctionUuid} />;
  },
});

const routeTree = rootRoute.addChildren([auctionsListRoute, auctionDetailRoute, setBetRoute]);

export const router = createRouter({ routeTree, defaultPreload: 'intent' });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
