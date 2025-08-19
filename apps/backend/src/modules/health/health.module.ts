import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { JwtGuard } from '../auth/jwt.guard';

@Module({
  controllers: [HealthController],
  providers: [JwtGuard],
})
export class HealthModule {}


