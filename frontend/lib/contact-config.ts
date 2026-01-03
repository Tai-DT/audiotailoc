// Contact information configuration
// NOTE: Fallback configuration. In production, use useContactInfo hook which fetches from /site/contact-info API
export const CONTACT_CONFIG = {
  // Zalo chat configuration
  zalo: {
    phoneNumber: '0768426262', // Số Zalo chính thức
    displayName: 'Audio Tài Lộc',
    welcomeMessage: 'Xin chào! Chúng tôi có thể giúp gì cho bạn?'
  },

  // Other contact methods
  phone: {
    number: '0768426262',
    display: '0768 426 262',
    hotline: '0768 426 262',
    hotlineNumber: '0768426262'
  },

  email: 'audiotailoc@gmail.com',

  address: {
    full: '37/9 Đường 44, Phường Linh Đông, TP. Thủ Đức, TP.HCM',
    street: '37/9 Đường 44',
    ward: 'Phường Linh Đông',
    district: 'TP. Thủ Đức',
    city: 'TP. Hồ Chí Minh',
    country: 'Việt Nam'
  },

  social: {
    facebook: 'https://facebook.com/audiotailoc',
    instagram: 'https://instagram.com/audiotailoc',
    youtube: 'https://youtube.com/audiotailoc',
    zalo: 'https://zalo.me/0768426262'
  },

  businessHours: {
    weekdays: '08:00 - 21:00',
    weekend: '08:00 - 21:00',
    display: '08:00 - 21:00 (T2 - CN)'
  }
} as const;