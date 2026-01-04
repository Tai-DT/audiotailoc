import { fetchHomeBanners } from '@/lib/api/banners';
import { fetchFeaturedProducts } from '@/lib/api/products';
import { HomeClient } from '@/components/home/home-client';
import { StaticHeroBanner } from '@/components/home/static-hero-banner';

/**
 * Homepage - Server Component with maximum performance optimizations
 * 
 * Uses StaticHeroBanner (zero JS) for first banner to minimize TBT.
 * Additional banners and products are passed to client for hydration.
 * 
 * Benefits:
 * - First banner renders without any JavaScript (pure HTML/CSS)
 * - Significantly reduced TBT
 * - Faster LCP as first banner is immediately visible
 * - Products are pre-fetched to avoid client fetch waterfall
 */
export default async function Home() {
  // Pre-fetch data on server in parallel
  const [banners, featuredProducts] = await Promise.all([
    fetchHomeBanners(),
    fetchFeaturedProducts(8),
  ]);

  const firstBanner = banners[0];
  const remainingBanners = banners.slice(1);

  return (
    <main className="bg-background" id="main-content">
      {/* Static Hero Banner - Zero hydration for fastest LCP */}
      {firstBanner && (
        <section aria-label="Banner chính">
          <StaticHeroBanner banner={firstBanner} />
        </section>
      )}
      
      {/* Rest of homepage with client interactivity */}
      <HomeClient 
        initialBanners={remainingBanners} 
        initialProducts={featuredProducts}
        skipBanner={!!firstBanner}
      />
    </main>
  );
}

// Enable ISR - revalidate every 5 minutes
export const revalidate = 300;
