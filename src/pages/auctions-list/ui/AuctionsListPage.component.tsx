import { useNavigate } from '@tanstack/react-router';
import { FiltersPanel } from '@/features/auctions-filters/ui/FiltersPanel.component';
import { FiltersMobileTrigger } from '@/features/auctions-filters/ui/FiltersMobileTrigger.component';
import { AuctionsListWidget } from '@/widgets/auctions-list/ui/AuctionsListWidget.component';
import { AUCTIONS_SEARCH_DEFAULTS, type AuctionsSearch } from '@/features/auctions-filters/model/schema';

export function AuctionsListPage({ search }: { search: AuctionsSearch }) {
  const navigate = useNavigate({ from: '/' });

  const applyFilters = (next: Partial<AuctionsSearch>) => navigate({ search: () => ({ ...next }) as AuctionsSearch });
  const resetFilters = () => navigate({ search: () => AUCTIONS_SEARCH_DEFAULTS });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">Список аукционов</h1>
        <p className="text-sm text-slate-500">Актуальные грузовые аукционы с возможностью установить ставку</p>
      </div>

      <div className="flex items-center justify-between gap-3 lg:hidden">
        <FiltersMobileTrigger value={search} onApply={applyFilters} onReset={resetFilters} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <FiltersPanel value={search} onApply={applyFilters} onReset={resetFilters} />
        <AuctionsListWidget
          search={search}
          onPageChange={(page) => navigate({ search: (prev) => ({ ...(prev as AuctionsSearch), page }) })}
          onPerPageChange={(per_page) => navigate({ search: (prev) => ({ ...(prev as AuctionsSearch), per_page, page: 1 }) })}
        />
      </div>
    </div>
  );
}
