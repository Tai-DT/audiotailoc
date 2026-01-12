import { execSync } from 'child_process';
import * as path from 'path';

const seeds = [
  'src/seed.ts', // Admin user
  'prisma/seed-categories.ts',
  'prisma/seed-products.ts',
  'prisma/seed-blog.ts',
  'prisma/seed-blog-extra.ts',
  'prisma/seed-customers.ts',
  'prisma/seed-faqs.ts',
  'prisma/seed-testimonials.ts',
  'prisma/seed-projects.ts',
  'prisma/seed-reviews.ts',
  'prisma/seed-technicians.ts',
  'prisma/seed-service-types.ts',
  'prisma/seed-services.ts',
  'prisma/seed-campaigns.ts',
  'prisma/seed-promotions.ts',
  'prisma/seed-bookings.ts',
  'prisma/seed-demo-user.ts'
];

async function runSeeds() {
  console.log('🚀 Starting master seed process...');
  const rootDir = path.resolve(__dirname, '..');

  for (const seed of seeds) {
    const seedPath = path.join(rootDir, seed);
    console.log(`\n---------------------------------------------------------`);
    console.log(`🌱 Running seed: ${seed}`);
    console.log(`---------------------------------------------------------`);
    
    try {
      execSync(`npx ts-node ${seedPath}`, { stdio: 'inherit', cwd: rootDir });
    } catch (error) {
      console.error(`❌ Failed to run seed: ${seed}`);
      // Continue with other seeds even if one fails
    }
  }

  console.log('\n✨ Master seeding completed successfully!');
}

runSeeds();
