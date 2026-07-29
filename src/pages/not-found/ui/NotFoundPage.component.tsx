import { Link } from '@tanstack/react-router';
import { buttonLinkClass, IconAlertCircle } from '@/shared/ui';
import { AUCTIONS_SEARCH_DEFAULTS } from '@/features/auctions-filters';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center gap-3 px-5 py-24 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <IconAlertCircle width={26} height={26} />
      </div>
      <div className="text-xl font-extrabold text-slate-900">Страница не найдена</div>
      <p className="max-w-sm text-[13.5px] text-slate-500">Проверьте адрес ссылки или вернитесь к списку аукционов.</p>
      <Link to="/" search={AUCTIONS_SEARCH_DEFAULTS} className={buttonLinkClass('primary', 'md', 'mt-2')}>
        На главную
      </Link>
    </div>
  );
}
