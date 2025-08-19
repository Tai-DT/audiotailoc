import { cookies } from 'next/headers';

export function getApiBase(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error('Missing NEXT_PUBLIC_API_BASE_URL');
  return base;
}

export function getAuthHeaders(): HeadersInit {
  const token = cookies().get('accessToken')?.value;
  const headers: HeadersInit = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function apiFetch<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const base = getApiBase();
  const headers = new Headers(init.headers || {});
  const auth = getAuthHeaders();
  Object.entries(auth).forEach(([k, v]) => headers.set(k, String(v)));
  const res = await fetch(`${base}${path}`, { ...init, headers, cache: 'no-store' });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return (await res.json()) as T;
}

export async function uploadFile(file: File | Blob): Promise<{ key: string; url: string }> {
  const base = getApiBase();
  const headers = new Headers(getAuthHeaders());
  const fd = new FormData();
  // @ts-ignore appease TS: Next.js File extends Blob in server runtime
  fd.append('file', file as any, (file as any).name || 'upload.bin');
  const res = await fetch(`${base}/files/upload`, { method: 'POST', headers, body: fd, cache: 'no-store' });
  if (!res.ok) throw new Error('Tải lên ảnh thất bại');
  return (await res.json()) as { key: string; url: string };
}

export type ProductPayload = {
  slug: string;
  name: string;
  description?: string | null;
  priceCents: number;
  imageUrl?: string | null;
};

export async function createProduct(payload: ProductPayload) {
  return apiFetch('/catalog/products', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function updateProduct(slug: string, payload: Partial<ProductPayload>) {
  return apiFetch(`/catalog/products/${encodeURIComponent(slug)}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function fetchProduct(slug: string) {
  const base = getApiBase();
  const res = await fetch(`${base}/catalog/products/${encodeURIComponent(slug)}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Không thể tải sản phẩm');
  return (await res.json()) as {
    id: string;
    slug: string;
    name: string;
    description?: string | null;
    priceCents: number;
    imageUrl?: string | null;
  };
}

