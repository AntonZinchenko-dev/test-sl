import { forwardRef, type SelectHTMLAttributes } from 'react';
import { clsx } from 'clsx';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...rest }, ref) {
    return (
      <div className="relative">
        <select
          ref={ref}
          {...rest}
          className={clsx(
            'w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 pr-8 text-sm text-slate-900',
            'transition-colors duration-150 outline-none',
            'focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
            'disabled:bg-slate-50 disabled:text-slate-400',
            className,
          )}
        >
          {children}
        </select>
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          fill="none"
          className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        >
          <path d="M5.5 7.5L10 12l4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  },
);
