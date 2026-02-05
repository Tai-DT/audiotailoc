import { buildApiUrl } from '@/lib/api-config';
import { handleApiResponse } from '@/lib/api';
import type { ContactInfo } from '@/lib/contact-info';
import { AppHeader } from '@/components/layout/header-client';

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

export default async function HeaderShell() {
  const contactInfo = await fetchContactInfo();

  return <AppHeader contactInfo={contactInfo ?? undefined} />;
}
