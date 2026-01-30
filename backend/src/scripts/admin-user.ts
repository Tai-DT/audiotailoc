import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

export type EnsureAdminUserOptions = {
  prisma: PrismaClient;
  email: string;
  password: string;
  name?: string;
  role?: 'ADMIN';
  bcryptRounds?: number;
  allowInsecureDefaultOnRemote?: boolean;
};

function isLocalDatabaseUrl(databaseUrl: string): boolean {
  if (!databaseUrl) return true;

  // SQLite-style or Prisma Accelerate URLs don't have a standard host we can safely parse.
  if (databaseUrl.startsWith('file:')) return true;

  try {
    const url = new URL(databaseUrl);
    const host = (url.hostname || '').toLowerCase();
    return host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0';
  } catch {
    // If we cannot parse, be conservative and treat as non-local.
    return false;
  }
}

export async function ensureAdminUser(options: EnsureAdminUserOptions): Promise<void> {
  const {
    prisma,
    email,
    password,
    name = 'Administrator',
    role = 'ADMIN',
    bcryptRounds = 12,
    allowInsecureDefaultOnRemote = false,
  } = options;

  const databaseUrl = process.env.DATABASE_URL || '';
  const isLocalDb = isLocalDatabaseUrl(databaseUrl);

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be provided');
  }

  // Guardrail: avoid accidentally setting a known weak default password on remote DBs.
  if (!isLocalDb && password === 'admin123' && !allowInsecureDefaultOnRemote) {
    throw new Error(
      'Refusing to set default password "admin123" on a non-local DATABASE_URL. ' +
        'Set ADMIN_PASSWORD to a strong value or set ALLOW_INSECURE_DEFAULT_ADMIN=true if you really intend this.',
    );
  }

  const hashedPassword = await bcrypt.hash(password, bcryptRounds);

  const existingAdmin = await prisma.users.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    await prisma.users.update({
      where: { email },
      data: {
        password: hashedPassword,
        name,
        role,
        updatedAt: new Date(),
      },
    });
    return;
  }

  await prisma.users.create({
    data: {
      id: randomUUID(),
      email,
      password: hashedPassword,
      name,
      role,
      updatedAt: new Date(),
    },
  });
}
