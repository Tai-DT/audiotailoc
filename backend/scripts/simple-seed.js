console.log('🌱 Starting to seed categories and service types...');

// Simple seeding without Prisma client for now
const categories = [
  { name: 'Âm thanh chuyên nghiệp', slug: 'am-thanh-chuyen-nghiep' },
  { name: 'Thiết bị ghi âm', slug: 'thiet-bi-ghi-am' },
  { name: 'Loa & Amplifier', slug: 'loa-amplifier' },
  { name: 'Microphone', slug: 'microphone' },
  { name: 'Mixer & Console', slug: 'mixer-console' },
  { name: 'Phụ kiện âm thanh', slug: 'phu-kien-am-thanh' },
];

const serviceTypes = [
  { name: 'Lắp đặt hệ thống', slug: 'lap-dat-he-thong' },
  { name: 'Bảo trì - Sửa chữa', slug: 'bao-tri-sua-chua' },
  { name: 'Tư vấn kỹ thuật', slug: 'tu-van-ky-thuat' },
  { name: 'Đào tạo - Huấn luyện', slug: 'dao-tao-huan-luyen' },
  { name: 'Thuê thiết bị', slug: 'thue-thiet-bi' },
];

console.log('📋 Categories to seed:', categories.length);
console.log('📋 Service types to seed:', serviceTypes.length);
console.log('✅ Script ready - run with proper Prisma setup when backend is running');