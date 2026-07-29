import { forwardRef, type InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid, className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      {...rest}
      className={clsx(
        'w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400',
        'transition-colors duration-150 outline-none',
        'focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
        invalid ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-slate-200',
        'disabled:bg-slate-50 disabled:text-slate-400',
        className,
      )}
    />
  );
});
