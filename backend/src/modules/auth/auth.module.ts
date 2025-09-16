import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { SecurityModule } from '../security/security.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [UsersModule, SecurityModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService, UsersModule],
})
export class AuthModule {}

