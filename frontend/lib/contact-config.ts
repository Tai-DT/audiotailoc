// Contact information configuration
export const CONTACT_CONFIG = {
  // Zalo chat configuration
  zalo: {
    phoneNumber: '0987654321', // Replace with your actual Zalo phone number
    displayName: 'Audio Tài Lộc',
    welcomeMessage: 'Xin chào! Chúng tôi có thể giúp gì cho bạn?'
  },

  // Other contact methods
  phone: {
    number: '0987654321',
    display: '0987 654 321',
    hotline: '1900 2468',
    hotlineNumber: '19002468'
  },

  email: 'info@audiotailoc.com',

  address: {
    street: '123 Đường ABC',
    city: 'Hồ Chí Minh',
    country: 'Việt Nam'
  },

  social: {
    facebook: 'https://facebook.com/audiotailoc',
    instagram: 'https://instagram.com/audiotailoc',
    youtube: 'https://youtube.com/audiotailoc'
  }
} as const;