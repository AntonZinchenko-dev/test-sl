import { clsx } from 'clsx';
import { useUiStore } from '@/shared/model';
import { IconCheckCircle, IconAlertCircle, IconClose } from './icons.component';

export function ToastHost() {
  const toasts = useUiStore((s) => s.toasts);
  const dismiss = useUiStore((s) => s.dismissToast);

  if (!toasts.length) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-5 sm:top-5 sm:items-end">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={clsx(
            'pointer-events-auto flex w-full max-w-sm animate-slide-in-right items-start gap-2.5 rounded-xl border px-4 py-3 shadow-popover',
            t.kind === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800',
          )}
        >
          <span className="mt-0.5 shrink-0">
            {t.kind === 'success' ? <IconCheckCircle width={18} height={18} /> : <IconAlertCircle width={18} height={18} />}
          </span>
          <span className="flex-1 text-[13.5px] font-medium leading-snug">{t.message}</span>
          <button
            type="button"
            onClick={() => dismiss(t.id)}
            aria-label="Закрыть уведомление"
            className="shrink-0 rounded-full p-0.5 opacity-60 transition-opacity hover:opacity-100"
          >
            <IconClose width={14} height={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
