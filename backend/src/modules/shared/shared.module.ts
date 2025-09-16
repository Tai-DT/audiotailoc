import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { AdminGuard } from '../auth/admin.guard';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { JwtGuard } from '../auth/jwt.guard';

@Global()
@Module({
  imports: [ConfigModule, UsersModule],
  providers: [AdminGuard, AdminOrKeyGuard, JwtGuard],
  exports: [AdminGuard, AdminOrKeyGuard, JwtGuard, UsersModule],
})
export class SharedModule {}
