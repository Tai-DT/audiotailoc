import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminGuard } from './admin.guard';
import { AdminOrKeyGuard } from './admin-or-key.guard';
import { JwtGuard } from './jwt.guard';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [AdminGuard, AdminOrKeyGuard, JwtGuard],
  exports: [AdminGuard, AdminOrKeyGuard, JwtGuard],
})
export class GuardsModule {}
