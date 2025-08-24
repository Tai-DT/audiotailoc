// Performance monitoring and optimization utilities for frontend

export class PerformanceMonitor {
  private static metrics: Map<string, number[]> = new Map();
  private static observers: Map<string, PerformanceObserver> = new Map();

  // Initialize performance monitoring
  static init() {
    if (typeof window === 'undefined') return;

    // Monitor Core Web Vitals
    this.observeWebVitals();
    
    // Monitor resource loading
    this.observeResourceTiming();
    
    // Monitor navigation timing
    this.observeNavigationTiming();
  }

  // Record custom performance metrics
  static recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const values = this.metrics.get(name)!;
    values.push(value);
    
    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift();
    }
    
    // Log significant metrics
    if (this.shouldLogMetric(name, value)) {
      console.warn(`Performance: ${name} = ${value}ms`);
    }
  }

  // Measure function execution time
  static measure<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    
    this.recordMetric(name, duration);
    return result;
  }

  // Measure async function execution time
  static async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;
    
    this.recordMetric(name, duration);
    return result;
  }

  // Get performance statistics
  static getStats(): Record<string, {
    count: number;
    average: number;
    min: number;
    max: number;
    p95: number;
  }> {
    const stats: Record<string, any> = {};
    
    for (const [name, values] of this.metrics.entries()) {
      if (values.length === 0) continue;
      
      const sorted = [...values].sort((a, b) => a - b);
      const sum = values.reduce((a, b) => a + b, 0);
      
      stats[name] = {
        count: values.length,
        average: sum / values.length,
        min: sorted[0],
        max: sorted[sorted.length - 1],
        p95: sorted[Math.floor(sorted.length * 0.95)],
      };
    }
    
    return stats;
  }

  private static observeWebVitals() {
    // Largest Contentful Paint (LCP)
    this.createObserver('largest-contentful-paint', (entries) => {
      const lastEntry = entries[entries.length - 1];
      this.recordMetric('LCP', lastEntry.startTime);
    });

    // First Input Delay (FID)
    this.createObserver('first-input', (entries) => {
      entries.forEach(entry => {
        const e: any = entry as any;
        const processingStart: number = typeof e.processingStart === 'number' ? e.processingStart : e.startTime;
        this.recordMetric('FID', Math.max(0, processingStart - e.startTime));
      });
    });

    // Cumulative Layout Shift (CLS)
    this.createObserver('layout-shift', (entries) => {
      let clsValue = 0;
      entries.forEach(entry => {
        const e: any = entry as any;
        if (!e.hadRecentInput) {
          clsValue += typeof e.value === 'number' ? e.value : 0;
        }
      });
      if (clsValue > 0) {
        this.recordMetric('CLS', clsValue * 1000); // Convert to ms for consistency
      }
    });
  }

  private static observeResourceTiming() {
    this.createObserver('resource', (entries) => {
      entries.forEach(entry => {
        const resource = entry as PerformanceResourceTiming;
        
        // Record different types of resource loading times
        if (resource.name.includes('.js')) {
          this.recordMetric('JS_Load_Time', resource.duration);
        } else if (resource.name.includes('.css')) {
          this.recordMetric('CSS_Load_Time', resource.duration);
        } else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
          this.recordMetric('Image_Load_Time', resource.duration);
        } else if (resource.name.includes('/api/')) {
          this.recordMetric('API_Response_Time', resource.duration);
        }
      });
    });
  }

  private static observeNavigationTiming() {
    this.createObserver('navigation', (entries) => {
      entries.forEach(entry => {
        const nav = entry as PerformanceNavigationTiming;
        
        // Record navigation metrics
        this.recordMetric('DNS_Lookup', nav.domainLookupEnd - nav.domainLookupStart);
        this.recordMetric('TCP_Connect', nav.connectEnd - nav.connectStart);
        this.recordMetric('Request_Response', nav.responseEnd - nav.requestStart);
        this.recordMetric('DOM_Processing', nav.domContentLoadedEventEnd - nav.responseEnd);
        this.recordMetric('Page_Load', nav.loadEventEnd - nav.startTime);
      });
    });
  }

  private static createObserver(type: string, callback: (entries: PerformanceEntry[]) => void) {
    if (typeof window === 'undefined' || !("PerformanceObserver" in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      
      observer.observe({ type, buffered: true });
      this.observers.set(type, observer);
    } catch (error) {
      console.warn(`Failed to create performance observer for ${type}:`, error);
    }
  }

  private static shouldLogMetric(name: string, value: number): boolean {
    // Log slow operations
    if (name.includes('Load_Time') && value > 1000) return true;
    if (name.includes('API_Response_Time') && value > 500) return true;
    if (name === 'LCP' && value > 2500) return true;
    if (name === 'FID' && value > 100) return true;
    if (name === 'CLS' && value > 100) return true; // CLS * 1000
    
    return false;
  }

  // Cleanup observers
  static cleanup() {
    for (const observer of this.observers.values()) {
      observer.disconnect();
    }
    this.observers.clear();
  }
}

