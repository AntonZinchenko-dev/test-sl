import { Card, IconFilter } from '@/shared/ui';
import { FiltersForm } from './FiltersForm.component';
import type { AuctionsSearch } from '../model/schema';

interface FiltersPanelProps {
  value: AuctionsSearch;
  onApply: (next: Partial<AuctionsSearch>) => void;
  onReset: () => void;
}

// Десктопная боковая панель фильтров — всегда видима на широких экранах.
export function FiltersPanel({ value, onApply, onReset }: FiltersPanelProps) {
  return (
    <Card className="hidden h-fit p-4 lg:block lg:sticky lg:top-20">
      <div className="mb-4 flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide text-slate-500">
        <IconFilter width={16} height={16} className="text-brand-600" />
        Фильтры
      </div>
      <FiltersForm value={value} onApply={onApply} onReset={onReset} />
    </Card>
  );
}
