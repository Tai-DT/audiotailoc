/**
 * Seed script for technicians data
 * Run with: npx ts-node prisma/seed-technicians.ts
 */

import { prisma } from './seed-client';
import { randomUUID } from 'crypto';

interface TechnicianData {
    name: string;
    email: string;
    phone: string;
    specialties: string;
}

const technicians: TechnicianData[] = [
    {
        name: 'Nguyễn Văn Hùng',
        email: 'hung.nguyen@audiotailoc.com',
        phone: '0901234567',
        specialties: 'Home Theater, Dolby Atmos, THX Certified',
    },
    {
        name: 'Trần Minh Tuấn',
        email: 'tuan.tran@audiotailoc.com',
        phone: '0902345678',
        specialties: 'Karaoke System, JBL Pro Audio, Yamaha',
    },
    {
        name: 'Lê Hoàng Nam',
        email: 'nam.le@audiotailoc.com',
        phone: '0903456789',
        specialties: 'Conference System, Shure, Bosch, Crestron',
    },
    {
        name: 'Phạm Thanh Dũng',
        email: 'dung.pham@audiotailoc.com',
        phone: '0904567890',
        specialties: 'Commercial Audio, Bose Pro, QSC',
    },
    {
        name: 'Hoàng Gia Bảo',
        email: 'bao.hoang@audiotailoc.com',
        phone: '0905678901',
        specialties: 'Studio Recording, Avid Pro Tools, Genelec',
    },
    {
        name: 'Vũ Đình Long',
        email: 'long.vu@audiotailoc.com',
        phone: '0906789012',
        specialties: 'Outdoor Audio, Sonance, TOA PA System',
    },
    {
        name: 'Đặng Quốc Việt',
        email: 'viet.dang@audiotailoc.com',
        phone: '0907890123',
        specialties: 'Sound Reinforcement, L-Acoustics, d&b audiotechnik',
    },
    {
        name: 'Bùi Thị Mai',
        email: 'mai.bui@audiotailoc.com',
        phone: '0908901234',
        specialties: 'Restaurant Audio, Martin Audio, Yamaha Commercial',
    },
];

async function main() {
    console.log('🔧 Seeding technicians data...');

    let created = 0;
    let skipped = 0;

    for (const tech of technicians) {
        // Check if technician already exists by email
        const existing = await prisma.technicians.findFirst({
            where: { email: tech.email },
        });

        if (existing) {
            console.log(`✓ Technician "${tech.name}" already exists`);
            skipped++;
            continue;
        }

        // Create technician
        await prisma.technicians.create({
            data: {
                id: randomUUID(),
                name: tech.name,
                email: tech.email,
                phone: tech.phone,
                specialties: tech.specialties,
                isActive: true,
            },
        });

        console.log(`✅ Created technician: ${tech.name}`);
        created++;
    }

    console.log(`\n✅ Technician seeding completed!`);
    console.log(`   - Created: ${created} technicians`);
    console.log(`   - Skipped: ${skipped} technicians (already exist)`);
    console.log(`   - Total: ${technicians.length} technicians`);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding technicians:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
