import { Injectable } from '@nestjs/common';

@Injectable()
export class SystemService {
  
  async findAll() {
    return {
      message: 'system service is working',
      status: 'active'
    };
  }

  async getStatus() {
    return {
      module: 'system',
      status: 'operational',
      uptime: process.uptime()
    };
  }
}
