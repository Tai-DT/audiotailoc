import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminGuard } from './admin.guard';
import { JwtGuard } from './jwt.guard';

@Module({
  imports: [UsersModule],
  providers: [AuthService, AdminGuard, JwtGuard],
  controllers: [AuthController],
  exports: [AdminGuard, JwtGuard, UsersModule],
})
export class AuthModule {}

