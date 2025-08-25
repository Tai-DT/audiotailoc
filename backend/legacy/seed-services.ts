import { PrismaClient, ServiceCategory, ServiceType } from '@prisma/client';

const prisma = new PrismaClient();

async function seedServices() {
  console.log('🌱 Seeding services...');

  // Create sample services
  const services = [
    {
      name: 'Lắp đặt âm thanh gia đình',
      slug: 'lap-dat-am-thanh-gia-dinh',
      description: 'Dịch vụ lắp đặt hệ thống âm thanh cho gia đình với chất lượng cao, đảm bảo âm thanh sống động và rõ ràng.',
      category: ServiceCategory.INSTALLATION,
      type: ServiceType.HOME_THEATER,
      basePriceCents: 200000000, // 2,000,000 VND
      estimatedDuration: 240, // 4 hours
      requirements: JSON.stringify([
        'Nhà có điện 220V',
        'Không gian tối thiểu 20m2',
        'Tường đủ cứng để gắn loa'
      ]),
      features: JSON.stringify([
        'Âm thanh surround 5.1',
        'Kết nối Bluetooth',
        'Điều khiển từ xa',
        'Bảo hành 24 tháng'
      ]),
      imageUrl: 'https://example.com/home-theater-installation.jpg',
      items: [
        {
          name: 'Loa trung tâm',
          description: 'Loa trung tâm chất lượng cao',
          priceCents: 300000000, // 3,000,000 VND
          isRequired: true,
        },
        {
          name: 'Loa trầm',
          description: 'Loa siêu trầm cho âm bass sâu',
          priceCents: 500000000, // 5,000,000 VND
          isRequired: false,
        },
        {
          name: 'Dây cáp chuyên dụng',
          description: 'Dây cáp âm thanh chất lượng cao',
          priceCents: 50000000, // 500,000 VND
          isRequired: true,
        }
      ]
    },
    {
      name: 'Âm thanh chuyên nghiệp sự kiện',
      slug: 'am-thanh-chuyen-nghiep-su-kien',
      description: 'Dịch vụ cho thuê và lắp đặt hệ thống âm thanh chuyên nghiệp cho các sự kiện, hội nghị, tiệc cưới.',
      category: ServiceCategory.RENTAL,
      type: ServiceType.PROFESSIONAL_SOUND,
      basePriceCents: 500000000, // 5,000,000 VND
      estimatedDuration: 480, // 8 hours
      requirements: JSON.stringify([
        'Nguồn điện 3 pha',
        'Không gian sự kiện tối thiểu 100m2',
        'Có mặt bằng để đặt thiết bị'
      ]),
      features: JSON.stringify([
        'Hệ thống mixer chuyên nghiệp',
        'Micro không dây',
        'Loa line array',
        'Ánh sáng sân khấu'
      ]),
      imageUrl: 'https://example.com/professional-sound.jpg',
      items: [
        {
          name: 'Bộ mixer chuyên nghiệp',
          description: 'Mixer 32 kênh với hiệu ứng',
          priceCents: 200000000, // 2,000,000 VND
          isRequired: true,
        },
        {
          name: 'Micro không dây',
          description: 'Bộ micro không dây chất lượng cao',
          priceCents: 100000000, // 1,000,000 VND
          isRequired: true,
        },
        {
          name: 'Ánh sáng sân khấu',
          description: 'Hệ thống đèn LED nhiều màu',
          priceCents: 150000000, // 1,500,000 VND
          isRequired: false,
        }
      ]
    },
    {
      name: 'Bảo trì hệ thống âm thanh',
      slug: 'bao-tri-he-thong-am-thanh',
      description: 'Dịch vụ bảo trì, vệ sinh và kiểm tra định kỳ hệ thống âm thanh để đảm bảo hoạt động tối ưu.',
      category: ServiceCategory.MAINTENANCE,
      type: ServiceType.MAINTENANCE,
      basePriceCents: 100000000, // 1,000,000 VND
      estimatedDuration: 120, // 2 hours
      requirements: JSON.stringify([
        'Hệ thống đã được lắp đặt',
        'Có sẵn dụng cụ vệ sinh',
        'Tiếp cận được tất cả thiết bị'
      ]),
      features: JSON.stringify([
        'Vệ sinh toàn bộ thiết bị',
        'Kiểm tra kết nối',
        'Cập nhật firmware',
        'Báo cáo tình trạng'
      ]),
      imageUrl: 'https://example.com/maintenance.jpg',
      items: [
        {
          name: 'Vệ sinh chuyên sâu',
          description: 'Vệ sinh toàn bộ thiết bị với hóa chất chuyên dụng',
          priceCents: 50000000, // 500,000 VND
          isRequired: true,
        },
        {
          name: 'Thay thế linh kiện',
          description: 'Thay thế các linh kiện hỏng (nếu có)',
          priceCents: 200000000, // 2,000,000 VND
          isRequired: false,
        }
      ]
    },
    {
      name: 'Thu mua thiết bị cũ',
      slug: 'thu-mua-thiet-bi-cu',
      description: 'Dịch vụ thu mua và thanh lý các thiết bị âm thanh cũ với giá hợp lý, hỗ trợ khách hàng nâng cấp hệ thống.',
      category: ServiceCategory.LIQUIDATION,
      type: ServiceType.AUDIO_EQUIPMENT,
      basePriceCents: 0, // Giá sẽ được tính theo thiết bị
      estimatedDuration: 60, // 1 hour
      requirements: JSON.stringify([
        'Thiết bị còn hoạt động',
        'Có đầy đủ phụ kiện',
        'Không bị hỏng nặng'
      ]),
      features: JSON.stringify([
        'Định giá miễn phí',
        'Thu mua tại nhà',
        'Thanh toán ngay',
        'Hỗ trợ vận chuyển'
      ]),
      imageUrl: 'https://example.com/liquidation.jpg',
      items: [
        {
          name: 'Đánh giá thiết bị',
          description: 'Dịch vụ đánh giá và định giá thiết bị',
          priceCents: 10000000, // 100,000 VND
          isRequired: true,
        },
        {
          name: 'Vận chuyển',
          description: 'Dịch vụ vận chuyển thiết bị',
          priceCents: 20000000, // 200,000 VND
          isRequired: false,
        }
      ]
    },
    {
      name: 'Tư vấn âm thanh',
      slug: 'tu-van-am-thanh',
      description: 'Dịch vụ tư vấn chuyên sâu về thiết kế và lựa chọn hệ thống âm thanh phù hợp với nhu cầu và ngân sách.',
      category: ServiceCategory.CONSULTATION,
      type: ServiceType.CONSULTATION,
      basePriceCents: 50000000, // 500,000 VND
      estimatedDuration: 90, // 1.5 hours
      requirements: JSON.stringify([
        'Thông tin về không gian',
        'Ngân sách dự kiến',
        'Mục đích sử dụng'
      ]),
      features: JSON.stringify([
        'Tư vấn 1-1 với chuyên gia',
        'Thiết kế sơ bộ',
        'Báo giá chi tiết',
        'Hỗ trợ sau tư vấn'
      ]),
      imageUrl: 'https://example.com/consultation.jpg',
      items: [
        {
          name: 'Tư vấn cơ bản',
          description: 'Tư vấn cơ bản về hệ thống âm thanh',
          priceCents: 0, // Miễn phí
          isRequired: true,
        },
        {
          name: 'Thiết kế chi tiết',
          description: 'Thiết kế chi tiết với bản vẽ 3D',
          priceCents: 100000000, // 1,000,000 VND
          isRequired: false,
        }
      ]
    }
  ];

  for (const serviceData of services) {
    const { items, ...service } = serviceData;
    
    const createdService = await prisma.service.create({
      data: service,
    });

    // Create service items
    for (const itemData of items) {
      await prisma.serviceItem.create({
        data: {
          ...itemData,
          serviceId: createdService.id,
        },
      });
    }

    console.log(`✅ Created service: ${service.name}`);
  }
}

