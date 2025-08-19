import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';

@Controller()
export class HealthController {
  @Get('/healthz')
  health() {
    return { status: 'ok' };
  }

  @UseGuards(JwtGuard)
  @Get('/healthz/secure')
  secure() {
    return { status: 'ok', secure: true };
  }
}


