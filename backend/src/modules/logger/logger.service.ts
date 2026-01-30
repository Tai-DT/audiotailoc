import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  async findAll() {
    return {
      message: 'logger service is working',
      status: 'active',
    };
  }

  async getStatus() {
    return {
      module: 'logger',
      status: 'operational',
      uptime: process.uptime(),
    };
  }
}
