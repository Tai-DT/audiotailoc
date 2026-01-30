import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminGuard } from '../auth/admin.guard';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { JwtGuard } from '../auth/jwt.guard';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [AdminGuard, AdminOrKeyGuard, JwtGuard],
  exports: [AdminGuard, AdminOrKeyGuard, JwtGuard],
})
export class SharedModule {}
