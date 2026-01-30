
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

// Initialize Prisma
import { prisma } from './seed-client';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const IMAGES_DIR = path.join(__dirname, '../../data');

const CATEGORY_MAPPING: Record<string, string> = {
    'dan-karaoke': 'dan-karaoke.jpg',
    'loa-karaoke': 'loa-karaoke.jpg',
    'loa-sub': 'loa-sub.jpg',
    'vang-so-mixer': 'vang-so.jpg',
    'microphone': 'microphone.jpg',
    'amply-cuc-day': 'amply.jpg',
    'dau-karaoke': 'dau-karaoke.jpg',
    'man-hinh-chon-bai': 'man-hinh.jpg',
};

async function uploadImage(filePath: string, publicId: string) {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            public_id: `audiotailoc/categories/${publicId}`,
            overwrite: true,
            folder: 'audiotailoc/categories',
        });
        return result.secure_url;
    } catch (error) {
        console.error(`Error uploading ${filePath}:`, error);
        return null;
    }
}

async function main() {
    console.log('🚀 Starting category image upload to Cloudinary...');

    // Get all categories from DB
    const categories = await prisma.categories.findMany();

    for (const category of categories) {
        const fileName = CATEGORY_MAPPING[category.slug];

        if (!fileName) {
            console.log(`⚠️ No image mapping found for category: ${category.slug}`);
            continue;
        }

        const filePath = path.join(IMAGES_DIR, fileName);

        if (!fs.existsSync(filePath)) {
            console.log(`❌ File not found: ${filePath}`);
            continue;
        }

        console.log(`📤 Uploading image for ${category.name} (${fileName})...`);
        const imageUrl = await uploadImage(filePath, category.slug);

        if (imageUrl) {
            // Update DB
            await prisma.categories.update({
                where: { id: category.id },
                data: {
                    imageUrl: imageUrl,
                    updatedAt: new Date()
                },
            });
            console.log(`✅ Updated ${category.name} with URL: ${imageUrl}`);
        }
    }

    console.log('✨ All done!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
