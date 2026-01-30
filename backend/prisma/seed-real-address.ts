import { prisma } from './seed-client';
import { randomUUID } from 'crypto';

async function main() {
    console.log('📍 Seeding real address to site settings...');

    const contactInfo = {
        phone: {
            hotline: '0768426262',
            display: '0768 426 262'
        },
        email: 'audiotailoc@gmail.com',
        address: {
            full: '79/71/3 Đường số 4, Khu phố 7, P. Bình Hưng Hòa, Q. Bình Tân, TP.HCM',
            street: '79/71/3 Đường số 4',
            ward: 'Bình Hưng Hòa',
            district: 'Bình Tân',
            city: 'TP. Hồ Chí Minh',
            country: 'Việt Nam'
        },
        social: {
            facebook: 'https://facebook.com/audiotailoc',
            instagram: 'https://instagram.com/audiotailoc',
            youtube: 'https://youtube.com/audiotailoc',
            zalo: 'https://zalo.me/0768426262'
        },
        businessHours: {
            display: '08:00 - 21:00 (T2 - CN)'
        },
        zalo: {
            phoneNumber: '0768426262',
            displayName: 'Audio Tài Lộc'
        }
    };

    const key = 'contact_info';
    const value = JSON.stringify(contactInfo);

    await prisma.site_settings.upsert({
        where: { key },
        update: {
            value,
            updatedAt: new Date()
        },
        create: {
            id: randomUUID(),
            key,
            value,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    });

    console.log('✅ Real address updated in site_settings table successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding real address:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
