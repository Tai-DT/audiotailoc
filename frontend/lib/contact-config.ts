// Contact information configuration
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