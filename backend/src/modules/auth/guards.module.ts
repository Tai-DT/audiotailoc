import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminGuard } from './admin.guard';
import { AdminOrKeyGuard } from './admin-or-key.guard';
import { JwtGuard } from './jwt.guard';
import { JwtOrKeyGuard } from './jwt-or-key.guard';
import { OptionalJwtGuard } from './optional-jwt.guard';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [AdminGuard, AdminOrKeyGuard, JwtGuard, JwtOrKeyGuard, OptionalJwtGuard],
  exports: [AdminGuard, AdminOrKeyGuard, JwtGuard, JwtOrKeyGuard, OptionalJwtGuard],
})
export class GuardsModule {}
