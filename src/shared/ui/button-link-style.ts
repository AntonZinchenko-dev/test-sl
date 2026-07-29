import { clsx } from 'clsx';

// Стилизует <Link> так, чтобы он визуально совпадал с <Button>, не вкладывая <a> в <button>.
const variantClasses: Record<'primary' | 'secondary' | 'ghost' | 'danger', string> = {
  primary: 'bg-brand-600 text-white border border-transparent hover:bg-brand-700 active:bg-brand-800',
  secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 active:bg-slate-100',
  ghost: 'bg-transparent text-brand-700 border border-slate-200 hover:bg-brand-50 hover:border-brand-200',
  danger: 'bg-white text-red-600 border border-red-200 hover:bg-red-50',
};

const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'text-[13px] px-3 py-1.5 gap-1.5 rounded-lg',
  md: 'text-sm px-4 py-2.5 gap-2 rounded-lg',
  lg: 'text-[15px] px-5 py-3 gap-2 rounded-xl',
};

export function buttonLinkClass(
  variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary',
  size: 'sm' | 'md' | 'lg' = 'md',
  extra?: string,
): string {
  return clsx(
    'inline-flex items-center justify-center whitespace-nowrap font-semibold leading-tight no-underline transition-colors duration-150',
    variantClasses[variant],
    sizeClasses[size],
    extra,
  );
}
