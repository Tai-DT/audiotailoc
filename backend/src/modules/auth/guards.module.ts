import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminGuard } from './admin.guard';
import { AdminOrKeyGuard } from './admin-or-key.guard';
import { JwtGuard } from './jwt.guard';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ConfigModule, forwardRef(() => UsersModule)],
  providers: [AdminGuard, AdminOrKeyGuard, JwtGuard],
  exports: [AdminGuard, AdminOrKeyGuard, JwtGuard],
})
export class GuardsModule {}
