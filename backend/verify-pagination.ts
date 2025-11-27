import { PrismaClient } from '@prisma/client';
import { BookingService } from './src/modules/booking/booking.service';

// Mock dependencies
const prisma = new PrismaClient() as any;
const telegramMock = {} as any;
const techniciansMock = {} as any;

async function run() {
    const service = new BookingService(prisma, telegramMock, techniciansMock);

    // We need to mock prisma methods or use the real client if we want to test DB interaction
    // But BookingService uses `this.prisma.service_bookings.findMany`
    // Let's use real prisma client but cast it to any to avoid type issues with the service constructor if it expects PrismaService

    try {
        const result = await service.findAll({ page: 1, limit: 1 });
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

run();
