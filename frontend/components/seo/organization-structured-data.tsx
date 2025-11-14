export function OrganizationStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Audio Tài Lộc',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com'}/logo.png`,
    description: 'Chuyên cung cấp giải pháp âm thanh chuyên nghiệp cho gia đình và kinh doanh. Dàn karaoke, hệ thống âm thanh hội nghị, âm thanh gym và các dịch vụ lắp đặt, bảo hành.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'TP. Hồ Chí Minh',
      addressRegion: 'VN',
      addressCountry: 'VN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+84-768-426-262',
      contactType: 'customer service',
      availableLanguage: 'Vietnamese',
    },
    sameAs: [
      // Add social media URLs when available
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}