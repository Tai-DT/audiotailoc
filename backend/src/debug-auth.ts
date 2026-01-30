/* eslint-disable no-console */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';

async function debug() {
  const connectionString = process.env.DATABASE_URL || '';
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  const prisma = new PrismaClient({
    adapter,
  });

  try {
    // Find the admin user
    const user = await prisma.users.findUnique({
      where: { email: 'admin@audiotailoc.com' },
    });

    if (!user) {
      console.log('❌ No user found with email admin@audiotailoc.com');
      return;
    }

    console.log('✅ User found:');
    console.log('  ID:', user.id);
    console.log('  Email:', user.email);
    console.log('  Name:', user.name);
    console.log('  Role:', user.role);
    console.log('  Password hash (first 20 chars):', user.password?.substring(0, 20) + '...');

    // Test password comparison
    const testPassword = process.env.ADMIN_PASSWORD || 'admin_password_123';
    console.log('\n🔐 Testing password:', testPassword);

    if (user.password) {
      const isMatch = await bcrypt.compare(testPassword, user.password);
      console.log('  Password match:', isMatch ? '✅ YES' : '❌ NO');

      // Also test with a fresh hash to verify bcrypt is working
      const freshHash = await bcrypt.hash(testPassword, 12);
      const freshMatch = await bcrypt.compare(testPassword, freshHash);
      console.log('  Fresh hash test:', freshMatch ? '✅ bcrypt working' : '❌ bcrypt issue');
    } else {
      console.log('  ❌ User has no password set!');
    }
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

debug().catch(error => {
  console.error('❌ Debug failed:', error);
  process.exit(1);
});
