import { buildApiUrl } from '@/lib/api-config';
import { handleApiResponse } from '@/lib/api';
import type { Category } from '@/lib/types';
import type { ContactInfo } from '@/lib/contact-info';
import { Footer } from '@/components/layout/Footer';

async function fetchContactInfo(): Promise<ContactInfo | null> {
  try {
    const res = await fetch(buildApiUrl('/site/contact-info'), {
      next: { revalidate: 3600 },
      cache: 'force-cache',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return handleApiResponse<ContactInfo>({ data: json });
  } catch {
    return null;
  }
}

async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(buildApiUrl('/catalog/categories'), {
      next: { revalidate: 3600 },
      cache: 'force-cache',
    });
    if (!res.ok) return [];
    const json = await res.json();
    const data = handleApiResponse<Category[]>({ data: json });
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function FooterShell() {
  const [contactInfo, categories] = await Promise.all([fetchContactInfo(), fetchCategories()]);

  return (
    <Footer
      categories={categories}
      contactInfo={contactInfo ?? undefined}
    />
  );
}

