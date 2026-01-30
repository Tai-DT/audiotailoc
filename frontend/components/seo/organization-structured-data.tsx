import { API_CONFIG } from '@/lib/api-config';
import type { ContactInfo } from '@/lib/hooks/use-contact-info';

const normalizePhone = (value: string) => {
 const trimmed = value.trim();
 if (!trimmed) return '';
 const digits = trimmed.replace(/[^\d+]/g, '');
 if (digits.startsWith('+')) return digits;
 if (digits.startsWith('0')) return `+84${digits.slice(1)}`;
 return digits;
};

const buildAddress = (contactInfo: ContactInfo | null) => {
 const address = contactInfo?.address;
 if (!address) return undefined;

 const street = address.street || address.full || '';
 const city = address.city || '';
 const district = address.district || '';
 const country = address.country || 'VN';

 return {
 '@type': 'PostalAddress',
 ...(street ? { streetAddress: street } : {}),
 ...(city ? { addressLocality: city } : {}),
 ...(district ? { addressRegion: district } : {}),
 ...(country ? { addressCountry: country } : {}),
 };
};

async function fetchContactInfo(): Promise<ContactInfo | null> {
 const baseUrl = API_CONFIG.baseUrl.replace(/\/$/, '');
 try {
 const response = await fetch(`${baseUrl}/site/contact-info`, {
 next: { revalidate: 60 * 60 },
 });
 if (!response.ok) return null;
 const payload = await response.json();
 if (payload && typeof payload === 'object' && 'data' in payload) {
 return payload.data as ContactInfo;
 }
 return payload as ContactInfo;
 } catch {
 return null;
 }
}

export async function OrganizationStructuredData() {
 const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com';
 const contactInfo = await fetchContactInfo();
 const hotlineNumber = contactInfo?.phone?.hotline
 || contactInfo?.phone?.display?.replace(/\s+/g, '')
 || '';
 const hotlinePhone = hotlineNumber ? normalizePhone(hotlineNumber) : '';
 const address = buildAddress(contactInfo);
 const sameAs = [
 contactInfo?.social?.facebook,
 contactInfo?.social?.instagram,
 contactInfo?.social?.youtube,
 contactInfo?.social?.zalo,
 ].filter(Boolean);
  const organizationData = {
 '@context': 'https://schema.org',
 '@type': 'Organization',
 name: 'Audio Tài Lộc',
 alternateName: 'AudioTaiLoc',
 url: siteUrl,
 logo: `${siteUrl}/logo.png`,
 description: 'Chuyên cung cấp giải pháp âm thanh chuyên nghiệp cho gia đình và kinh doanh. Dàn karaoke, hệ thống âm thanh hội nghị, âm thanh gym và các dịch vụ lắp đặt, bảo hành.',
 foundingDate: '2020',
 ...(address ? { address } : {}),
 geo: {
 '@type': 'GeoCoordinates',
 latitude: '10.8231',
 longitude: '106.6297',
 },
 ...(hotlinePhone
 ? {
 contactPoint: [
 {
 '@type': 'ContactPoint',
 telephone: hotlinePhone,
 contactType: 'customer service',
 availableLanguage: ['Vietnamese', 'English'],
 areaServed: 'VN',
 },
 {
 '@type': 'ContactPoint',
 telephone: hotlinePhone,
 contactType: 'sales',
 availableLanguage: 'Vietnamese',
 areaServed: 'VN',
 },
 ],
 }
 : {}),
 ...(sameAs.length > 0 ? { sameAs } : {}),
 priceRange: '$$',
 currenciesAccepted: 'VND',
 paymentAccepted: 'Cash, Credit Card, Bank Transfer',
 };

 const localBusinessData = {
 '@context': 'https://schema.org',
 '@type': 'LocalBusiness',
 '@id': `${siteUrl}/#localbusiness`,
 name: 'Audio Tài Lộc',
 image: `${siteUrl}/logo.png`,
 url: siteUrl,
 ...(hotlinePhone ? { telephone: hotlinePhone } : {}),
 priceRange: '$$',
 ...(address ? { address } : {}),
 geo: {
 '@type': 'GeoCoordinates',
 latitude: '10.8231',
 longitude: '106.6297',
 },
 };

 const websiteData = {
 '@context': 'https://schema.org',
 '@type': 'WebSite',
 '@id': `${siteUrl}/#website`,
 url: siteUrl,
 name: 'Audio Tài Lộc',
 description: 'Thiết bị âm thanh chuyên nghiệp - Dàn karaoke, Loa, Ampli, Micro',
 publisher: {
 '@id': `${siteUrl}/#organization`,
 },
 potentialAction: {
 '@type': 'SearchAction',
 target: {
 '@type': 'EntryPoint',
 urlTemplate: `${siteUrl}/search?q={search_term_string}`,
 },
 'query-input': 'required name=search_term_string',
 },
 inLanguage: 'vi-VN',
 };

 return (
 <>
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{
 __html: JSON.stringify(organizationData),
 }}
 />
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{
 __html: JSON.stringify(localBusinessData),
 }}
 />
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{
 __html: JSON.stringify(websiteData),
 }}
 />
 </>
 );
}
