import type { InputHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
}

export function Checkbox({ label, className, ...rest }: CheckboxProps) {
  return (
    <label className={clsx('flex cursor-pointer items-center gap-2 text-[13.5px] text-slate-700 select-none', className)}>
      <input
        type="checkbox"
        {...rest}
        className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-2 focus:ring-brand-100 accent-brand-600"
      />
      {label}
    </label>
  );
}
