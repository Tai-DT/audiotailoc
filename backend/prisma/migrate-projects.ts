import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateProjects() {
    console.log('🔄 Starting safe project migration...\n');

    try {
        // Step 1: Check if 'featured' column still exists
        console.log('Step 1: Checking schema...');
        const projects = await prisma.$queryRaw<any[]>`
      SELECT * FROM projects LIMIT 1
    `;

        if (projects.length > 0 && 'featured' in projects[0]) {
            console.log('✅ Found "featured" column, proceeding with data migration\n');

            // Step 2: Copy data from 'featured' to 'isFeatured' where different
            console.log('Step 2: Migrating data from "featured" to "isFeatured"...');
            const result = await prisma.$executeRaw`
        UPDATE projects 
        SET "isFeatured" = featured
        WHERE "isFeatured" != featured OR "isFeatured" IS NULL
      `;
            console.log(`✅ Updated ${result} projects\n`);

            // Step 3: Verify migration
            console.log('Step 3: Verifying data consistency...');
            const inconsistent = await prisma.$queryRaw<any[]>`
        SELECT id, name, featured, "isFeatured"
        FROM projects
        WHERE featured != "isFeatured"
      `;

            if (inconsistent.length > 0) {
                console.log(`⚠️  Found ${inconsistent.length} inconsistent records:`);
                inconsistent.forEach(p => {
                    console.log(`  - ${p.name}: featured=${p.featured}, isFeatured=${p.isFeatured}`);
                });
            } else {
                console.log('✅ All projects have consistent featured status\n');
            }

            console.log('✅ Migration preparation complete!');
            console.log('\n📋 Next steps:');
            console.log('1. Run: npx prisma db push');
            console.log('2. This will safely drop the "featured" column');
            console.log('3. Data is preserved in "isFeatured" column\n');

        } else {
            console.log('✅ "featured" column already removed, no migration needed\n');
        }

    } catch (error) {
        console.error('❌ Migration error:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

migrateProjects()
    .catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
