import { Software } from '@/lib/types';
import { buildApiUrl } from '@/lib/api-config';

export async function fetchSoftwareList(limit: number = 20): Promise<Software[]> {
  try {
    const url = new URL(buildApiUrl('/software'));
    url.searchParams.set('limit', String(limit));
    const response = await fetch(url.toString(), {
      next: { revalidate: 300 },
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) return [];
    const data = await response.json();
    const items = Array.isArray(data) ? data : (data?.items || data?.data || []);
    return items as Software[];
  } catch {
    return [];
  }
}

export async function fetchSoftwareBySlug(slug: string): Promise<Software | null> {
  try {
    const url = buildApiUrl(`/software/slug/${slug}`);
    const response = await fetch(url, {
      next: { revalidate: 300 },
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) return null;
    const data = await response.json();
    return (data?.data || data) as Software;
  } catch {
    return null;
  }
}
