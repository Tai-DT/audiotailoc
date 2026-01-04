import { fetchHomeBanners } from '@/lib/api/banners';
import { HomeClient } from '@/components/home/home-client';

/**
 * Homepage - Server Component with SSR banners for optimal LCP
 * 
 * This page fetches banner data on the server, eliminating the 
 * client-side data fetch waterfall that was causing slow LCP.
 * 
 * Benefits:
 * - Banners are pre-rendered with data (no loading skeleton)
 * - First banner image can be immediately loaded by browser
 * - Reduces Time to First Contentful Paint (FCP)
 * - Reduces Largest Contentful Paint (LCP)
 */
export default async function Home() {
  // Pre-fetch banners on server - cached for 5 minutes with ISR
  const banners = await fetchHomeBanners();

  return <HomeClient initialBanners={banners} />;
}

// Enable ISR - revalidate every 5 minutes
export const revalidate = 300;
