import type { HTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import { clsx } from 'clsx';

export function Card({ className, children, ...rest }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      {...rest}
      className={clsx('rounded-2xl border border-slate-200 bg-white shadow-card', className)}
    >
      {children}
    </div>
  );
}

export function CardSection({
  title,
  icon,
  action,
  className,
  children,
}: PropsWithChildren<{ title?: ReactNode; icon?: ReactNode; action?: ReactNode; className?: string }>) {
  return (
    <Card className={clsx('flex flex-col gap-3 p-4 sm:p-5', className)}>
      {title ? (
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide text-slate-500">
            {icon ? <span className="text-brand-600">{icon}</span> : null}
            {title}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </Card>
  );
}

export function DefinitionRow({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 text-[13.5px]">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-800">{value}</span>
    </div>
  );
}

// В отличие от DefinitionRow (label слева / value справа в одну строку) — этот вариант
// кладёт label над value. Нужен для плотных grid-раскладок (например, «Параметры торгов»):
// в узкой колонке grid-ячейки паре «label ... value» в одну строку не хватает места, и текст
// начинает наезжать сам на себя; вертикальная раскладка эту проблему снимает на любой ширине.
export function StatItem({ label, value, className }: { label: ReactNode; value: ReactNode; className?: string }) {
  return (
    <div className={clsx('flex min-w-0 flex-col gap-0.5', className)}>
      <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      <span className="text-[13.5px] font-semibold leading-snug text-slate-800">{value}</span>
    </div>
  );
}
