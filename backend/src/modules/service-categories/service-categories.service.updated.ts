import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ServiceCategoriesService {
  constructor(private prisma: PrismaService) {}

  // Service categories have been removed as requested
  // All methods below are disabled

  async create() {
    throw new Error('Service categories have been removed from the system');
  }

  async findAll() {
    // Return empty array since categories are no longer used
    return [];
  }

  async findOne() {
    throw new NotFoundException('Service categories have been removed from the system');
  }

  async update() {
    throw new Error('Service categories have been removed from the system');
  }

  async remove() {
    throw new Error('Service categories have been removed from the system');
  }
}