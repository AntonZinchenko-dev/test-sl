import { ApiError, type ProblemDetail } from './errors';

const BASE_URL = '/api/v1';

interface RequestOptions {
  method?: 'GET' | 'POST';
  body?: unknown;
  searchParams?: Record<string, string | number | boolean | undefined>;
}

// Собирает финальный URL из базового пути, query-параметров.
export function buildUrl(path: string, searchParams?: RequestOptions['searchParams']): string {
  const url = new URL(BASE_URL + path, 'http://local');
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
    }
  }
  return url.pathname + url.search;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = buildUrl(path, options.searchParams);
  const res = await fetch(url, {
    method: options.method ?? 'GET',
    headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    let problem: ProblemDetail;
    try {
      problem = await res.json();
    } catch {
      problem = { code: 'unknown_error', title: 'Ошибка', message: res.statusText };
    }
    throw new ApiError(res.status, problem);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}
