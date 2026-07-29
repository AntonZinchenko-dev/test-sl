import { useState } from 'react';
import { Input } from '@/shared/ui/Input.component';
import { Select } from '@/shared/ui/Select.component';
import { Button } from '@/shared/ui/Button.component';
import { Checkbox } from '@/shared/ui/Checkbox.component';
import { MultiSelect } from '@/shared/ui/MultiSelect.component';
import { CITIES } from '@/shared/config/cities';
import {
  AUCTION_TYPES,
  AUCTION_TYPE_LABELS,
  AUCTION_STATUSES,
  AUCTION_STATUS_LABELS,
  AUCTION_STATUS_NUMERIC,
  TRADING_STATUSES,
  TRADING_STATUS_LABELS,
} from '@/shared/config/enums';
import type { AuctionsSearch } from '../model/schema';
import { AUCTIONS_SEARCH_DEFAULTS } from '../model/schema';

interface FiltersFormProps {
  value: AuctionsSearch;
  onApply: (next: Partial<AuctionsSearch>) => void;
  onReset: () => void;
  submitLabel?: string;
  compact?: boolean;
}

const fieldLabel = 'mb-1.5 block text-[12px] font-semibold text-slate-500';
const fieldWrap = 'flex flex-col';

const AUC_TYPE_OPTIONS = AUCTION_TYPES.map((t) => ({ value: t, label: AUCTION_TYPE_LABELS[t] }));
const AUCTION_STATUS_OPTIONS = AUCTION_STATUSES.map((s) => ({ value: String(AUCTION_STATUS_NUMERIC[s]), label: AUCTION_STATUS_LABELS[s] }));
const TRADING_STATUS_OPTIONS = TRADING_STATUSES.filter((s) => s !== 'Unknown').map((s) => ({ value: s, label: TRADING_STATUS_LABELS[s] }));

export function FiltersForm({ value, onApply, onReset, submitLabel = 'Применить', compact }: FiltersFormProps) {
  const [draft, setDraft] = useState<AuctionsSearch>(value);

  const set = <K extends keyof AuctionsSearch>(key: K, v: AuctionsSearch[K]) =>
    setDraft((d) => ({ ...d, [key]: v }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onApply({ ...draft, page: 1 });
      }}
      className="flex flex-col gap-4"
    >
      <div className={fieldWrap}>
        <label className={fieldLabel}>Номер заявки</label>
        <Input
          value={draft.cargo_num ?? ''}
          onChange={(e) => set('cargo_num', e.target.value || undefined)}
          placeholder="00000001059"
        />
      </div>

      <div className={compact ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-2 gap-3'}>
        <div className={fieldWrap}>
          <label className={fieldLabel}>Город погрузки</label>
          <Select value={draft.load_city ?? ''} onChange={(e) => set('load_city', e.target.value || undefined)}>
            <option value="">Любой</option>
            {CITIES.map((c) => (
              <option key={c.gc_id} value={c.name}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        <div className={fieldWrap}>
          <label className={fieldLabel}>Город выгрузки</label>
          <Select value={draft.unload_city ?? ''} onChange={(e) => set('unload_city', e.target.value || undefined)}>
            <option value="">Любой</option>
            {CITIES.map((c) => (
              <option key={c.gc_id} value={c.name}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className={fieldWrap}>
        <label className={fieldLabel}>Тип аукциона</label>
        <MultiSelect options={AUC_TYPE_OPTIONS} value={draft.auc_type} onChange={(v) => set('auc_type', v)} />
      </div>

      <div className={fieldWrap}>
        <label className={fieldLabel}>Статус аукциона</label>
        <MultiSelect
          options={AUCTION_STATUS_OPTIONS}
          value={draft.statuses?.map(String)}
          onChange={(v) => set('statuses', v ? v.map(Number) : undefined)}
        />
      </div>

      <div className={fieldWrap}>
        <label className={fieldLabel}>Мой торговый статус</label>
        <MultiSelect options={TRADING_STATUS_OPTIONS} value={draft.status} onChange={(v) => set('status', v)} />
      </div>

      <div className={compact ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-2 gap-3'}>
        <div className={fieldWrap}>
          <label className={fieldLabel}>Погрузка от</label>
          <Input type="date" value={draft.load_date_from ?? ''} onChange={(e) => set('load_date_from', e.target.value || undefined)} />
        </div>
        <div className={fieldWrap}>
          <label className={fieldLabel}>Погрузка до</label>
          <Input type="date" value={draft.load_date_to ?? ''} onChange={(e) => set('load_date_to', e.target.value || undefined)} />
        </div>
      </div>

      <div className={compact ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-2 gap-3'}>
        <div className={fieldWrap}>
          <label className={fieldLabel}>Цена от, ₽</label>
          <Input
            type="number"
            min={0}
            inputMode="numeric"
            value={draft.price_from ?? ''}
            onChange={(e) => set('price_from', e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>
        <div className={fieldWrap}>
          <label className={fieldLabel}>Цена до, ₽</label>
          <Input
            type="number"
            min={0}
            inputMode="numeric"
            value={draft.price_to ?? ''}
            onChange={(e) => set('price_to', e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2.5 rounded-xl bg-slate-50 p-3">
        <Checkbox
          label="Только доступные для ставки"
          checked={draft.is_available ?? false}
          onChange={(e) => set('is_available', e.target.checked || undefined)}
        />
        <Checkbox
          label="Только те, где я участвовал"
          checked={draft.is_bidder ?? false}
          onChange={(e) => set('is_bidder', e.target.checked || undefined)}
        />
      </div>

      <div className="flex gap-2 pt-1">
        <Button type="submit" fullWidth>
          {submitLabel}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setDraft(AUCTIONS_SEARCH_DEFAULTS);
            onReset();
          }}
        >
          Сбросить
        </Button>
      </div>
    </form>
  );
}

export function countActiveFilters(search: AuctionsSearch): number {
  let count = 0;
  if (search.cargo_num) count++;
  if (search.load_city) count++;
  if (search.unload_city) count++;
  if (search.auc_type?.length) count += search.auc_type.length;
  if (search.statuses?.length) count += search.statuses.length;
  if (search.status?.length) count += search.status.length;
  if (search.load_date_from) count++;
  if (search.load_date_to) count++;
  if (search.price_from !== undefined) count++;
  if (search.price_to !== undefined) count++;
  if (search.is_available) count++;
  if (search.is_bidder) count++;
  return count;
}
