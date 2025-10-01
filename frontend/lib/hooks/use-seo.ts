import { useQuery } from '@tanstack/react-query';
import { apiClient, handleApiResponse } from '@/lib/api';
import type { Product, Service, BlogArticle } from '@/lib/types';

// Define SEO data types
export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: Record<string, unknown>;
}

export interface GlobalSEOSettings {
  siteName: string;
  siteDescription: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultKeywords: string[];
  ogImage: string;
  twitterHandle?: string;
  facebookAppId?: string;
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  metaPixelId?: string;
}

export interface PageSEOData {
  id: string;
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  canonical?: string;
  alternates?: Record<string, string>;
  structuredData?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// Query keys for SEO
export const seoKeys = {
  all: ['seo'] as const,
  global: () => [...seoKeys.all, 'global'] as const,
  page: (path: string) => [...seoKeys.all, 'page', path] as const,
  pages: () => [...seoKeys.all, 'pages'] as const,
} as const;

// Hook to get global SEO settings
export const useGlobalSEO = () => {
  return useQuery({
    queryKey: seoKeys.global(),
    queryFn: async (): Promise<GlobalSEOSettings> => {
      try {
        const response = await apiClient.get('/seo/global');
        return handleApiResponse<GlobalSEOSettings>(response);
      } catch {
        // Fallback to default settings if API not available
        console.warn('Global SEO settings not available, using defaults');
        return {
          siteName: 'Audio Tài Lộc',
          siteDescription: 'Chuyên cung cấp giải pháp âm thanh chuyên nghiệp cho gia đình và kinh doanh',
          defaultTitle: 'Audio Tài Lộc - Chuyên gia âm thanh chuyên nghiệp',
          defaultDescription: 'Audio Tài Lộc chuyên cung cấp dàn karaoke, hệ thống âm thanh hội nghị, âm thanh gym và các dịch vụ lắp đặt, bảo hành chuyên nghiệp tại TP.HCM',
          defaultKeywords: ['audio', 'âm thanh', 'karaoke', 'loa', 'dàn âm thanh', 'hội nghị', 'lắp đặt'],
          ogImage: '/og-image.jpg',
          twitterHandle: '@audiotailoc',
          googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
          googleTagManagerId: process.env.NEXT_PUBLIC_GTM_ID,
        };
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

// Hook to get SEO data for a specific page
export const usePageSEO = (path: string) => {
  return useQuery({
    queryKey: seoKeys.page(path),
    queryFn: async (): Promise<PageSEOData | null> => {
      try {
        const response = await apiClient.get(`/seo/pages`, {
          params: { path },
        });
        return handleApiResponse<PageSEOData>(response);
      } catch {
        console.warn(`Page SEO data not found for path: ${path}`);
        return null;
      }
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!path,
  });
};

// Hook to get comprehensive SEO data for products with existing meta fields
export const useProductSEO = (productId: string, product?: Product) => {
  const globalSEO = useGlobalSEO();
  
  return useQuery({
    queryKey: ['seo', 'product', productId],
    queryFn: (): SEOData => {
      if (!product) return {};
      
      const title = product.metaTitle || `${product.name} | ${globalSEO.data?.siteName || 'Audio Tài Lộc'}`;
      const description = product.metaDescription || product.shortDescription || product.description || '';
      
      // Handle keywords - metaKeywords is string[], tags is string[]
      const keywords = product.metaKeywords || product.tags || [];
      
      return {
        title,
        description: description.length > 160 ? description.substring(0, 160).trim() + '...' : description,
        keywords,
        canonical: product.canonicalUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
        ogImage: product.images?.[0] || globalSEO.data?.ogImage,
        ogType: 'product',
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description,
          image: product.images || [],
          brand: {
            '@type': 'Brand',
            name: globalSEO.data?.siteName || 'Audio Tài Lộc',
          },
          offers: ((product as any).price || product.priceCents) ? {
            '@type': 'Offer',
            price: product.price || (product.priceCents / 100),
            priceCurrency: 'VND',
            availability: product.isActive ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          } : undefined,
        },
      };
    },
    enabled: !!product && !!globalSEO.data,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get comprehensive SEO data for services
export const useServiceSEO = (serviceId: string, service?: Service) => {
  const globalSEO = useGlobalSEO();
  
  return useQuery({
    queryKey: ['seo', 'service', serviceId],
    queryFn: (): SEOData => {
      if (!service) return {};
      
      const title = service.seoTitle || service.metaTitle || `${service.name} | ${globalSEO.data?.siteName || 'Audio Tài Lộc'}`;
      const description = service.seoDescription || service.metaDescription || service.shortDescription || service.description || '';
      
      // Handle keywords - metaKeywords is string, tags is string[]
      let keywords: string[] = [];
      if (service.metaKeywords) {
        keywords = service.metaKeywords.split(',').map((k: string) => k.trim()).filter(Boolean);
      } else if (service.tags) {
        keywords = service.tags;
      }
      
      return {
        title,
        description: description.length > 160 ? description.substring(0, 160).trim() + '...' : description,
        keywords,
        canonical: service.canonicalUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/services/${service.slug}`,
        ogImage: service.images?.[0] || globalSEO.data?.ogImage,
        ogType: 'service',
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service.name,
          description: service.description,
          image: service.images || [],
          provider: {
            '@type': 'Organization',
            name: globalSEO.data?.siteName || 'Audio Tài Lộc',
          },
          offers: service.price ? {
            '@type': 'Offer',
            price: service.price,
            priceCurrency: 'VND',
          } : undefined,
        },
      };
    },
    enabled: !!service && !!globalSEO.data,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get blog article SEO data
export const useBlogSEO = (articleId: string, article?: BlogArticle) => {
  const globalSEO = useGlobalSEO();
  
  return useQuery({
    queryKey: ['seo', 'blog', articleId],
    queryFn: (): SEOData => {
      if (!article) return {};
      
      const title = article.seoTitle || `${article.title} | ${globalSEO.data?.siteName || 'Audio Tài Lộc'}`;
      const description = article.seoDescription || article.excerpt || article.content || '';
      
      // Handle keywords - seoKeywords is string, tags is string[]
      let keywords: string[] = [];
      if (article.seoKeywords) {
        keywords = article.seoKeywords.split(',').map((k: string) => k.trim()).filter(Boolean);
      } else if (article.tags) {
        keywords = article.tags;
      }
      
      return {
        title,
        description: description.replace(/<[^>]*>/g, '').substring(0, 160).trim() + (description.length > 160 ? '...' : ''),
        keywords,
        canonical: article.canonicalUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${article.slug}`,
        ogImage: article.imageUrl || globalSEO.data?.ogImage,
        ogType: 'article',
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: article.title,
          description: article.excerpt || article.content?.replace(/<[^>]*>/g, '').substring(0, 160),
          image: article.imageUrl,
          author: {
            '@type': 'Person',
            name: article.author?.name || 'Audio Tài Lộc',
          },
          publisher: {
            '@type': 'Organization',
            name: globalSEO.data?.siteName || 'Audio Tài Lộc',
            logo: {
              '@type': 'ImageObject',
              url: globalSEO.data?.ogImage,
            },
          },
          datePublished: article.publishedAt || article.createdAt,
          dateModified: article.updatedAt,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${article.slug}`,
          },
        },
      };
    },
    enabled: !!article && !!globalSEO.data,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to generate sitemap data
export const useSitemapData = () => {
  return useQuery({
    queryKey: ['seo', 'sitemap'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/seo/sitemap');
        return handleApiResponse(response);
      } catch {
        console.warn('Sitemap data not available from backend');
        return null;
      }
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

// Utility function to generate SEO metadata object for Next.js
export const generateMetadata = (seoData: SEOData, globalSEO?: GlobalSEOSettings) => {
  return {
    title: seoData.title || globalSEO?.defaultTitle,
    description: seoData.description || globalSEO?.defaultDescription,
    keywords: seoData.keywords || globalSEO?.defaultKeywords,
    openGraph: {
      title: seoData.title || globalSEO?.defaultTitle,
      description: seoData.description || globalSEO?.defaultDescription,
      type: seoData.ogType || 'website',
      url: seoData.canonical,
      images: seoData.ogImage ? [{ url: seoData.ogImage }] : [{ url: globalSEO?.ogImage || '/og-image.jpg' }],
      siteName: globalSEO?.siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData.title || globalSEO?.defaultTitle,
      description: seoData.description || globalSEO?.defaultDescription,
      images: seoData.ogImage ? [seoData.ogImage] : [globalSEO?.ogImage || '/og-image.jpg'],
      creator: globalSEO?.twitterHandle,
    },
    alternates: {
      canonical: seoData.canonical,
    },
    other: globalSEO?.facebookAppId ? {
      'fb:app_id': globalSEO.facebookAppId,
    } : {},
  };
};