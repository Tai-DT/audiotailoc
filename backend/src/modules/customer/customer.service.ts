import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomerService {
  
  async findAll() {
    return {
      message: 'customer service is working',
      status: 'active'
    };
  }

  async getStatus() {
    return {
      module: 'customer',
      status: 'operational',
      uptime: process.uptime()
    };
  }
}
