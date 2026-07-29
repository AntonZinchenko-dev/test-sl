import { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { IconChevronDown, IconClose } from './icons.component';

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[] | undefined;
  onChange: (next: string[] | undefined) => void;
  placeholder?: string;
}

// Красивый мультиселект-дропдаун с чекбоксами (замена кликабельным бейджам) — поддерживает выбор нескольких значений сразу.
export function MultiSelect({ options, value, onChange, placeholder = 'Любой' }: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = value ?? [];

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEscape);
    };
  }, [open]);

  const toggle = (v: string) => {
    const set = new Set(selected);
    if (set.has(v)) set.delete(v);
    else set.add(v);
    onChange(set.size ? [...set] : undefined);
  };

  const summary =
    selected.length === 0
      ? placeholder
      : selected.length === 1
        ? (options.find((o) => o.value === selected[0])?.label ?? placeholder)
        : `Выбрано: ${selected.length}`;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={clsx(
          'flex w-full items-center justify-between gap-2 rounded-lg border bg-white px-3 py-2 text-left text-sm transition-colors',
          'focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100',
          open ? 'border-brand-500 ring-2 ring-brand-100' : 'border-slate-200',
        )}
      >
        <span className={clsx('truncate', selected.length ? 'font-medium text-slate-900' : 'text-slate-400')}>{summary}</span>
        <span className="flex shrink-0 items-center gap-1">
          {selected.length ? (
            <span
              role="button"
              tabIndex={0}
              aria-label="Сбросить выбор"
              onClick={(e) => {
                e.stopPropagation();
                onChange(undefined);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                  onChange(undefined);
                }
              }}
              className="rounded-full p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <IconClose width={13} height={13} />
            </span>
          ) : null}
          <IconChevronDown width={15} height={15} className={clsx('text-slate-400 transition-transform', open && 'rotate-180')} />
        </span>
      </button>

      {open ? (
        <div
          role="listbox"
          aria-multiselectable="true"
          className="absolute z-40 mt-1.5 max-h-64 w-full min-w-[200px] overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-popover"
        >
          {options.map((opt) => {
            const checked = selected.includes(opt.value);
            return (
              <label
                key={opt.value}
                className={clsx(
                  'flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13.5px] transition-colors',
                  checked ? 'bg-brand-50 text-brand-800' : 'text-slate-700 hover:bg-slate-50',
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(opt.value)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 accent-brand-600 focus:ring-2 focus:ring-brand-100"
                />
                <span className="truncate">{opt.label}</span>
              </label>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
