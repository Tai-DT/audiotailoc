import { Injectable } from '@nestjs/common';

@Injectable()
export class PromotionsService {
  
  async findAll() {
    return {
      message: 'promotions service is working',
      status: 'active'
    };
  }

  async getStatus() {
    return {
      module: 'promotions',
      status: 'operational',
      uptime: process.uptime()
    };
  }
}
