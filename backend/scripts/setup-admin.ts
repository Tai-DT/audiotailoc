import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

async function main() {
    const dbUrl = "postgresql://neondb_owner:npg_UPadT7VL6HKB@ep-sweet-bread-af83m6r3-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require";

    const pool = new Pool({ connectionString: dbUrl });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    const email = 'audiotailoc@gmail.com';
    const password = 'DoLoc15081998';
    const name = 'Admin Audio Tai Loc';

    try {
        console.log('🚀 Starting Admin Setup...');

        // 1. Create or Update the new admin
        const hashedPassword = await bcrypt.hash(password, 12);

        console.log(`Checking if user ${email} exists...`);
        let newAdmin = await prisma.users.findUnique({
            where: { email },
        });

        if (newAdmin) {
            console.log('User already exists. Updating password and role...');
            newAdmin = await prisma.users.update({
                where: { email },
                data: {
                    password: hashedPassword,
                    role: 'ADMIN',
                    name: name,
                    updatedAt: new Date(),
                },
            });
        } else {
            console.log('Creating new admin user...');
            newAdmin = await prisma.users.create({
                data: {
                    id: randomUUID(),
                    email,
                    password: hashedPassword,
                    name,
                    role: 'ADMIN',
                    updatedAt: new Date(),
                },
            });
        }
        console.log(`✅ Admin ${email} is ready.`);

        const newAdminId = newAdmin.id;

        // 2. Find other admins
        console.log('Searching for other admin users...');
        const otherAdmins = await prisma.users.findMany({
            where: {
                role: 'ADMIN',
                NOT: {
                    id: newAdminId,
                },
            },
        });

        if (otherAdmins.length > 0) {
            console.log(`Found ${otherAdmins.length} other admin(s). Preparing reassignment and deletion...`);
            for (const admin of otherAdmins) {
                console.log(`Processing admin: ${admin.email} (${admin.id})`);

                // Reassign projects
                await prisma.projects.updateMany({
                    where: { userId: admin.id },
                    data: { userId: newAdminId }
                });

                // Reassign blog articles
                await prisma.blog_articles.updateMany({
                    where: { authorId: admin.id },
                    data: { authorId: newAdminId }
                });

                // Reassign activity logs
                await prisma.activity_logs.updateMany({
                    where: { userId: admin.id },
                    data: { userId: newAdminId }
                });

                // Reassign promotions created
                await prisma.promotions.updateMany({
                    where: { createdBy: admin.id },
                    data: { createdBy: newAdminId }
                });

                console.log(`Deleting admin: ${admin.email}`);
                try {
                    await prisma.users.delete({
                        where: { id: admin.id },
                    });
                    console.log(`✅ Deleted admin: ${admin.email}`);
                } catch (e) {
                    console.error(`❌ Could not delete admin ${admin.email}, downgrading to USER instead:`, e.message);
                    await prisma.users.update({
                        where: { id: admin.id },
                        data: {
                            role: 'USER',
                            name: `Former Admin (${admin.email})`,
                            isActive: false
                        }
                    });
                }
            }
            console.log('✅ Admin cleanup completed.');
        } else {
            console.log('No other admin users found.');
        }

        console.log('🎉 Admin setup completed successfully!');
    } catch (error) {
        console.error('❌ Error during admin setup:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();
