import type { PropsWithChildren, ReactNode } from 'react';
import { clsx } from 'clsx';
import { IconAlertCircle, IconInbox } from './icons.component';

interface StateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({ title, description, action, icon }: StateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        {icon ?? <IconInbox width={22} height={22} />}
      </div>
      <div className="text-[15px] font-semibold text-slate-700">{title}</div>
      {description ? <div className="max-w-sm text-[13.5px] text-slate-500">{description}</div> : null}
      {action}
    </div>
  );
}

export function ErrorState({ title, description, action }: PropsWithChildren<StateProps>) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-100 bg-red-50/60 px-6 py-14 text-center',
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-500">
        <IconAlertCircle width={22} height={22} />
      </div>
      <div className="text-[15px] font-semibold text-red-700">{title}</div>
      {description ? <div className="max-w-sm text-[13.5px] text-red-500/90">{description}</div> : null}
      {action}
    </div>
  );
}
