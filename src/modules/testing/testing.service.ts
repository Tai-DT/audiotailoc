import { Injectable } from '@nestjs/common';

@Injectable()
export class TestingService {
  
  async findAll() {
    return {
      message: 'testing service is working',
      status: 'active'
    };
  }

  async getStatus() {
    return {
      module: 'testing',
      status: 'operational',
      uptime: process.uptime()
    };
  }
}
