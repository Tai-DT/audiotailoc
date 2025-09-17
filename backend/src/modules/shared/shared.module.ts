import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
// AdminGuard import removed - using AdminOrKeyGuard instead
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { JwtGuard } from '../auth/jwt.guard';

@Global()
@Module({
  imports: [ConfigModule, UsersModule],
  providers: [ AdminOrKeyGuard, JwtGuard],
  exports: [ AdminOrKeyGuard, JwtGuard, UsersModule],
})
export class SharedModule {}
