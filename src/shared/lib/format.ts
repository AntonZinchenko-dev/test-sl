const numberFormat = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 });
const numberFormat2 = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 });

export function formatMoney(value: number | null | undefined, currencyCode = '643'): string {
  if (value === null || value === undefined) return '—';
  const symbol = currencyCode === '643' ? '₽' : currencyCode;
  return `${numberFormat.format(value)} ${symbol}`;
}

export function formatNumber(value: number | null | undefined, digits = 0): string {
  if (value === null || value === undefined) return '—';
  return digits > 0 ? numberFormat2.format(value) : numberFormat.format(value);
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
}

// Дата из <input type="date"> (YYYY-MM-DD) в ISO8601 со смещением, требуемым схемой.
export function dateOnlyToIsoOffset(dateOnly: string, endOfDay = false): string {
  const time = endOfDay ? '23:59:59' : '00:00:00';
  const offset = -new Date().getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const abs = Math.abs(offset);
  const hh = String(Math.floor(abs / 60)).padStart(2, '0');
  const mm = String(abs % 60).padStart(2, '0');
  return `${dateOnly}T${time}${sign}${hh}:${mm}`;
}
