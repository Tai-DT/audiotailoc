import { Injectable } from '@nestjs/common';

@Injectable()
export class CachingService {
  async findAll() {
    return {
      message: 'caching service is working',
      status: 'active',
    };
  }

  async getStatus() {
    return {
      module: 'caching',
      status: 'operational',
      uptime: process.uptime(),
    };
  }
}
