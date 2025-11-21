import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

function parseArgs() {
  const args = process.argv.slice(2);
  const result: Record<string, string | boolean> = {};
  args.forEach((a) => {
    if (!a.startsWith('--')) return;
    const [key, value] = a.replace(/^--/, '').split('=');
    result[key] = value === undefined ? true : value;
  });
  return result;
}

async function createAdmin() {
  const args = parseArgs();

  const adminEmail = (args.email as string) || process.env.ADMIN_EMAIL || 'admin@audiotailoc.com';
  const adminPassword = (args.password as string) || process.env.ADMIN_PASSWORD || 'admin123';
  const adminName = (args.name as string) || process.env.ADMIN_NAME || 'Admin User';
  const overwrite = args.overwrite === true || args.update === true || args.force === true;
  const dryRun = args['dry-run'] === true || args.dryrun === true || args.dry === true;

  if (!process.env.DATABASE_URL) {
    console.warn('\n⚠️  DATABASE_URL not set. Ensure environment variables are loaded (e.g., run with `npm run dev` or set env before running).\n');
  }

  try {
    if ((process.env.NODE_ENV || '').toLowerCase() === 'production' && args['force-production'] !== true) {
      console.error('\n⛔ Refusing to create or update admin in production without --force-production flag.');
      console.error('If you intend to run this in production, retry with --force-production and ensure you understand the implications.');
      process.exit(2);
    }
    console.log(`\n🔧 Creating/updating admin user (${adminEmail})...`);

    if (dryRun) {
      console.log('⚠️  Dry run enabled, no changes will be saved.');
      console.log(`Would ${existingAdmin ? 'update' : 'create'} admin for: ${adminEmail}`);
      console.log(`Name: ${adminName}`);
      console.log(`Password: ${adminPassword}`);
      return;
    }

    // Check if admin already exists
    const existingAdmin = await prisma.users.findUnique({
      where: { email: adminEmail }
    });

    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    if (existingAdmin) {
      if (!overwrite) {
        console.log(`✅ Admin user with email ${adminEmail} already exists. Use --overwrite to force an update.`);
        return;
      }

      // Update existing admin
      await prisma.users.update({
        where: { email: adminEmail },
        data: {
          password: hashedPassword,
          name: adminName,
          role: 'ADMIN',
          updatedAt: new Date()
        }
      });

      console.log('✅ Admin user updated successfully!');
    } else {
      // Create admin user
      await prisma.users.create({
        data: {
          id: randomUUID(),
          email: adminEmail,
          password: hashedPassword,
          name: adminName,
          role: 'ADMIN',
          updatedAt: new Date()
        }
      });
      console.log('✅ Admin user created successfully!');
    }

    console.log(`\n📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
createAdmin();
