import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { testimonials } from '@prisma/client';
import { randomUUID } from 'crypto';

@Injectable()
export class TestimonialsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<testimonials[]> {
    return this.prisma.testimonials.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        displayOrder: 'asc',
      },
    });
  }

  async create(data: any): Promise<testimonials> {
    return this.prisma.testimonials.create({
      data: {
        ...data,
        id: randomUUID(),
        updatedAt: new Date(),
        displayOrder: data.displayOrder || 0,
        isActive: data.isActive ?? true,
      },
    });
  }

  // Add other methods if needed (update, delete, etc.)
}
