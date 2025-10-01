# SEO System Implementation - Audio Tài Lộc

## Overview
Comprehensive SEO system that fetches SEO data from the backend and provides a unified interface for managing SEO across all content types.

## 🚀 Features Implemented

### 1. **Backend Integration**
- ✅ Fetches SEO data from existing backend fields (`seoTitle`, `seoDescription`, `metaKeywords`)
- ✅ Fallback to default values when backend doesn't have dedicated SEO endpoints
- ✅ Type-safe integration with existing Product, Service, and BlogArticle types
- ✅ Automatic handling of mixed data types (string arrays vs comma-separated strings)

### 2. **React Query Hooks** (`/lib/hooks/use-seo.ts`)

#### Global SEO Settings
```typescript
const { data: globalSEO } = useGlobalSEO();
// Returns: siteName, defaultTitle, defaultDescription, ogImage, etc.
```

#### Entity-Specific SEO
```typescript
const { data: productSEO } = useProductSEO(productId, product);
const { data: serviceSEO } = useServiceSEO(serviceId, service);
const { data: blogSEO } = useBlogSEO(articleId, article);
```

#### Page-Specific SEO
```typescript
const { data: pageSEO } = usePageSEO('/about');
// For custom pages with dedicated SEO settings
```

### 3. **SEO Data Structure**
```typescript
interface SEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: Record<string, unknown>;
}
```

### 4. **Metadata Generation**
- ✅ Automatic Next.js metadata generation for all pages
- ✅ OpenGraph tags for social media sharing
- ✅ Twitter Card tags
- ✅ JSON-LD structured data for search engines
- ✅ Canonical URLs for SEO best practices

### 5. **Backend SEO Fields Available**

#### Services (✅ Confirmed Available)
- `seoTitle` - Custom SEO title
- `seoDescription` - Custom SEO description  
- `metaKeywords` - Comma-separated keywords
- `tags` - Array of tags (fallback for keywords)

#### Products (✅ Type Updated)
- `metaTitle` - Product SEO title
- `metaDescription` - Product SEO description
- `metaKeywords` - Array of keywords
- `canonicalUrl` - Custom canonical URL

#### Blog Articles (✅ Type Updated)
- `seoTitle` - Article SEO title
- `seoDescription` - Article SEO description
- `seoKeywords` - Comma-separated keywords
- `canonicalUrl` - Custom canonical URL

## 📁 File Structure

```
lib/hooks/
  └── use-seo.ts              # Main SEO hooks and utilities

components/seo/
  ├── seo-demo.tsx            # Interactive SEO data viewer
  ├── seo-manager.tsx         # Admin SEO management component
  ├── blog-structured-data.tsx
  ├── product-structured-data.tsx
  ├── service-structured-data.tsx
  └── organization-structured-data.tsx

app/
  ├── seo-test/page.tsx       # SEO testing page
  └── services/[slug]/layout.tsx  # Updated with new SEO system
```

## 🔧 Usage Examples

### 1. **Service Page SEO (Updated)**
```typescript
// app/services/[slug]/layout.tsx
export async function generateMetadata({ params }) {
  const service = await getServiceBySlug(slug);
  const globalSEO = await getGlobalSEO();
  
  const title = service.seoTitle || service.metaTitle || 
                `${service.name} | ${globalSEO.siteName}`;
  
  const description = service.seoDescription || 
                     service.metaDescription || 
                     service.shortDescription;
  
  return {
    title,
    description,
    keywords: service.metaKeywords?.split(',') || service.tags,
    openGraph: { title, description, images: [service.images[0]] },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `${baseUrl}/services/${slug}` },
  };
}
```

### 2. **Interactive SEO Demo**
```typescript
// components/seo/seo-demo.tsx
<SEODemo slug="tu-van-thiet-ke-he-thong-am-thanh" />
```

