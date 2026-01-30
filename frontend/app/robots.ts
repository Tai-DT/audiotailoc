import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard/',
          '/api/',
          '/_next/',
          '/private/',
          '/checkout/',
          '/cart/',
          '/profile/',
          '/orders/',
          '/payment-history/',
          '/service-orders/',
          '/booking-history/',
          '/customer-admin/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard/',
          '/api/',
          '/_next/',
          '/private/',
        ],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/products/', '/services/', '/du-an/', '/danh-muc/'],
      },
    ],
    sitemap: 'https://audiotailoc.com/sitemap.xml',
  };
}