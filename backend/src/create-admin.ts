/*
  Create Admin User Script

  Usage:
    - npm run create-admin

  Env vars:
    - ADMIN_EMAIL (default: admin@audiotailoc.com)
    - ADMIN_PASSWORD (default: admin123 in development only)
    - ADMIN_NAME (default: Administrator)
    - BCRYPT_ROUNDS (default: 12)
    - ALLOW_INSECURE_DEFAULT_ADMIN=true (allows using admin123 on non-local DBs; not recommended)
*/

/* eslint-disable no-console */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { ensureAdminUser } from './scripts/admin-user';

async function main() {
  const prisma = new PrismaClient();

  try {
    console.log('🔧 Ensuring admin user...');

    const nodeEnv = process.env.NODE_ENV || 'development';

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@audiotailoc.com';
    const adminPassword =
      // SECURITY: Require ADMIN_PASSWORD to be set explicitly - no default weak password
      process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      throw new Error(
        'ADMIN_PASSWORD environment variable is required. ' +
          'Please set a strong password for the admin account.',
      );
    }

    if (nodeEnv === 'production' && !process.env.ADMIN_PASSWORD) {
      throw new Error('In production, ADMIN_PASSWORD must be set explicitly.');
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

    console.log('🎉 Admin user ensured successfully!');
    console.log(`📧 Email: ${adminEmail}`);
    if (nodeEnv !== 'production') {
      console.log(`🔑 Password: ${adminPassword}`);
    } else {
      console.log('🔑 Password: (hidden in production)');
    }
    console.log('👤 Role: ADMIN');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(error => {
  console.error('❌ Error creating admin user:', error);
  process.exit(1);
});
