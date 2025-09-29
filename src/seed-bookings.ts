import { PrismaClient } from '@prisma/client';
import { ServiceBookingStatus } from './common/enums';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding bookings...');

  // Get existing data
  const services = await prisma.services.findMany({ take: 3 });
  const users = await prisma.users.findMany({ take: 2 });
  const technicians = await prisma.technicians.findMany({ take: 2 });

  if (services.length === 0 || users.length === 0) {
    console.log('❌ No services or users found. Please run seed-services.ts and seed-users.ts first.');
    return;
  }

  // Create sample bookings
  const bookings = [
    {
      serviceId: services[0].id,
      userId: users[0].id,
      technicianId: technicians[0]?.id,
      status: ServiceBookingStatus.CONFIRMED,
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      scheduledTime: '10:00',
      notes: 'Khách hàng cần hỗ trợ nhanh',
      estimatedCosts: 500000,
    },
    {
      serviceId: services[1]?.id || services[0].id,
      userId: users[1]?.id || users[0].id,
      technicianId: technicians[1]?.id || technicians[0]?.id,
      status: ServiceBookingStatus.PENDING,
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
      scheduledTime: '14:30',
      notes: 'Khách hàng mới, cần tư vấn kỹ',
      estimatedCosts: 750000,
    },
    {
      serviceId: services[2]?.id || services[0].id,
      userId: users[0].id,
      technicianId: technicians[0]?.id,
      status: ServiceBookingStatus.COMPLETED,
      scheduledAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      scheduledTime: '09:00',
      notes: 'Hoàn thành đúng hẹn',
      estimatedCosts: 300000,
      actualCosts: 320000,
      completedAt: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20 hours ago
    },
  ];

  for (const booking of bookings) {
    try {
      const createdBooking = await prisma.service_bookings.create({
        data: booking,
      });

      // Create status history
      await prisma.service_status_history.create({
        data: {
          bookingId: createdBooking.id,
          status: booking.status,
          newStatus: booking.status,
          note: `Booking được tạo với trạng thái ${booking.status}`,
        },
      });

      console.log(`✅ Created booking ${createdBooking.id}`);
    } catch (error) {
      console.error(`❌ Failed to create booking:`, error);
    }
  }

  console.log('🎉 Bookings seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding bookings:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });