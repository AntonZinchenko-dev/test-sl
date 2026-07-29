import type { PropsWithChildren } from 'react';
import { clsx } from 'clsx';

export function TabsList({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={clsx('inline-flex items-center gap-1 rounded-xl bg-slate-100 p-1', className)}>
      {children}
    </div>
  );
}

export function tabItemClass(active: boolean): string {
  return clsx(
    'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[13.5px] font-semibold no-underline transition-colors',
    active ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-800',
  );
}
