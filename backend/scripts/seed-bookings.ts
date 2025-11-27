import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

async function seedBookings() {
    const prisma = new PrismaClient();

    try {
        // 1. Get or Create Data
        const user = await prisma.users.findFirst();
        const service = await prisma.services.findFirst();

        // Create a technician if none exists
        let technician = await prisma.technicians.findFirst();
        if (!technician) {
            console.log('Creating sample technician...');
            technician = await prisma.technicians.create({
                data: {
                    id: randomUUID(),
                    name: 'Nguyễn Văn Kỹ Thuật',
                    email: 'tech.nguyen@example.com',
                    phone: '0909998887',
                    specialties: JSON.stringify(['Audio', 'Karaoke']),
                    isActive: true,
                }
            });
        }

        if (!user || !service) {
            console.error('Need at least one user and one service to seed bookings');
            return;
        }

        console.log(`Using User: ${user.id}`);
        console.log(`Using Service: ${service.id}`);
        console.log(`Using Technician: ${technician.id}`);

        // 2. Create Bookings
        const bookings = [
            {
                status: 'PENDING',
                scheduledAt: new Date(Date.now() + 86400000 * 2), // 2 days later
                scheduledTime: '09:00-11:00',
                notes: 'Khách hàng muốn tư vấn kỹ về loa',
                estimatedCosts: 500000,
            },
            {
                status: 'CONFIRMED',
                technicianId: technician.id,
                scheduledAt: new Date(Date.now() + 86400000 * 3), // 3 days later
                scheduledTime: '14:00-16:00',
                notes: 'Đã chốt lịch, mang theo dây cáp dài',
                estimatedCosts: 1500000,
            },
            {
                status: 'COMPLETED',
                technicianId: technician.id,
                scheduledAt: new Date(Date.now() - 86400000), // Yesterday
                scheduledTime: '10:00-12:00',
                notes: 'Hoàn thành lắp đặt, khách hài lòng',
                estimatedCosts: 2000000,
                actualCosts: 2000000,
            },
            {
                status: 'CANCELLED',
                scheduledAt: new Date(Date.now() + 86400000 * 5),
                scheduledTime: '08:00-10:00',
                notes: 'Khách bận đột xuất',
                estimatedCosts: 0,
            }
        ];

        for (const b of bookings) {
            const booking = await prisma.service_bookings.create({
                data: {
                    id: randomUUID(),
                    userId: user.id,
                    serviceId: service.id,
                    technicianId: b.technicianId || null,
                    status: b.status as any,
                    scheduledAt: b.scheduledAt,
                    scheduledTime: b.scheduledTime,
                    notes: b.notes,
                    estimatedCosts: b.estimatedCosts,
                    actualCosts: b.actualCosts,
                    updatedAt: new Date(),
                }
            });
            console.log(`Created booking: ${booking.id} [${booking.status}]`);
        }

        console.log('Seeding completed successfully!');
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedBookings();