// Image optimization utilities
export class ImageOptimizer {
  // Create optimized image URL with Next.js Image Optimization
  static optimizeImageUrl(
    src: string,
    width: number,
    height?: number,
    quality: number = 75
  ): string {
    if (!src) return '';
    
    // If it's already an optimized URL, return as-is
    if (src.includes('/_next/image')) return src;
    
    const params = new URLSearchParams({
      url: src,
      w: width.toString(),
      q: quality.toString(),
    });
    
    if (height) {
      params.set('h', height.toString());
    }
    
    return `/_next/image?${params.toString()}`;
  }

  // Generate responsive image sizes
  static generateSrcSet(src: string, sizes: number[]): string {
    return sizes
      .map(size => `${this.optimizeImageUrl(src, size)} ${size}w`)
      .join(', ');
  }

  // Lazy load images with Intersection Observer
  static lazyLoadImages(selector: string = 'img[data-src]') {
    if (typeof window === 'undefined' || !("IntersectionObserver" in window)) return;

    const images = document.querySelectorAll(selector);
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }
}

// Bundle size optimization utilities
export class BundleOptimizer {
  // Dynamic import with error handling
  static async dynamicImport<T>(importFn: () => Promise<T>): Promise<T | null> {
    try {
      const start = performance.now();
      const loadedModule = await importFn();
      const duration = performance.now() - start;
      
      PerformanceMonitor.recordMetric('Dynamic_Import', duration);
      return loadedModule;
    } catch (error) {
      console.error('Dynamic import failed:', error);
      return null;
    }
  }

  // Preload critical resources
  static preloadResource(href: string, as: string, crossorigin?: string) {
    if (typeof document === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    
    if (crossorigin) {
      link.crossOrigin = crossorigin;
    }
    
    document.head.appendChild(link);
  }

  // Prefetch resources for next navigation
  static prefetchResource(href: string) {
    if (typeof document === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    
    document.head.appendChild(link);
  }
}

// Memory optimization utilities
export class MemoryOptimizer {
  private static cleanupTasks: (() => void)[] = [];

  // Register cleanup task
  static registerCleanup(task: () => void) {
    this.cleanupTasks.push(task);
  }

  // Run all cleanup tasks
  static cleanup() {
    this.cleanupTasks.forEach(task => {
      try {
        task();
      } catch (error) {
        console.error('Cleanup task failed:', error);
      }
    });
    this.cleanupTasks = [];
  }

  // Debounce function calls
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  // Throttle function calls
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// Initialize performance monitoring when module loads
if (typeof window !== 'undefined') {
  PerformanceMonitor.init();
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    PerformanceMonitor.cleanup();
    MemoryOptimizer.cleanup();
  });
}
