import { API_BASE_URL } from '@/lib/api-client';

const backendBase = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

export const resolveBackendImageUrl = (url?: string | null): string => {
  if (!url) return '';
  if (url.startsWith('/images/categories/')) return '/images/logo/logo-dark.svg';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('//')) return `https:${url}`;
  const normalized = url.startsWith('/') ? url : `/${url}`;
  return `${backendBase}${normalized}`;
};
