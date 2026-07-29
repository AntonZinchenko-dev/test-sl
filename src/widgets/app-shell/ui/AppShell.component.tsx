import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import { ToastHost } from '@/shared/ui/ToastHost.component';
import { IconGavel } from '@/shared/ui/icons.component';
import { AUCTIONS_SEARCH_DEFAULTS } from '@/features/auctions-filters/model/schema';

export function AppShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === '/';

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand-700 focus:shadow-popover"
      >
        Перейти к содержимому
      </a>
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link to="/" search={AUCTIONS_SEARCH_DEFAULTS} className="flex items-center gap-2.5 no-underline">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
              <IconGavel width={19} height={19} />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-[15px] font-extrabold tracking-tight text-slate-900">Грузовые аукционы</span>
              <span className="hidden text-[11px] font-medium text-slate-400 sm:block">Торговая площадка перевозчика</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1.5">
            <Link
              to="/"
              search={AUCTIONS_SEARCH_DEFAULTS}
              className={
                isHome
                  ? 'rounded-lg bg-brand-50 px-3 py-2 text-[13.5px] font-semibold text-brand-700 no-underline'
                  : 'rounded-lg px-3 py-2 text-[13.5px] font-semibold text-slate-500 no-underline hover:bg-slate-100 hover:text-slate-800'
              }
            >
              Аукционы
            </Link>
          </nav>
        </div>
      </header>

      <main id="main-content" className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>Тестовое SPA · данные генерируются мок-сервером (MSW)</span>
          <span>© {new Date().getFullYear()} Cargo Auctions</span>
        </div>
      </footer>

      <ToastHost />
    </div>
  );
}
