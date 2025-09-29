import { Module, Global, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminGuard } from './admin.guard';
import { AdminOrKeyGuard } from './admin-or-key.guard';
import { JwtGuard } from './jwt.guard';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersModule } from '../users/users.module';

@Global()
@Module({
  imports: [ConfigModule, forwardRef(() => UsersModule)],
  providers: [AdminGuard, AdminOrKeyGuard, JwtGuard, PrismaService],
  exports: [AdminGuard, AdminOrKeyGuard, JwtGuard],
})
export class GuardsModule {}
