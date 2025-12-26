/* eslint-disable no-console */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { ensureAdminUser } from './scripts/admin-user';

async function main() {
  const prisma = new PrismaClient();

  try {
    const nodeEnv = process.env.NODE_ENV || 'development';

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@audiotailoc.com';
    // SECURITY: Require ADMIN_PASSWORD to be set explicitly - no default weak password
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      throw new Error(
        'ADMIN_PASSWORD environment variable is required. ' +
        'Please set a strong password for the admin account.'
      );
    }

    const bcryptRounds = Number(process.env.BCRYPT_ROUNDS || 12);
    const allowInsecureDefaultOnRemote =
      (process.env.ALLOW_INSECURE_DEFAULT_ADMIN || '').toLowerCase() === 'true';

    await ensureAdminUser({
      prisma,
      email: adminEmail,
      password: adminPassword,
      name: process.env.ADMIN_NAME || 'Administrator',
      bcryptRounds: Number.isFinite(bcryptRounds) ? bcryptRounds : 12,
      allowInsecureDefaultOnRemote,
    });

    console.log('✅ Seed complete');
    console.log(`📧 Admin email: ${adminEmail}`);
    if (nodeEnv !== 'production') {
      console.log(`🔑 Admin password: ${adminPassword}`);
    } else {
      console.log('🔑 Admin password: (hidden in production)');
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(error => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
