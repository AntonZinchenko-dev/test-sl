import { useState, type ReactNode } from 'react';
import { clsx } from 'clsx';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  className?: string;
}

// Лёгкий тултип для усечённого (truncate) текста в карточках — показывает полное значение при наведении/фокусе.
export function Tooltip({ content, children, className }: TooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={clsx('relative min-w-0', className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
    >
      {children}
      {open ? (
        <div
          role="tooltip"
          className="pointer-events-none absolute left-0 top-full z-50 mt-1.5 w-max max-w-[280px] animate-fade-in rounded-lg bg-slate-900 px-2.5 py-1.5 text-[12px] font-medium leading-snug text-white shadow-popover"
        >
          {content}
        </div>
      ) : null}
    </div>
  );
}
