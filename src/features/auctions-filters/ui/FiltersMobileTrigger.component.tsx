import { Sheet, Button, IconFilter } from '@/shared/ui';
import { useUiStore } from '@/shared/model';
import { FiltersForm, countActiveFilters } from './FiltersForm.component';
import type { AuctionsSearch } from '../model/schema';

interface FiltersMobileTriggerProps {
  value: AuctionsSearch;
  onApply: (next: Partial<AuctionsSearch>) => void;
  onReset: () => void;
}

// Мобильный триггер + bottom-sheet с теми же фильтрами, что и десктопная панель.
export function FiltersMobileTrigger({ value, onApply, onReset }: FiltersMobileTriggerProps) {
  const open = useUiStore((s) => s.filtersDrawerOpen);
  const setOpen = useUiStore((s) => s.setFiltersDrawerOpen);
  const activeCount = countActiveFilters(value);

  return (
    <div className="lg:hidden">
      <Button variant="secondary" onClick={() => setOpen(true)} className="relative">
        <IconFilter width={16} height={16} />
        Фильтры
        {activeCount > 0 ? (
          <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] font-bold text-white">
            {activeCount}
          </span>
        ) : null}
      </Button>

      <Sheet open={open} onClose={() => setOpen(false)} title="Фильтры">
        <FiltersForm
          value={value}
          submitLabel="Показать результаты"
          compact
          onApply={(next) => {
            onApply(next);
            setOpen(false);
          }}
          onReset={() => {
            onReset();
            setOpen(false);
          }}
        />
      </Sheet>
    </div>
  );
}
