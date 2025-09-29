import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.products.findMany({
      include: { categories: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.products.findUnique({
      where: { id },
      include: { categories: true },
    });
  }
}