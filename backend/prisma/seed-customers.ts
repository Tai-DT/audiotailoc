import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedCustomers() {
    console.log('🌱 Seeding customer data...');

    const hashedPassword = await bcrypt.hash('customer123', 10);

    const customers = [
        {
            id: randomUUID(),
            email: 'nguyenvana@gmail.com',
            password: hashedPassword,
            name: 'Nguyễn Văn A',
            phone: '0901234567',
            role: 'USER',
            createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 6 months ago
            updatedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        },
        {
            id: randomUUID(),
            email: 'tranthib@gmail.com',
            password: hashedPassword,
            name: 'Trần Thị B',
            phone: '0912345678',
            role: 'USER',
            createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000), // 5 months ago
            updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
        {
            id: randomUUID(),
            email: 'levanc@gmail.com',
            password: hashedPassword,
            name: 'Lê Văn C',
            phone: '0923456789',
            role: 'USER',
            createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 4 months ago
            updatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        },
        {
            id: randomUUID(),
            email: 'phamthid@gmail.com',
            password: hashedPassword,
            name: 'Phạm Thị D',
            phone: '0934567890',
            role: 'USER',
            createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 3 months ago
            updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        },
        {
            id: randomUUID(),
            email: 'hoangvane@gmail.com',
            password: hashedPassword,
            name: 'Hoàng Văn E',
            phone: '0945678901',
            role: 'USER',
            createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 2 months ago
            updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        },
        {
            id: randomUUID(),
            email: 'vuthif@gmail.com',
            password: hashedPassword,
            name: 'Vũ Thị F',
            phone: '0956789012',
            role: 'USER',
            createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
        {
            id: randomUUID(),
            email: 'dangvang@gmail.com',
            password: hashedPassword,
            name: 'Đặng Văn G',
            phone: '0967890123',
            role: 'USER',
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
            updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
            id: randomUUID(),
            email: 'buithih@gmail.com',
            password: hashedPassword,
            name: 'Bùi Thị H',
            phone: '0978901234',
            role: 'USER',
            createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
        {
            id: randomUUID(),
            email: 'dovani@gmail.com',
            password: hashedPassword,
            name: 'Đỗ Văn I',
            phone: '0989012345',
            role: 'USER',
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        },
        {
            id: randomUUID(),
            email: 'ngothik@gmail.com',
            password: hashedPassword,
            name: 'Ngô Thị K',
            phone: '0990123456',
            role: 'USER',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
            updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        },
        {
            id: randomUUID(),
            email: 'lyvanl@gmail.com',
            password: hashedPassword,
            name: 'Lý Văn L',
            phone: '0901123456',
            role: 'USER',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        },
        {
            id: randomUUID(),
            email: 'dinhthim@gmail.com',
            password: hashedPassword,
            name: 'Đinh Thị M',
            phone: '0912234567',
            role: 'USER',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
            updatedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        },
    ];

    let createdCount = 0;
    let skippedCount = 0;

    for (const customer of customers) {
        const existingUser = await prisma.users.findUnique({
            where: { email: customer.email },
        });

        if (existingUser) {
            console.log(`✓ Customer "${customer.name}" (${customer.email}) already exists`);
            skippedCount++;
        } else {
            await prisma.users.create({
                data: customer,
            });
            console.log(`✓ Created customer: ${customer.name} (${customer.email})`);
            createdCount++;
        }
    }

    console.log(`\n✅ Customer seeding completed!`);
    console.log(`   - Created: ${createdCount} customers`);
    console.log(`   - Skipped: ${skippedCount} customers (already exist)`);
    console.log(`   - Total: ${customers.length} customers`);
    console.log(`\n📝 Default password for all customers: customer123`);
}

seedCustomers()
    .catch((error) => {
        console.error('❌ Error seeding customers:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
