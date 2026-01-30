import { prisma } from './seed-client';
import { randomUUID } from 'crypto';

async function seedBookings() {
    console.log('🌱 Seeding booking data...');

    // 1. Fetch necessary existing data
    const users = await prisma.users.findMany({ where: { role: 'USER' } });
    const technicians = await prisma.technicians.findMany({ where: { isActive: true } });
    const services = await prisma.services.findMany({ where: { isActive: true } });

    if (users.length === 0) {
        console.error('❌ No users found. Please run seed-customers.ts first.');
        return;
    }
    if (services.length === 0) {
        console.error('❌ No services found. Please ensure services are seeded.');
        return;
    }

    console.log(`Found ${users.length} users, ${technicians.length} technicians, ${services.length} services.`);

    const bookingsToCreate = 50;
    const statuses = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

    let createdCount = 0;

    for (let i = 0; i < bookingsToCreate; i++) {
        // Random selection
        const user = users[Math.floor(Math.random() * users.length)];
        const service = services[Math.floor(Math.random() * services.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        // Determine technician based on status
        let technicianId = null;
        if (['CONFIRMED', 'IN_PROGRESS', 'COMPLETED'].includes(status) && technicians.length > 0) {
            // 80% chance to have a technician if confirmed/in_progress/completed
            if (Math.random() > 0.2) {
                technicianId = technicians[Math.floor(Math.random() * technicians.length)].id;
            }
        }

        // Random dates
        const isPast = Math.random() > 0.3; // 70% past bookings, 30% future
        const dateOffset = Math.floor(Math.random() * 30); // within 30 days
        const date = new Date();
        if (isPast) {
            date.setDate(date.getDate() - dateOffset);
        } else {
            date.setDate(date.getDate() + dateOffset);
        }

        // Scheduled time (random hour 8-17)
        const hour = Math.floor(Math.random() * (17 - 8 + 1)) + 8;
        const minute = Math.random() > 0.5 ? '00' : '30';
        const scheduledTime = `${hour.toString().padStart(2, '0')}:${minute}`;

        // Costs
        const estimatedCosts = Number(service.price || 0);
        // Wait, let's check service model in schema.
        // Model services: id, name, ..., price (Int?), ...
        // Actually, let's check the schema again for `services` model.
        // I'll assume `price` or similar field. 
        // Looking at `booking.service.ts` create method: `estimatedCosts: bookingData.estimatedCosts || 0`.
        // Looking at `service_items`: `price Int`.
        // Let's assume service has a base price or we calculate from items.
        // For simplicity, random cost between 100k and 2m.
        const cost = Math.floor(Math.random() * (2000000 - 100000 + 1)) + 100000;

        const bookingId = randomUUID();

        // Create Booking
        const booking = await prisma.service_bookings.create({
            data: {
                id: bookingId,
                userId: user.id,
                serviceId: service.id,
                technicianId: technicianId,
                status: status,
                scheduledAt: date,
                scheduledTime: scheduledTime,
                notes: Math.random() > 0.7 ? 'Khách hàng yêu cầu đến đúng giờ.' : null,
                estimatedCosts: cost,
                actualCosts: status === 'COMPLETED' ? cost : null,
                createdAt: new Date(date.getTime() - 86400000), // Created 1 day before scheduled
                updatedAt: new Date(),
            }
        });

        // Create Booking Items (1-3 items)
        // We need service_items. Let's fetch service items for this service if possible, or just create generic ones?
        // The schema has `service_items` linked to `services`.
        const serviceItems = await prisma.service_items.findMany({
            where: { serviceId: service.id }
        });

        if (serviceItems.length > 0) {
            const numItems = Math.floor(Math.random() * 3) + 1;
            for (let j = 0; j < numItems; j++) {
                const item = serviceItems[Math.floor(Math.random() * serviceItems.length)];
                await prisma.service_booking_items.create({
                    data: {
                        id: randomUUID(),
                        bookingId: bookingId,
                        serviceItemId: item.id,
                        quantity: 1,
                        price: item.price,
                    }
                });
            }
        }

        // Create Payment if completed
        if (status === 'COMPLETED') {
            await prisma.service_payments.create({
                data: {
                    id: randomUUID(),
                    bookingId: bookingId,
                    provider: 'CASH',
                    amountCents: cost,
                    status: 'COMPLETED',
                    paidAt: date, // Paid on scheduled date
                    createdAt: date,
                }
            });
        }

        createdCount++;
        process.stdout.write('.');
    }

    console.log(`\n✅ Successfully created ${createdCount} bookings.`);
}

seedBookings()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
