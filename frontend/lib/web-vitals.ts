/**
 * Web Vitals metrics reporter
 * Sends Core Web Vitals data to analytics
 */

// Define thresholds for good/needs-improvement/poor
const thresholds = {
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
  CLS: { good: 0.1, poor: 0.25 },  // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
  TTFB: { good: 800, poor: 1800 }, // Time to First Byte
  INP: { good: 200, poor: 500 },   // Interaction to Next Paint
};

type MetricName = keyof typeof thresholds;

interface WebVitalsMetric {
  name: string;
  value: number;
  id: string;
  navigationType?: string;
  rating?: 'good' | 'needs-improvement' | 'poor';
}

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = thresholds[name as MetricName];
  if (!threshold) return 'needs-improvement';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Reports Web Vitals metrics
 * This function is called by reportWebVitals in _app or layout
 */
export function reportWebVitals(metric: WebVitalsMetric) {
  const { name, value, id, navigationType, rating } = metric;
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log({
      name,
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      rating: rating || getRating(name, value),
      navigationType,
      id,
    });
  }
  
  // Send to Vercel Analytics (automatically handled by @vercel/analytics)
  // Additional custom tracking can be added here
}

/**
 * Initialize Web Vitals reporting
 * Compatible with web-vitals v4+ which removed FID in favor of INP
 */
export async function initWebVitals() {
  if (typeof window === 'undefined') return;
  
  try {
    const webVitals = await import('web-vitals');
    
    // Use available metrics (web-vitals v4+ removed FID)
    if (typeof webVitals.onLCP === 'function') {
      webVitals.onLCP(reportWebVitals);
    }
    if (typeof webVitals.onCLS === 'function') {
      webVitals.onCLS(reportWebVitals);
    }
    if (typeof webVitals.onFCP === 'function') {
      webVitals.onFCP(reportWebVitals);
    }
    if (typeof webVitals.onTTFB === 'function') {
      webVitals.onTTFB(reportWebVitals);
    }
    if (typeof webVitals.onINP === 'function') {
      webVitals.onINP(reportWebVitals);
    }
  } catch (error) {
    // Silently fail - web vitals is optional enhancement
    if (process.env.NODE_ENV === 'development') {
      console.warn('Web Vitals not available:', error);
    }
  }
}

