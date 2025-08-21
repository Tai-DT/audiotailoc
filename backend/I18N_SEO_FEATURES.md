# Internationalization (i18n) and SEO Features

## Overview

This document describes the multi-language support (Vietnamese/English) and SEO optimization features implemented in the Audio Tài Lộc backend.

## 🌍 Internationalization (i18n)

### Supported Languages
- **Vietnamese (vi)** - Default language
- **English (en)** - Secondary language

### Database Schema Changes

The following models have been extended with multi-language fields:

#### Product Model
```sql
-- Vietnamese fields (existing)
name VARCHAR
description TEXT

-- English fields (new)
nameEn VARCHAR
descriptionEn TEXT

-- SEO fields (new)
metaTitle VARCHAR
metaTitleEn VARCHAR
metaDescription TEXT
metaDescriptionEn TEXT
metaKeywords VARCHAR
metaKeywordsEn VARCHAR
canonicalUrl VARCHAR
ogImage VARCHAR
ogTitle VARCHAR
ogTitleEn VARCHAR
ogDescription TEXT
ogDescriptionEn TEXT
```

#### Category Model
```sql
-- Vietnamese fields (existing)
name VARCHAR
description TEXT

-- English fields (new)
nameEn VARCHAR
descriptionEn TEXT

-- SEO fields (new)
metaTitle VARCHAR
metaTitleEn VARCHAR
metaDescription TEXT
metaDescriptionEn TEXT
metaKeywords VARCHAR
metaKeywordsEn VARCHAR
canonicalUrl VARCHAR
```

#### Page Model
```sql
-- Vietnamese fields (existing)
title VARCHAR
content TEXT

-- English fields (new)
titleEn VARCHAR
contentEn TEXT

-- SEO fields (new)
metaTitle VARCHAR
metaTitleEn VARCHAR
metaDescription TEXT
metaDescriptionEn TEXT
metaKeywords VARCHAR
metaKeywordsEn VARCHAR
canonicalUrl VARCHAR
ogImage VARCHAR
ogTitle VARCHAR
ogTitleEn VARCHAR
ogDescription TEXT
ogDescriptionEn TEXT
```

#### Project Model
```sql
-- Vietnamese fields (existing)
name VARCHAR
description TEXT
content TEXT

-- English fields (new)
nameEn VARCHAR
descriptionEn TEXT
contentEn TEXT

-- SEO fields (new)
metaTitle VARCHAR
metaTitleEn VARCHAR
metaDescription TEXT
metaDescriptionEn TEXT
metaKeywords VARCHAR
metaKeywordsEn VARCHAR
canonicalUrl VARCHAR
ogImage VARCHAR
ogTitle VARCHAR
ogTitleEn VARCHAR
ogDescription TEXT
ogDescriptionEn TEXT
```

### API Endpoints

#### Language Management
```http
GET /api/v1/i18n/languages
```
Returns supported languages and default language.

#### Translation Endpoints
```http
GET /api/v1/i18n/translations/common?lang=vi
GET /api/v1/i18n/translations/common?lang=en
GET /api/v1/i18n/translations/products?lang=vi
GET /api/v1/i18n/translations/products?lang=en
```

#### Localized Content Endpoints
```http
GET /api/v1/i18n/products/:id?lang=vi
GET /api/v1/i18n/products/:id?lang=en
GET /api/v1/i18n/categories/:id?lang=vi
GET /api/v1/i18n/categories/:id?lang=en
GET /api/v1/i18n/pages/:slug?lang=vi
GET /api/v1/i18n/pages/:slug?lang=en
GET /api/v1/i18n/projects/:slug?lang=vi
GET /api/v1/i18n/projects/:slug?lang=en
```

### Language Detection

The system supports multiple ways to detect user language:

1. **Query Parameter**: `?lang=en`
2. **Cookie**: `lang=en`
3. **Accept-Language Header**: `Accept-Language: en-US,en;q=0.9`
4. **Default**: Vietnamese (vi)

## 🔍 SEO Features

### SEO Data Structure

Each page type provides comprehensive SEO data:

```typescript
interface PageSeoData {
  type: 'product' | 'category' | 'page' | 'project' | 'home';
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  structuredData?: any;
}
```

### SEO Endpoints

#### Page-specific SEO
```http
GET /api/v1/seo/product/:id?lang=vi
GET /api/v1/seo/category/:id?lang=vi
GET /api/v1/seo/page/:slug?lang=vi
GET /api/v1/seo/project/:slug?lang=vi
GET /api/v1/seo/home?lang=vi
```

#### SEO Files
```http
GET /api/v1/seo/sitemap.xml
GET /api/v1/seo/robots.txt
```

