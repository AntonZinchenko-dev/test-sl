import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { z } from 'zod';
import { AppShell } from '@/widgets/app-shell';
import { AuctionsListPage } from '@/pages/auctions-list';
import { AuctionDetailPage } from '@/pages/auction-detail';
import { SetBetPage } from '@/pages/set-bet';
import { NotFoundPage } from '@/pages/not-found';
import { parseAuctionsSearch, type AuctionsSearch } from '@/features/auctions-filters';

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

// На GitHub Pages приложение раздаётся из подпапки (BASE_URL = '/repo/'), а не с корня —
// basepath синхронизирует историю роутера с этим префиксом. Локально/в CI BASE_URL === '/',
// поведение не меняется.
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  basepath: import.meta.env.BASE_URL,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
