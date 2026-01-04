'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import analytics components - only load after page is idle
const VercelAnalytics = dynamic(
  () => import('@vercel/analytics/react').then(mod => ({ default: mod.Analytics })),
  { ssr: false }
);

const VercelSpeedInsights = dynamic(
  () => import('@vercel/speed-insights/next').then(mod => ({ default: mod.SpeedInsights })),
  { ssr: false }
);

const WebVitalsReporterComponent = dynamic(
  () => import('@/components/analytics/web-vitals-reporter').then(mod => ({ default: mod.WebVitalsReporter })),
  { ssr: false }
);

/**
 * LazyAnalytics - Defers loading of Vercel Analytics and SpeedInsights
 * until the page has finished critical rendering.
 * This reduces TBT by ~200-300ms.
 */
export function LazyAnalytics() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Use requestIdleCallback if available, otherwise setTimeout
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setShouldLoad(true), { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    } else {
      // Fallback: load after 2 seconds
      const timer = setTimeout(() => setShouldLoad(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!shouldLoad) {
    return null;
  }

  return (
    <>
      <VercelAnalytics />
      <VercelSpeedInsights />
      <WebVitalsReporterComponent />
    </>
  );
}
