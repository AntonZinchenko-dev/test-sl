import type { PropsWithChildren, ReactNode } from 'react';
import { useEffect } from 'react';
import { IconClose } from './icons.component';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  footer?: ReactNode;
}

// Мобильный bottom-sheet: используется для фильтров на узких экранах.
export function Sheet({ open, onClose, title, footer, children }: PropsWithChildren<SheetProps>) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:items-center sm:justify-center">
      <div
        className="absolute inset-0 animate-fade-in bg-slate-900/40 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative flex max-h-[88vh] w-full animate-slide-up flex-col rounded-t-2xl bg-white shadow-popover sm:max-h-[85vh] sm:w-full sm:max-w-lg sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="text-base font-bold text-slate-900">{title}</div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <IconClose width={18} height={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer ? <div className="border-t border-slate-100 px-5 py-4">{footer}</div> : null}
      </div>
    </div>
  );
}
