import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtGuard } from './jwt.guard';
import { UsersService } from '../users/users.service';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

class RegisterDto {
  @IsEmail() email!: string;
  @MinLength(6) @IsString() password!: string;
  @IsOptional() @IsString() name?: string;
}
class LoginDto {
  @IsEmail() email!: string;
  @IsString() password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService, private readonly users: UsersService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    if (!dto.email || !dto.password) throw new HttpException('Invalid payload', HttpStatus.BAD_REQUEST);
    const user = await this.auth.register(dto);
    return { user: { id: user.id, email: user.email, name: user.name } };
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const tokens = await this.auth.login(dto).catch(() => {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    });
    return tokens;
  }

  @UseGuards(JwtGuard)
  @Get('me')
  async me(@Req() req: any) {
    const userId = req.user?.sub as string | undefined;
    if (!userId) return { userId: null };
    const u = await this.users.findById(userId);
    return { userId, email: u?.email ?? null, role: (u as any)?.role ?? null };
  }
}