async function seedTechnicians() {
  console.log('🔧 Seeding technicians...');

  const technicians = [
    {
      name: 'Nguyễn Văn An',
      phone: '0901234567',
      email: 'an.nguyen@audiotailoc.com',
      specialties: [ServiceCategory.INSTALLATION, ServiceCategory.MAINTENANCE],
      schedule: [
        { dayOfWeek: 1, startTime: '08:00', endTime: '17:00', isAvailable: true }, // Monday
        { dayOfWeek: 2, startTime: '08:00', endTime: '17:00', isAvailable: true }, // Tuesday
        { dayOfWeek: 3, startTime: '08:00', endTime: '17:00', isAvailable: true }, // Wednesday
        { dayOfWeek: 4, startTime: '08:00', endTime: '17:00', isAvailable: true }, // Thursday
        { dayOfWeek: 5, startTime: '08:00', endTime: '17:00', isAvailable: true }, // Friday
        { dayOfWeek: 6, startTime: '08:00', endTime: '12:00', isAvailable: true }, // Saturday
        { dayOfWeek: 0, startTime: '00:00', endTime: '00:00', isAvailable: false }, // Sunday
      ]
    },
    {
      name: 'Trần Thị Bình',
      phone: '0902345678',
      email: 'binh.tran@audiotailoc.com',
      specialties: [ServiceCategory.RENTAL, ServiceCategory.CONSULTATION],
      schedule: [
        { dayOfWeek: 1, startTime: '09:00', endTime: '18:00', isAvailable: true },
        { dayOfWeek: 2, startTime: '09:00', endTime: '18:00', isAvailable: true },
        { dayOfWeek: 3, startTime: '09:00', endTime: '18:00', isAvailable: true },
        { dayOfWeek: 4, startTime: '09:00', endTime: '18:00', isAvailable: true },
        { dayOfWeek: 5, startTime: '09:00', endTime: '18:00', isAvailable: true },
        { dayOfWeek: 6, startTime: '00:00', endTime: '00:00', isAvailable: false },
        { dayOfWeek: 0, startTime: '00:00', endTime: '00:00', isAvailable: false },
      ]
    },
    {
      name: 'Lê Minh Cường',
      phone: '0903456789',
      email: 'cuong.le@audiotailoc.com',
      specialties: [ServiceCategory.MAINTENANCE, ServiceCategory.INSTALLATION],
      schedule: [
        { dayOfWeek: 1, startTime: '10:00', endTime: '19:00', isAvailable: true },
        { dayOfWeek: 2, startTime: '10:00', endTime: '19:00', isAvailable: true },
        { dayOfWeek: 3, startTime: '10:00', endTime: '19:00', isAvailable: true },
        { dayOfWeek: 4, startTime: '10:00', endTime: '19:00', isAvailable: true },
        { dayOfWeek: 5, startTime: '10:00', endTime: '19:00', isAvailable: true },
        { dayOfWeek: 6, startTime: '09:00', endTime: '13:00', isAvailable: true },
        { dayOfWeek: 0, startTime: '00:00', endTime: '00:00', isAvailable: false },
      ]
    }
  ];

  for (const tech of technicians) {
    await prisma.technician.create({
      data: {
        name: tech.name,
        phone: tech.phone,
        email: tech.email,
        specialties: tech.specialties,
        schedule: tech.schedule,
      },
    });
  }

  console.log('✅ Seeded technicians');
}

async function main() {
  await seedServices();
  await seedTechnicians();
}

main()
  .catch((e) => {
    console.error('❌ Error during services seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