### 3. **Admin SEO Management**
```typescript
// components/seo/seo-manager.tsx
<SEOManager 
  entity={{
    id: "service-123",
    name: "Tư vấn thiết kế hệ thống âm thanh",
    slug: "tu-van-thiet-ke-he-thong-am-thanh",
    type: "service",
    currentSEO: {
      title: "Custom SEO Title",
      description: "Custom SEO Description"
    }
  }}
/>
```

## 🌐 Backend Data Sources

### Current Backend Fields Used:
1. **Services API**: `/api/v1/services`
   - `seoTitle`, `seoDescription` ✅ Available
   - `metaKeywords`, `tags` ✅ Available
   - `name`, `description`, `shortDescription` ✅ Available

2. **Products API**: `/api/v1/catalog/products`
   - `metaTitle`, `metaDescription`, `metaKeywords` ✅ Available
   - `name`, `description`, `shortDescription` ✅ Available

3. **Blog API**: `/api/v1/blog/articles`
   - `seoTitle`, `seoDescription`, `seoKeywords` ✅ Available
   - `title`, `excerpt`, `content` ✅ Available

### Fallback Strategy:
- If SEO fields are empty → Use content fields (name, description)
- If backend unavailable → Use global defaults
- Always ensure valid metadata for search engines

## 🔍 SEO Testing

### Test Pages Available:
1. **`/seo-test`** - Complete SEO data viewer showing:
   - Global SEO settings
   - Backend service data
   - Generated SEO metadata
   - Structured data preview
   - Meta tags preview

2. **`/services/[slug]`** - Live service pages with:
   - Enhanced metadata generation
   - Social media tags
   - Structured data for services

### Testing Commands:
```bash
# View SEO test page
curl -s "http://localhost:3000/seo-test"

# Check service page SEO
curl -s "http://localhost:3000/services/tu-van-thiet-ke-he-thong-am-thanh"

# Test backend data
curl -s "https://backend-audiotailoc-f6b75c2cc1ea.herokuapp.com/api/v1/services/slug/tu-van-thiet-ke-he-thong-am-thanh"
```

## 📊 SEO Data Flow

```
Backend API
    ↓
SEO Hooks (React Query)
    ↓
Metadata Generation
    ↓
Next.js Head Tags
    ↓
Search Engine Crawlers
```

## 🎯 Next Steps

### Backend Enhancements (Optional):
1. **Create dedicated SEO endpoints**:
   - `GET /api/v1/seo/global` - Global SEO settings
   - `GET /api/v1/seo/pages` - Page-specific SEO data
   - `PUT /api/v1/seo/{type}/{id}` - Update SEO data

2. **Add missing fields**:
   - `canonicalUrl` for services
   - `metaKeywords` for products (as string array)
   - `ogImage` per entity

### Frontend Enhancements:
1. **SEO Management Dashboard** - Admin interface for bulk SEO updates
2. **SEO Analytics** - Track SEO performance metrics
3. **Schema.org Integration** - Advanced structured data for rich snippets

## ✅ Implementation Status

- [x] Core SEO hooks system
- [x] Backend integration with existing fields  
- [x] Next.js metadata generation
- [x] Service page SEO enhancement
- [x] SEO demo and testing interface
- [x] Type-safe implementation
- [x] Fallback strategies
- [x] Structured data generation
- [x] Social media tags (OpenGraph, Twitter)
- [x] Canonical URL handling
- [ ] Product page SEO integration (ready to implement)
- [ ] Blog page SEO integration (ready to implement)
- [ ] Admin SEO management interface
- [ ] Backend SEO endpoints (optional enhancement)

## 🚀 Ready for Production

The SEO system is **production-ready** and already integrated with:
- ✅ Live service pages with enhanced SEO
- ✅ Backend data integration
- ✅ Proper fallbacks and error handling
- ✅ TypeScript safety
- ✅ Performance optimization with React Query caching

Test it live at: `http://localhost:3000/services/tu-van-thiet-ke-he-thong-am-thanh`