import type { PropsWithChildren, ReactNode } from 'react';
import { clsx } from 'clsx';

type Tone = 'neutral' | 'positive' | 'negative' | 'warning' | 'info' | 'brand';

const tones: Record<Tone, string> = {
  neutral: 'bg-slate-100 text-slate-600',
  positive: 'bg-emerald-50 text-emerald-700',
  negative: 'bg-red-50 text-red-700',
  warning: 'bg-amber-50 text-amber-700',
  info: 'bg-sky-50 text-sky-700',
  brand: 'bg-brand-50 text-brand-700',
};

export function Badge({
  tone = 'neutral',
  icon,
  className,
  children,
}: PropsWithChildren<{ tone?: Tone; icon?: ReactNode; className?: string }>) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold leading-none',
        tones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
