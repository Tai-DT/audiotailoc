import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { RealtimeGateway } from './realtime.gateway';
import { RealtimeService } from './realtime.service';
import { PrismaModule } from '../../prisma/prisma.module';

/**
 * Real-time Module
 * Provides WebSocket-based real-time updates for orders, bookings, and live chat
 */
@Module({
  imports: [PrismaModule, JwtModule, ConfigModule],
  providers: [RealtimeGateway, RealtimeService],
  exports: [RealtimeService],
})
export class RealtimeModule {}
