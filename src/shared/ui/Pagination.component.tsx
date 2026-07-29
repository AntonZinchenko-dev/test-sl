import { useEffect, useState, type FormEvent } from 'react';
import { clsx } from 'clsx';
import { Button } from './Button.component';
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from './icons.component';

const PER_PAGE_OPTIONS = [10, 20, 50, 100];

interface PaginationProps {
  page: number;
  lastPage: number;
  total?: number;
  perPage?: number;
  onChange: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
}

function pageWindow(page: number, lastPage: number): (number | 'ellipsis')[] {
  const items = new Set<number>([1, lastPage, page, page - 1, page + 1]);
  const sorted = [...items].filter((p) => p >= 1 && p <= lastPage).sort((a, b) => a - b);
  const result: (number | 'ellipsis')[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - (sorted[i - 1] as number) > 1) result.push('ellipsis');
    result.push(p);
  });
  return result;
}

export function Pagination({ page, lastPage, total, perPage, onChange, onPerPageChange }: PaginationProps) {
  const [jumpValue, setJumpValue] = useState(String(page));

  useEffect(() => {
    setJumpValue(String(page));
  }, [page]);

  if (lastPage <= 1 && !onPerPageChange) return null;
  const items = pageWindow(page, lastPage);

  const submitJump = (e: FormEvent) => {
    e.preventDefault();
    const next = Math.min(Math.max(1, Number(jumpValue) || 1), lastPage);
    setJumpValue(String(next));
    if (next !== page) onChange(next);
  };

  return (
    // Полный набор (номера страниц, первая/последняя, переход по номеру) включается только
    // с lg — на «средних» экранах (планшеты, ~640–1023px) этому вместе с селектором
    // «показывать по» банально не хватает ширины в одну строку, и блок расползался/переносился
    // некрасиво. До lg показываем компактную навигацию «‹ 2 / 8 ›», как и на мобильных.
    <div className="flex flex-col-reverse items-center gap-x-6 gap-y-3 border-t border-slate-100 py-5 sm:flex-row sm:flex-wrap sm:justify-between">
      {onPerPageChange ? (
        <label className="flex items-center gap-2 text-[13px] text-slate-500">
          <span className="hidden lg:inline">Показывать по</span>
          <select
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[13px] font-medium text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            aria-label="Количество на странице"
          >
            {PER_PAGE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n} / стр.
              </option>
            ))}
          </select>
          {typeof total === 'number' ? <span className="hidden text-slate-400 lg:inline">· всего {total}</span> : null}
        </label>
      ) : (
        <span />
      )}

      {lastPage > 1 ? (
        <nav className="flex flex-wrap items-center justify-center gap-1.5" aria-label="Пагинация">
          <span className="hidden lg:inline-flex">
            <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => onChange(1)} aria-label="Первая страница">
              <IconChevronsLeft width={16} height={16} />
            </Button>
          </span>
          <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Предыдущая страница">
            <IconChevronLeft width={16} height={16} />
            <span className="hidden lg:inline">Назад</span>
          </Button>

          <div className="mx-1 hidden items-center gap-1 lg:flex">
            {items.map((it, i) =>
              it === 'ellipsis' ? (
                <span key={`e${i}`} className="px-1.5 text-slate-400">
                  …
                </span>
              ) : (
                <button
                  key={it}
                  onClick={() => onChange(it)}
                  aria-current={it === page ? 'page' : undefined}
                  className={clsx(
                    'h-9 min-w-9 rounded-lg px-2 text-sm font-medium transition-colors',
                    it === page ? 'bg-brand-600 font-semibold text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100',
                  )}
                >
                  {it}
                </button>
              ),
            )}
          </div>

          <span className="mx-1 text-[13px] font-medium text-slate-500 lg:hidden">
            {page} / {lastPage}
          </span>

          <Button variant="secondary" size="sm" disabled={page >= lastPage} onClick={() => onChange(page + 1)} aria-label="Следующая страница">
            <span className="hidden lg:inline">Вперёд</span>
            <IconChevronRight width={16} height={16} />
          </Button>
          <span className="hidden lg:inline-flex">
            <Button variant="ghost" size="sm" disabled={page >= lastPage} onClick={() => onChange(lastPage)} aria-label="Последняя страница">
              <IconChevronsRight width={16} height={16} />
            </Button>
          </span>
        </nav>
      ) : (
        <span />
      )}

      {lastPage > 1 ? (
        <form onSubmit={submitJump} className="hidden items-center gap-1.5 text-[13px] text-slate-500 lg:flex">
          <span>Стр.</span>
          <input
            value={jumpValue}
            onChange={(e) => setJumpValue(e.target.value.replace(/[^0-9]/g, ''))}
            inputMode="numeric"
            aria-label="Перейти на страницу"
            className="h-8 w-12 rounded-lg border border-slate-200 bg-white text-center text-[13px] font-medium text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          <span>из {lastPage}</span>
        </form>
      ) : (
        <span className="hidden lg:inline" />
      )}
    </div>
  );
}
