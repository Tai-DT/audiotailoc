/**
 * Site-wide configuration for Audio Tài Lộc
 * Centralized config for business info, SEO, and feature flags
 */

import { CONTACT_CONFIG } from './contact-config';

// ==================== BUSINESS INFO ====================
export const BUSINESS_INFO = {
  name: 'Audio Tài Lộc',
  shortName: 'ATL',
  tagline: 'Thiết bị âm thanh chuyên nghiệp',
  description: 'Chuyên cung cấp thiết bị âm thanh chất lượng cao và dịch vụ kỹ thuật chuyên nghiệp.',
  longDescription: 'Audio Tài Lộc - Chuyên cung cấp thiết bị âm thanh chất lượng cao: Dàn karaoke gia đình, Loa JBL, Ampli, Micro không dây, Mixer. Dịch vụ lắp đặt, bảo hành tại TP.HCM.',
  foundedYear: 2019,
  experience: '5+ năm',
  
  // Stats for display
  stats: {
    products: '500+',
    customers: '1000+',
    experience: '5+ năm',
    satisfaction: '98%',
  },
} as const;

// ==================== SEO DEFAULTS ====================
export const SEO_CONFIG = {
  siteName: 'Audio Tài Lộc',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotailoc.com',
  locale: 'vi_VN',
  language: 'vi',
  
  // Default meta
  defaultTitle: 'Audio Tài Lộc - Thiết bị âm thanh chuyên nghiệp | Dàn Karaoke, Loa, Ampli, Micro',
  titleTemplate: '%s | Audio Tài Lộc',
  defaultDescription: BUSINESS_INFO.longDescription,
  
  // Open Graph
  ogType: 'website' as const,
  ogImage: '/og-image.jpg',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  
  // Twitter
  twitterCard: 'summary_large_image' as const,
  
  // Keywords
  defaultKeywords: [
    'thiết bị âm thanh',
    'dàn karaoke',
    'loa karaoke',
    'loa JBL',
    'loa Bose',
    'amplifier',
    'ampli karaoke',
    'micro không dây',
    'micro Shure',
    'mixer',
    'hệ thống âm thanh',
    'âm thanh hội nghị',
    'âm thanh sân khấu',
    'audio tài lộc',
    'audiotailoc',
    'thiết bị âm thanh tphcm',
  ],
  
  // Geo location
  geo: {
    region: 'VN-SG',
    placename: 'Ho Chi Minh City',
    position: '10.8231;106.6297',
  },
} as const;

// ==================== NAVIGATION ====================
export const NAVIGATION = {
  // Primary navigation links
  primary: [
    { href: '/du-an', label: 'Dự án', description: 'Các dự án đã thực hiện' },
    { href: '/blog', label: 'Blog', description: 'Tin tức và bài viết' },
    { href: '/support', label: 'Hỗ trợ', description: 'Trung tâm hỗ trợ' },
    { href: '/contact', label: 'Liên hệ', description: 'Liên hệ với chúng tôi' },
  ],
  
  // Quick access categories
  quickCategories: [
    { label: 'Micro', href: '/products?category=microphone', icon: 'mic' },
    { label: 'Loa', href: '/products?category=loa-karaoke', icon: 'speaker' },
    { label: 'Mixer', href: '/products?category=vang-so-mixer', icon: 'sliders' },
    { label: 'Thanh Lý', href: '/products?category=hang-thanh-ly-hang-cu', icon: 'package' },
  ],
  
  // Footer links  
  footerQuickLinks: [
    { href: '/products', label: 'Sản phẩm' },
    { href: '/services', label: 'Dịch vụ' },
    { href: '/du-an', label: 'Dự án' },
    { href: '/contact', label: 'Liên hệ' },
  ],
  
  // Policy links
  policyLinks: [
    { href: '/privacy', label: 'Chính sách bảo mật' },
    { href: '/terms', label: 'Điều khoản sử dụng' },
    { href: '/shipping-policy', label: 'Chính sách giao hàng' },
    { href: '/warranty', label: 'Chính sách bảo hành' },
    { href: '/return-policy', label: 'Chính sách đổi trả' },
    { href: '/technical-support', label: 'Hỗ trợ kỹ thuật' },
  ],
} as const;

// ==================== FEATURE FLAGS ====================
export const FEATURES = {
  // Chat features
  enableZaloChat: true,
  enableLiveChat: true,
  
  // Newsletter
  enableNewsletter: true,
  
  // Reviews
  enableProductReviews: true,
  enableServiceReviews: true,
  
  // Wishlist
  enableWishlist: true,
  
  // Notifications
  enablePushNotifications: false,
  
  // Performance
  enableLazyLoading: true,
  enableImageOptimization: true,
} as const;

// ==================== UI CONFIG ====================
export const UI_CONFIG = {
  // Animation defaults
  animation: {
    duration: {
      fast: 0.2,
      normal: 0.3,
      slow: 0.5,
    },
    easing: 'easeOut',
  },
  
  // Pagination defaults
  pagination: {
    defaultPageSize: 12,
    productPageSize: 12,
    blogPageSize: 9,
    orderPageSize: 10,
  },
  
  // Image dimensions
  images: {
    product: {
      width: 400,
      height: 400,
    },
    banner: {
      width: 1920,
      height: 600,
    },
    thumbnail: {
      width: 100,
      height: 100,
    },
  },
  
  // Toast config
  toast: {
    duration: 4000,
    successDuration: 3000,
    errorDuration: 5000,
    position: 'top-right' as const,
  },
} as const;

// ==================== PROMO MESSAGES ====================
export const PROMO_MESSAGES = {
  freeShipping: 'Miễn phí vận chuyển từ 500k',
  support247: 'Tư vấn kỹ thuật 24/7',
  warranty: 'Bảo hành chính hãng',
  promotions: 'Ưu đãi đặc biệt',
  
  // Login benefits
  loginBenefits: [
    'Miễn phí vận chuyển từ 500k',
    'Ưu đãi đặc biệt',
    'Tư vấn kỹ thuật 24/7',
  ],
} as const;

// ==================== EXPORTS ====================
// Re-export contact config for convenience
export { CONTACT_CONFIG };

// Combined site config
export const SITE_CONFIG = {
  business: BUSINESS_INFO,
  seo: SEO_CONFIG,
  navigation: NAVIGATION,
  features: FEATURES,
  ui: UI_CONFIG,
  promo: PROMO_MESSAGES,
  contact: CONTACT_CONFIG,
} as const;

export default SITE_CONFIG;
