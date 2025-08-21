import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      log: ['error'],
    });
    // Log the DB URL once at startup to diagnose connection issues
    // Avoid printing credentials in production
    if (process.env.NODE_ENV !== 'production') {
      const url = process.env.DATABASE_URL || '';
      const masked = url.replace(/:(.*?)@/, ':***@');
      console.log('[Prisma] DATABASE_URL =', masked);
    }
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

