import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private readonly users: UsersService, private readonly config: ConfigService) {}

  async register(dto: { email: string; password: string; name?: string }) {
    return this.users.create({ email: dto.email, password: dto.password, name: dto.name ?? '' });
  }

  async login(dto: { email: string; password: string }) {
    const user = await this.users.findByEmail(dto.email);
    if (!user) throw new Error('not found');
    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new Error('bad pass');

    const accessSecret = this.config.get<string>('JWT_ACCESS_SECRET') || 'dev_access';
    const refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET') || 'dev_refresh';
    const accessToken = jwt.sign({ sub: user.id, email: user.email, role: (user as any).role ?? 'USER' }, accessSecret, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ sub: user.id }, refreshSecret, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    try {
      const refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET') || 'dev_refresh';
      const payload = jwt.verify(refreshToken, refreshSecret) as { sub: string };
      
      const user = await this.users.findById(payload.sub);
      if (!user) throw new Error('User not found');

      const accessSecret = this.config.get<string>('JWT_ACCESS_SECRET') || 'dev_access';
      const newAccessToken = jwt.sign(
        { sub: user.id, email: user.email, role: (user as any).role ?? 'USER' },
        accessSecret,
        { expiresIn: '15m' }
      );
      
      return { accessToken: newAccessToken, refreshToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}

