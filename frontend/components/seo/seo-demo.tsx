'use client';

import { useServiceSEO, useGlobalSEO } from '@/lib/hooks/use-seo';
import { useServiceBySlug } from '@/lib/hooks/use-api';

interface SEODemoProps {
  slug: string;
}

export function SEODemo({ slug }: SEODemoProps) {
  const { data: service, isLoading: serviceLoading } = useServiceBySlug(slug);
  const { data: globalSEO, isLoading: globalLoading } = useGlobalSEO();
  const { data: seoData, isLoading: seoLoading } = useServiceSEO(service?.id || '', service);

  if (serviceLoading || globalLoading || seoLoading) {
    return <div>Loading SEO data...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">SEO Data Demo</h1>
      
      {/* Global SEO Settings */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-900 mb-3">Global SEO Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Site Name:</strong> {globalSEO?.siteName}
          </div>
          <div>
            <strong>Default Title:</strong> {globalSEO?.defaultTitle}
          </div>
          <div className="md:col-span-2">
            <strong>Default Description:</strong> {globalSEO?.defaultDescription}
          </div>
          <div className="md:col-span-2">
            <strong>Default Keywords:</strong> {globalSEO?.defaultKeywords?.join(', ')}
          </div>
          <div>
            <strong>OG Image:</strong> {globalSEO?.ogImage}
          </div>
          <div>
            <strong>Twitter Handle:</strong> {globalSEO?.twitterHandle}
          </div>
        </div>
      </div>

      {/* Service Data */}
      {service && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-green-900 mb-3">Service Data from Backend</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Name:</strong> {service.name}
            </div>
            <div>
              <strong>Slug:</strong> {service.slug}
            </div>
            <div className="md:col-span-2">
              <strong>Description:</strong> {service.description}
            </div>
            <div className="md:col-span-2">
              <strong>Short Description:</strong> {service.shortDescription}
            </div>
            <div>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <strong>SEO Title:</strong> {(service as any).seoTitle || 'Not set'}
            </div>
            <div>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <strong>SEO Description:</strong> {(service as any).seoDescription || 'Not set'}
            </div>
            <div>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <strong>Meta Keywords:</strong> {(service as any).metaKeywords || 'Not set'}
            </div>
            <div>
              <strong>Tags:</strong> {service.tags?.join(', ') || 'None'}
            </div>
            <div>
              <strong>Price:</strong> {service.price ? `${service.price.toLocaleString()} VND` : service.priceType}
            </div>
            <div>
              <strong>View Count:</strong> {service.viewCount}
            </div>
          </div>
        </div>
      )}

      {/* Generated SEO Data */}
      {seoData && (
        <div className="bg-purple-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-purple-900 mb-3">Generated SEO Data</h2>
          <div className="space-y-3 text-sm">
            <div>
              <strong>Meta Title:</strong>
              <div className="mt-1 p-2 bg-white rounded border">{seoData.title}</div>
            </div>
            <div>
              <strong>Meta Description:</strong>
              <div className="mt-1 p-2 bg-white rounded border">{seoData.description}</div>
            </div>
            <div>
              <strong>Keywords:</strong>
              <div className="mt-1 p-2 bg-white rounded border">
                {seoData.keywords?.join(', ') || 'None'}
              </div>
            </div>
            <div>
              <strong>Canonical URL:</strong>
              <div className="mt-1 p-2 bg-white rounded border">{seoData.canonical}</div>
            </div>
            <div>
              <strong>OG Image:</strong>
              <div className="mt-1 p-2 bg-white rounded border">{seoData.ogImage}</div>
            </div>
            <div>
              <strong>OG Type:</strong>
              <div className="mt-1 p-2 bg-white rounded border">{seoData.ogType}</div>
            </div>
          </div>
        </div>
      )}

      {/* Structured Data Preview */}
      {seoData?.structuredData && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Structured Data (JSON-LD)</h2>
          <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
            {JSON.stringify(seoData.structuredData, null, 2)}
          </pre>
        </div>
      )}

      {/* Meta Tags Preview */}
      <div className="bg-orange-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-orange-900 mb-3">Generated Meta Tags Preview</h2>
        <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
{seoData && `<title>${seoData.title}</title>
<meta name="description" content="${seoData.description}" />
<meta name="keywords" content="${seoData.keywords?.join(', ')}" />
<link rel="canonical" href="${seoData.canonical}" />

<!-- Open Graph -->
<meta property="og:title" content="${seoData.title}" />
<meta property="og:description" content="${seoData.description}" />
<meta property="og:type" content="${seoData.ogType}" />
<meta property="og:url" content="${seoData.canonical}" />
<meta property="og:image" content="${seoData.ogImage}" />
<meta property="og:site_name" content="${globalSEO?.siteName}" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${seoData.title}" />
<meta name="twitter:description" content="${seoData.description}" />
<meta name="twitter:image" content="${seoData.ogImage}" />
${globalSEO?.twitterHandle ? `<meta name="twitter:creator" content="${globalSEO.twitterHandle}" />` : ''}

<!-- JSON-LD Structured Data -->
<script type="application/ld+json">
${JSON.stringify(seoData.structuredData, null, 2)}
</script>`}
        </pre>
      </div>
    </div>
  );
}

export default SEODemo;