### SEO Features

#### 1. Meta Tags
- Title tags with language-specific content
- Meta descriptions optimized for search engines
- Meta keywords for better indexing
- Canonical URLs to prevent duplicate content

#### 2. Open Graph (Facebook)
- og:title
- og:description
- og:image
- og:type

#### 3. Twitter Cards
- twitter:card
- twitter:title
- twitter:description
- twitter:image

#### 4. Structured Data (JSON-LD)
- Product schema markup
- Organization schema
- Breadcrumb schema

#### 5. Sitemap Generation
- Automatic XML sitemap generation
- Includes all products, categories, pages, and projects
- Proper priority and change frequency settings

#### 6. Robots.txt
- Search engine crawling instructions
- Sitemap location reference
- Disallow rules for admin areas

## 🚀 Usage Examples

### Frontend Integration

#### React/Next.js Example
```javascript
// Get SEO data for a product
const getProductSeo = async (productId, lang = 'vi') => {
  const response = await fetch(`/api/v1/seo/product/${productId}?lang=${lang}`);
  const seoData = await response.json();
  
  // Update document head
  document.title = seoData.title;
  
  // Update meta tags
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.setAttribute('content', seoData.description);
  
  // Update Open Graph tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', seoData.ogTitle);
  
  // Add structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(seoData.structuredData);
  document.head.appendChild(script);
};

// Get translations
const getTranslations = async (lang = 'vi') => {
  const response = await fetch(`/api/v1/i18n/translations/common?lang=${lang}`);
  return await response.json();
};
```

#### Vue.js Example
```javascript
// Language switching
const switchLanguage = async (lang) => {
  // Set cookie
  document.cookie = `lang=${lang}; path=/; max-age=31536000`;
  
  // Reload translations
  const translations = await getTranslations(lang);
  this.$i18n.setLocaleMessage(lang, translations);
  this.$i18n.locale = lang;
  
  // Update SEO
  await updatePageSeo(lang);
};
```

### Content Management

#### Adding Multi-language Content
```javascript
// Create product with both languages
const product = await prisma.product.create({
  data: {
    name: 'Tai nghe Sony WH-1000XM4',
    nameEn: 'Sony WH-1000XM4 Headphones',
    description: 'Tai nghe chống ồn hàng đầu thế giới',
    descriptionEn: 'World-leading noise-canceling headphones',
    metaTitle: 'Tai nghe Sony WH-1000XM4 - Audio Tài Lộc',
    metaTitleEn: 'Sony WH-1000XM4 Headphones - Audio Tài Lộc',
    metaDescription: 'Mua tai nghe Sony WH-1000XM4 chính hãng tại Audio Tài Lộc',
    metaDescriptionEn: 'Buy genuine Sony WH-1000XM4 headphones at Audio Tài Lộc',
    // ... other fields
  }
});
```

## 📊 Performance Considerations

### Caching Strategy
- Translation data is cached in memory
- SEO data is cached with 5-minute TTL
- Sitemap is cached for 1 hour

### Database Optimization
- Indexes on language-specific fields
- Efficient queries with proper joins
- Lazy loading for large content

## 🔧 Configuration

### Environment Variables
```env
# Default language
DEFAULT_LANGUAGE=vi

# Site configuration
SITE_NAME="Audio Tài Lộc"
SITE_URL=https://audiotailoc.com

# SEO configuration
SEO_DEFAULT_IMAGE=/images/default-og.jpg
SEO_TWITTER_HANDLE=@audiotailoc
```

### Customization
- Add new languages by extending the `SupportedLanguage` type
- Customize translation keys in the service
- Modify SEO templates for different page types
- Add new structured data schemas

## 🧪 Testing

Run the test script to verify all features:
```bash
node test-i18n-seo.js
```

This will test:
- Language detection and switching
- Translation retrieval
- SEO data generation
- Sitemap and robots.txt generation
- Structured data creation

## 📈 SEO Benefits

1. **Better Search Rankings**: Optimized meta tags and structured data
2. **Social Media Sharing**: Rich previews on Facebook, Twitter, etc.
3. **International SEO**: Multi-language support for global reach
4. **Technical SEO**: Proper sitemaps and robots.txt
5. **User Experience**: Language-specific content and navigation

## 🔮 Future Enhancements

1. **Additional Languages**: Support for more languages (Chinese, Korean, etc.)
2. **Dynamic Translations**: Admin interface for translation management
3. **SEO Analytics**: Track SEO performance and rankings
4. **Advanced Structured Data**: More schema types (Reviews, FAQs, etc.)
5. **Automatic SEO**: AI-powered meta tag generation

