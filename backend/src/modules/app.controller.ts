import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  root() {
    return { name: 'audiotailoc-backend', version: '0.1.0' };
  }
}
