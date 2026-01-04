import { fetchHomeBanners } from '@/lib/api/banners';
import { fetchFeaturedProducts } from '@/lib/api/products';
import { HomeClient } from '@/components/home/home-client';

/**
 * Homepage - Server Component with SSR banners AND products for optimal LCP
 * 
 * This page fetches both banner and product data on the server, eliminating 
 * client-side data fetch waterfall that causes slow LCP.
 * 
 * Benefits:
 * - Banners and products are pre-rendered with data (no loading skeleton)
 * - First banner image can be immediately loaded by browser
 * - Reduces Time to First Contentful Paint (FCP)
 * - Reduces Largest Contentful Paint (LCP)
 * - Reduces Total Blocking Time (TBT) by removing client-side fetch logic
 */
export default async function Home() {
  // Pre-fetch both banners and products on server in parallel
  const [banners, featuredProducts] = await Promise.all([
    fetchHomeBanners(),
    fetchFeaturedProducts(8),
  ]);

  return (
    <HomeClient 
      initialBanners={banners} 
      initialProducts={featuredProducts}
    />
  );
}

// Enable ISR - revalidate every 5 minutes
export const revalidate = 300;
