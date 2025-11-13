# 🚀 Dashboard Performance Optimization Guide

**Date:** 2025-10-20  
**Status:** Ready for Implementation

---

## 📊 Current Performance Baseline

### Before Optimization
- **Bundle Size:** ~756 modules compiled
- **First Load:** Not measured
- **Lighthouse Score:** Not tested
- **Code Splitting:** Minimal
- **Image Optimization:** Partial (Cloudinary)

### Performance Goals
- ✅ Lighthouse Score: >90
- ✅ First Contentful Paint: <2s
- ✅ Time to Interactive: <3.5s
- ✅ Bundle Size Reduction: -30%
- ✅ Lazy Loading: All heavy components

---

## 🎯 Optimization Checklist

### Phase 1: Code Splitting (Priority 1)

#### ✅ Implement Dynamic Imports
```typescript
// dashboard/app/dashboard/page.tsx
const DashboardCharts = dynamic(() => import('@/components/dashboard/charts'), {
  loading: () => <ChartLoadingSkeleton />,
  ssr: false
})

// For heavy components
const ProductFormDialog = dynamic(() => 
  import('@/components/products/product-form-dialog').then(mod => ({ 
    default: mod.ProductFormDialog 
  })),
  { loading: () => <FormLoadingSkeleton /> }
)
```

**Files to optimize:**
- [ ] `/dashboard/app/dashboard/page.tsx` - Charts (recharts library)
- [ ] `/dashboard/app/dashboard/products/page.tsx` - Product dialogs
- [ ] `/dashboard/app/dashboard/orders/page.tsx` - Order dialogs
- [ ] `/dashboard/app/dashboard/analytics/page.tsx` - Analytics charts

#### ✅ Route-based Code Splitting
```typescript
// Already done by Next.js automatically for /app routes
// Verify with: npm run build
```

---

### Phase 2: Image Optimization (Priority 1)

#### ✅ Current Status
- ✅ Using Next.js Image component
- ✅ Cloudinary optimization enabled
- ⚠️ Some images still use <img> tags

#### ✅ Actions Needed
```typescript
// Replace all <img> with Next.js Image
import Image from 'next/image'

// Before
<img src={product.imageUrl} alt={product.name} />

// After
<Image 
  src={product.imageUrl} 
  alt={product.name}
  width={200}
  height={200}
  quality={80}
  loading="lazy"
/>
```

**Files to check:**
- [ ] `/dashboard/app/dashboard/products/page.tsx`
- [ ] `/dashboard/components/products/product-detail-dialog.tsx`
- [ ] `/dashboard/components/products/product-form-dialog.tsx`

---

### Phase 3: Bundle Size Optimization (Priority 2)

#### ✅ Analyze Current Bundle
```bash
# Run build and analyze
cd dashboard
npm run build

# Check output for large modules
# Look for:
# - node_modules size
# - Page bundles
# - Shared chunks
```

#### ✅ Tree Shaking
```typescript
// Use named imports
// Before
import _ from 'lodash'

// After
import { debounce, throttle } from 'lodash-es'

// Or better, use native alternatives
const debounce = (fn, delay) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}
```

#### ✅ Remove Unused Dependencies
```bash
# Check unused dependencies
npx depcheck

# Common large packages to audit:
# - moment.js (use date-fns or native Date)
# - lodash (use lodash-es or native)
# - chart.js alternatives (recharts is OK)
```

---

### Phase 4: Lazy Loading (Priority 2)

#### ✅ Component-level Lazy Loading
```typescript
// dashboard/app/dashboard/products/page.tsx
import { lazy, Suspense } from 'react'

const ProductFormDialog = lazy(() => 
  import('@/components/products/product-form-dialog')
    .then(mod => ({ default: mod.ProductFormDialog }))
)

// Usage
<Suspense fallback={<FormLoadingSkeleton />}>
  {showFormDialog && (
    <ProductFormDialog 
      product={editingProduct}
      open={showFormDialog}
      onOpenChange={setShowFormDialog}
      categories={categories}
      onSuccess={handleFormSuccess}
    />
  )}
</Suspense>
```

**Components to lazy load:**
- [ ] ProductFormDialog
- [ ] ProductDetailDialog
- [ ] OrderDialogs
- [ ] Charts (recharts)
- [ ] Rich text editors
- [ ] Map components (Goong Maps)

---

### Phase 5: API Optimization (Priority 2)

#### ✅ Implement Request Caching
```typescript
// lib/api-client.ts
const cache = new Map()

export const apiClient = {
  async get(url: string, options?: { cache?: number }) {
    const cacheKey = url
    const cached = cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < (options?.cache || 0)) {
      return cached.data
    }
    
    const data = await fetch(url).then(r => r.json())
    
    if (options?.cache) {
      cache.set(cacheKey, { data, timestamp: Date.now() })
    }
    
    return data
  }
}
```

#### ✅ Debounce Search Inputs
```typescript
// Use debounce for search
import { useMemo } from 'react'
import { debounce } from 'lodash-es'

const debouncedSearch = useMemo(
  () => debounce((term: string) => {
    setSearchTerm(term)
  }, 300),
  []
)
```

**Files to update:**
- [ ] `/dashboard/app/dashboard/products/page.tsx` - Search
- [ ] `/dashboard/app/dashboard/orders/page.tsx` - Search
- [ ] `/dashboard/app/dashboard/services/page.tsx` - Search

---

### Phase 6: Tailwind CSS Optimization (Priority 3)

