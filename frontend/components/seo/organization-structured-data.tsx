export function OrganizationStructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com';
  
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Audio Tài Lộc',
    alternateName: 'AudioTaiLoc',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: 'Chuyên cung cấp giải pháp âm thanh chuyên nghiệp cho gia đình và kinh doanh. Dàn karaoke, hệ thống âm thanh hội nghị, âm thanh gym và các dịch vụ lắp đặt, bảo hành.',
    foundingDate: '2020',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Thành phố Hồ Chí Minh',
      addressLocality: 'TP. Hồ Chí Minh',
      addressRegion: 'Hồ Chí Minh',
      postalCode: '700000',
      addressCountry: 'VN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '10.8231',
      longitude: '106.6297',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+84-768-426-262',
        contactType: 'customer service',
        availableLanguage: ['Vietnamese', 'English'],
        areaServed: 'VN',
      },
      {
        '@type': 'ContactPoint',
        telephone: '+84-768-426-262',
        contactType: 'sales',
        availableLanguage: 'Vietnamese',
        areaServed: 'VN',
      },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    sameAs: [
      'https://www.facebook.com/audiotailoc',
      'https://zalo.me/0768426262',
    ],
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
    telephone: '+84-768-426-262',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Thành phố Hồ Chí Minh',
      addressLocality: 'TP. Hồ Chí Minh',
      addressRegion: 'Hồ Chí Minh',
      postalCode: '700000',
      addressCountry: 'VN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '10.8231',
      longitude: '106.6297',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '150',
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