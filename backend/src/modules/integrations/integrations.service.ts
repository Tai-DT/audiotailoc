import { Injectable } from '@nestjs/common';

@Injectable()
export class IntegrationsService {
  
  async findAll() {
    return {
      message: 'integrations service is working',
      status: 'active'
    };
  }

  async getStatus() {
    return {
      module: 'integrations',
      status: 'operational',
      uptime: process.uptime()
    };
  }
}