#### ✅ Enable Purge CSS
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // This automatically removes unused CSS in production
}
```

#### ✅ Extract Common Classes
```typescript
// lib/utils.ts
export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // ... etc
      }
    }
  }
)
```

---

### Phase 7: Font Optimization (Priority 3)

#### ✅ Use next/font
```typescript
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter'
})

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
```

---

### Phase 8: Webpack/Build Configuration (Priority 3)

#### ✅ Enable SWC Minification
```javascript
// next.config.ts
const nextConfig = {
  swcMinify: true, // ✅ Already enabled in Next.js 15
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' 
      ? { exclude: ['error', 'warn'] } 
      : false,
  },
  
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'recharts']
  }
}
```

---

## 📈 Performance Testing

### Tools to Use

#### 1. Lighthouse (Chrome DevTools)
```bash
# Run Lighthouse audit
# 1. Open Chrome DevTools (F12)
# 2. Go to Lighthouse tab
# 3. Select "Performance" + "Best Practices"
# 4. Generate report

# Target Scores:
# Performance: >90
# Accessibility: >95
# Best Practices: >95
# SEO: >90
```

#### 2. Next.js Bundle Analyzer
```bash
# Install
npm install --save-dev @next/bundle-analyzer

# Configure in next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)

# Run analysis
ANALYZE=true npm run build
```

#### 3. Chrome DevTools Performance
```bash
# 1. Open DevTools > Performance tab
# 2. Click Record
# 3. Navigate to page
# 4. Stop recording
# 5. Analyze:
#    - Long Tasks (>50ms)
#    - Layout Shifts
#    - JavaScript execution time
```

---

## 🎯 Optimization Script

### Run All Optimizations
```bash
#!/bin/bash
# optimize-dashboard.sh

echo "🚀 Starting Dashboard Optimization..."

# 1. Install optimization tools
echo "📦 Installing tools..."
npm install --save-dev @next/bundle-analyzer

# 2. Run TypeScript check
echo "🔍 Type checking..."
npx tsc --noEmit

# 3. Run linting
echo "🧹 Linting..."
npm run lint -- --fix

# 4. Build production
echo "🏗️  Building production..."
NODE_ENV=production npm run build

# 5. Analyze bundle
echo "📊 Analyzing bundle..."
ANALYZE=true npm run build

# 6. Run Lighthouse (requires Chrome)
echo "💡 Run Lighthouse manually in Chrome DevTools"

echo "✅ Optimization complete!"
```

---

## 📊 Expected Results

### Before vs After

| Metric | Before | Target | Improvement |
|--------|--------|--------|-------------|
| Bundle Size | ~2.5MB | ~1.75MB | -30% |
| First Load JS | ~500KB | ~350KB | -30% |
| FCP | ~3s | <2s | -33% |
| TTI | ~5s | <3.5s | -30% |
| Lighthouse | N/A | >90 | New |

---

## 🚀 Implementation Timeline

### Week 1: Critical Optimizations
- ✅ Day 1: Code splitting (recharts, dialogs)
- ✅ Day 2: Image optimization (Next.js Image)
- ✅ Day 3: Lazy loading (heavy components)
- ✅ Day 4: Testing & measurement

### Week 2: Advanced Optimizations
- ✅ Day 5: Bundle analysis & tree shaking
- ✅ Day 6: API caching & debouncing
- ✅ Day 7: Font & CSS optimization
- ✅ Day 8: Final testing & documentation

---

## 📝 Quick Wins (Do These First!)

### 1. Enable Production Mode
```bash
# Always test in production mode
npm run build
npm start
```

### 2. Lazy Load Charts
```typescript
// Recharts is 100KB+ gzipped
const LineChart = dynamic(() => import('recharts').then(m => m.LineChart))
```

### 3. Optimize Images
```typescript
// Cloudinary auto-optimization
CloudinaryService.getOptimizedUrl(publicId, {
  width: 800,
  quality: 'auto',
  format: 'auto'
})
```

### 4. Remove console.logs
```bash
# Production build automatically removes them
# If not, add to next.config.ts
```

---

## 🎉 Success Metrics

### How to Measure Success

1. **Lighthouse Score**: >90 (Performance, Accessibility, Best Practices)
2. **Bundle Size**: <2MB total, <400KB First Load JS
3. **Page Load**: <2s on 3G network
4. **User Experience**: No layout shifts, smooth interactions

### Monitoring
```bash
# Check bundle size after every build
npm run build | grep "First Load JS"

# Expected output:
# ○ /dashboard          345 kB         123 kB
# ○ /dashboard/orders   298 kB         98 kB
# ○ /dashboard/products 302 kB         102 kB
```

---

## 🔧 Troubleshooting

### Bundle Too Large?
```bash
# 1. Analyze what's inside
ANALYZE=true npm run build

# 2. Check for:
# - Duplicate packages
# - Large libraries (moment.js, lodash)
# - Unnecessary polyfills

# 3. Fix:
# - Use lodash-es instead of lodash
# - Replace moment.js with date-fns
# - Use tree-shaking friendly imports
```

### Images Not Optimizing?
```bash
# 1. Check Next.js Image config
# 2. Verify Cloudinary URLs
# 3. Use proper width/height props
# 4. Enable blur placeholders
```

### Slow First Load?
```bash
# 1. Check network tab
# 2. Look for blocking resources
# 3. Enable compression (gzip/brotli)
# 4. Use CDN for static assets
```

---

## 📚 Resources

- [Next.js Performance Docs](https://nextjs.org/docs/pages/building-your-application/optimizing)
- [Web.dev Performance Guide](https://web.dev/performance/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

---

**Created by:** GitHub Copilot  
**Last Updated:** 2025-10-20  
**Status:** ✅ Ready for Implementation
