import type { Metadata } from 'next';

/**
 * Site-wide metadata configuration
 */
export const SITE_CONFIG = {
  name: 'Audio Tài Lộc',
  description: 'Chuyên cung cấp thiết bị âm thanh chuyên nghiệp, loa, amply, micro và dịch vụ lắp đặt hệ thống âm thanh chất lượng cao tại TP.HCM',
  url: 'https://audiotailoc.com',
  locale: 'vi_VN',
  keywords: [
    'audio',
    'âm thanh',
    'loa',
    'amply',
    'micro',
    'karaoke',
    'hội trường',
    'sự kiện',
    'Audio Tài Lộc',
    'thiết bị âm thanh',
    'lắp đặt âm thanh',
    'TP.HCM',
  ],
} as const;

/**
 * Default metadata for the site
 */
export const defaultMetadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [...SITE_CONFIG.keywords],
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  metadataBase: new URL(SITE_CONFIG.url),
  openGraph: {
    type: 'website',
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

/**
 * Generate page-specific metadata
 */
export function generatePageMetadata(options: {
  title: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const { title, description, path, noIndex } = options;
  const url = path ? `${SITE_CONFIG.url}${path}` : SITE_CONFIG.url;
  
  return {
    title,
    description: description || SITE_CONFIG.description,
    openGraph: {
      title: `${title} | ${SITE_CONFIG.name}`,
      description: description || SITE_CONFIG.description,
      url,
    },
    twitter: {
      title: `${title} | ${SITE_CONFIG.name}`,
      description: description || SITE_CONFIG.description,
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

/**
 * Pre-defined metadata for common pages
 */
export const PAGE_METADATA = {
  home: generatePageMetadata({
    title: 'Trang chủ',
    description: 'Audio Tài Lộc - Chuyên cung cấp thiết bị âm thanh chuyên nghiệp và dịch vụ lắp đặt tại TP.HCM',
    path: '/',
  }),
  
  products: generatePageMetadata({
    title: 'Sản phẩm',
    description: 'Khám phá các sản phẩm âm thanh chất lượng cao: loa, amply, micro, mixer và nhiều thiết bị khác',
    path: '/products',
  }),
  
  services: generatePageMetadata({
    title: 'Dịch vụ',
    description: 'Dịch vụ lắp đặt, sửa chữa và bảo trì hệ thống âm thanh chuyên nghiệp',
    path: '/services',
  }),
  
  blog: generatePageMetadata({
    title: 'Blog',
    description: 'Tin tức, hướng dẫn và kiến thức về âm thanh chuyên nghiệp',
    path: '/blog',
  }),
  
  contact: generatePageMetadata({
    title: 'Liên hệ',
    description: 'Liên hệ Audio Tài Lộc để được tư vấn về thiết bị và dịch vụ âm thanh',
    path: '/contact',
  }),
  
  cart: generatePageMetadata({
    title: 'Giỏ hàng',
    description: 'Xem và quản lý giỏ hàng của bạn',
    path: '/cart',
    noIndex: true,
  }),
  
  checkout: generatePageMetadata({
    title: 'Thanh toán',
    description: 'Hoàn tất đơn hàng của bạn',
    path: '/checkout',
    noIndex: true,
  }),
  
  profile: generatePageMetadata({
    title: 'Hồ sơ',
    description: 'Quản lý thông tin tài khoản của bạn',
    path: '/profile',
    noIndex: true,
  }),
  
  orders: generatePageMetadata({
    title: 'Đơn hàng',
    description: 'Xem lịch sử đơn hàng của bạn',
    path: '/orders',
    noIndex: true,
  }),
  
  wishlist: generatePageMetadata({
    title: 'Yêu thích',
    description: 'Danh sách sản phẩm yêu thích của bạn',
    path: '/wishlist',
    noIndex: true,
  }),
  
  bookingHistory: generatePageMetadata({
    title: 'Lịch sử đặt lịch',
    description: 'Xem lịch sử đặt lịch dịch vụ của bạn',
    path: '/booking-history',
    noIndex: true,
  }),
  
  categories: generatePageMetadata({
    title: 'Danh mục',
    description: 'Xem sản phẩm theo danh mục',
    path: '/danh-muc',
  }),
  
  projects: generatePageMetadata({
    title: 'Dự án',
    description: 'Các dự án âm thanh đã thực hiện bởi Audio Tài Lộc',
    path: '/du-an',
  }),
  
  support: generatePageMetadata({
    title: 'Hỗ trợ',
    description: 'Trung tâm hỗ trợ khách hàng Audio Tài Lộc',
    path: '/support',
  }),
  
  knowledgeBase: generatePageMetadata({
    title: 'Kiến thức âm thanh',
    description: 'Thư viện kiến thức về thiết bị và kỹ thuật âm thanh',
    path: '/knowledge-base',
  }),
  
  admin: generatePageMetadata({
    title: 'Quản trị',
    description: 'Trang quản trị hệ thống',
    noIndex: true,
  }),
} as const;
