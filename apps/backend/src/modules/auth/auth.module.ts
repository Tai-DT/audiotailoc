import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminGuard } from './admin.guard';

@Module({
  imports: [UsersModule],
  providers: [AuthService, AdminGuard],
  controllers: [AuthController],
  exports: [AdminGuard, UsersModule],
})
export class AuthModule {}

