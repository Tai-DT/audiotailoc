// Mock data for demonstration when database is not available
export const mockProducts = [
  {
    id: '1',
    slug: 'loa-bluetooth-sony-xb23',
    name: 'Loa Bluetooth Sony SRS-XB23',
    description: 'Loa bluetooth chống nước IP67, âm thanh EXTRA BASS mạnh mẽ, pin 12 giờ',
    priceCents: 149000000, // 1,490,000 VND
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
    categoryId: '1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2', 
    slug: 'tai-nghe-airpods-pro',
    name: 'Apple AirPods Pro (2nd generation)',
    description: 'Tai nghe không dây với tính năng chống ồn chủ động, âm thanh Spatial Audio',
    priceCents: 649000000, // 6,490,000 VND
    imageUrl: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400',
    categoryId: '2',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    slug: 'loa-gaming-logitech-g560',
    name: 'Loa Gaming Logitech G560',
    description: 'Loa gaming RGB với âm thanh DTS:X Ultra surround sound, kết nối wireless',
    priceCents: 329000000, // 3,290,000 VND
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400',
    categoryId: '3',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
  },
  {
    id: '4',
    slug: 'mic-recording-blue-yeti',
    name: 'Micro Blue Yeti USB',
    description: 'Micro thu âm chuyên nghiệp với 4 pattern pickup, chất lượng studio',
    priceCents: 225000000, // 2,250,000 VND
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400',
    categoryId: '4',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  }
];

export const mockCategories = [
  {
    id: '1',
    slug: 'loa-bluetooth',
    name: 'Loa Bluetooth',
    parentId: null,
  },
  {
    id: '2', 
    slug: 'tai-nghe',
    name: 'Tai nghe',
    parentId: null,
  },
  {
    id: '3',
    slug: 'loa-gaming',
    name: 'Loa Gaming',
    parentId: null,
  },
  {
    id: '4',
    slug: 'microphone',
    name: 'Microphone',
    parentId: null,
  }
];

export const mockUsers = [
  {
    id: 'admin1',
    email: 'admin@audiotailoc.com',
    name: 'Admin User',
    role: 'ADMIN',
    password: '$2b$10$dummy.hash.for.password123', // password: admin123
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'user1',
    email: 'user@example.com', 
    name: 'Test User',
    role: 'USER',
    password: '$2b$10$dummy.hash.for.password456', // password: user123
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  }
];