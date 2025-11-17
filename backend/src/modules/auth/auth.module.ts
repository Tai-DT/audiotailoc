 import { Module } from '@nestjs/common';
 import { UsersModule } from '../users/users.module';
 import { SecurityModule } from '../security/security.module';
 import { AuthService } from './auth.service';
 import { AuthController } from './auth.controller';
 import { AdminGuard } from './admin.guard';
 import { AdminOrKeyGuard } from './admin-or-key.guard';
 import { JwtModule } from '@nestjs/jwt';
 
 @Module({
   imports: [UsersModule, SecurityModule, JwtModule],
   providers: [AuthService, AdminGuard, AdminOrKeyGuard],
   controllers: [AuthController],
   exports: [AuthService],
 })
 export class AuthModule {}