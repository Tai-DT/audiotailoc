import axios from 'axios';
import { PrismaClient } from '@prisma/client';

async function createDemoBooking() {
    const API_URL = 'http://localhost:3010/api/v1';
    const prisma = new PrismaClient();

    try {
        // 1. Get a valid user via Prisma (bypassing API auth)
        console.log('Fetching user from DB...');
        const user = await prisma.users.findFirst();
        if (!user) throw new Error('No users found in DB');
        console.log(`Using User: ${user.name} (${user.id})`);

        // 2. Get a valid service via Prisma
        console.log('Fetching service from DB...');
        const service = await prisma.services.findFirst();
        if (!service) throw new Error('No services found in DB');
        console.log(`Using Service: ${service.name} (${service.id})`);

        // 3. Create Booking Payload
        const bookingPayload = {
            userId: user.id,
            serviceId: service.id,
            technicianId: null,
            scheduledAt: new Date(Date.now() + 86400000 * 7).toISOString(), // 1 week later
            scheduledTime: '10:00-12:00',
            status: 'PENDING',
            notes: 'Demo booking created via API script to verify fix',
            estimatedCosts: 500000,
            customerName: user.name,
            customerPhone: user.phone || '0909000111',
            customerAddress: '123 Demo Street',
        };

        console.log('Sending Booking Request to API:', bookingPayload);

        // 4. Send POST request
        const createRes = await axios.post(`${API_URL}/bookings`, bookingPayload);

        console.log('✅ Booking Created Successfully!');
        console.log('Booking ID:', createRes.data.id);
        console.log('Status:', createRes.data.status);

    } catch (error: any) {
        console.error('❌ Failed to create booking:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    } finally {
        await prisma.$disconnect();
    }
}

createDemoBooking();
