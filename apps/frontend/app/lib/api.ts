import { cookies } from 'next/headers';

export function getApiBase(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error('Missing NEXT_PUBLIC_API_BASE_URL');
  return base;
}

export async function authHeaders(): Promise<HeadersInit> {
  const c = await cookies();
  const token = c.get('accessToken')?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const base = getApiBase();
  const headers = new Headers(init.headers || {});
  const auth = await authHeaders();
  Object.entries(auth).forEach(([k, v]) => headers.set(k, String(v)));
  const res = await fetch(`${base}${path}`, { ...init, headers, cache: 'no-store' });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return (await res.json()) as T;
}

