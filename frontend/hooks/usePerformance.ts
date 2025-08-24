import { useEffect, useState, useCallback } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
}

interface WebVitalsMetric {
  name: string;
  value: number;
  delta: number;
  id: string;
}

export function usePerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    firstInputDelay: 0,
    cumulativeLayoutShift: 0,
  });

  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if performance APIs are supported
    if (typeof window !== 'undefined' && 'performance' in window) {
      setIsSupported(true);

      // Load time
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      setMetrics(prev => ({ ...prev, loadTime }));

      // Web Vitals observers
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          switch (entry.entryType) {
            case 'paint':
              if (entry.name === 'first-contentful-paint') {
                setMetrics(prev => ({ ...prev, firstContentfulPaint: entry.startTime }));
              }
              break;
            case 'largest-contentful-paint':
              setMetrics(prev => ({ ...prev, largestContentfulPaint: entry.startTime }));
              break;
            case 'first-input':
              setMetrics(prev => ({ ...prev, firstInputDelay: (entry as any).processingStart - entry.startTime }));
              break;
            case 'layout-shift':
              if (!(entry as any).hadRecentInput) {
                setMetrics(prev => ({ ...prev, cumulativeLayoutShift: prev.cumulativeLayoutShift + (entry as any).value }));
              }
              break;
          }
        }
      });

      // Observe different performance entry types
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });

      return () => observer.disconnect();
    }
  }, []);

  const reportWebVitals = useCallback((metric: WebVitalsMetric) => {
    // In a real app, you would send this to your analytics service
    console.log('Web Vitals:', metric);

    // Example: Send to Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.value),
        non_interaction: true,
      });
    }
  }, []);

  return {
    metrics,
    isSupported,
    reportWebVitals,
  };
}

// Hook for measuring component render time
export function useRenderTime(componentName: string) {
  useEffect(() => {
    const start = performance.now();

    return () => {
      const end = performance.now();
      const renderTime = end - start;
      console.log(`${componentName} render time:`, renderTime.toFixed(2), 'ms');
    };
  }, [componentName]);
}

// Hook for measuring page load performance
export function usePageLoadTime() {
  const [loadTime, setLoadTime] = useState<number | null>(null);

  useEffect(() => {
    const handleLoad = () => {
      if (performance.timing.loadEventEnd) {
        const time = performance.timing.loadEventEnd - performance.timing.navigationStart;
        setLoadTime(time);
      }
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return loadTime;
}

// Hook for monitoring memory usage
export function useMemoryUsage() {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null>(null);

  useEffect(() => {
    if ('memory' in performance) {
      const interval = setInterval(() => {
        const memory = (performance as any).memory;
        setMemoryInfo({
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, []);

  return memoryInfo;
}

// Hook for monitoring network requests
export function useNetworkMonitor() {
  const [requests, setRequests] = useState<Array<{
    url: string;
    method: string;
    status: number;
    duration: number;
    timestamp: number;
  }>>([]);

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries() as PerformanceResourceTiming[];

      const newRequests = entries.map(entry => ({
        url: entry.name,
        method: 'GET', // Performance API doesn't provide method
        status: 200, // Status is not available in Performance API
        duration: entry.duration,
        timestamp: entry.startTime,
      }));

      setRequests(prev => [...prev, ...newRequests].slice(-50)); // Keep last 50 requests
    });

    observer.observe({ entryTypes: ['resource'] });

    return () => observer.disconnect();
  }, []);

  return requests;
}

