import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTestimonialDto, UpdateTestimonialDto } from './dto/testimonial-create.dto';

@Injectable()
export class TestimonialsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.testimonials.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.testimonials.findUnique({
      where: { id },
    });
  }

  async create(data: CreateTestimonialDto) {
    return this.prisma.testimonials.create({
      data: {
        ...data,
        id: crypto.randomUUID(),
        updatedAt: new Date(),
      },
    });
  }

  async update(id: string, data: UpdateTestimonialDto) {
    return this.prisma.testimonials.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.testimonials.delete({
      where: { id },
    });
  }
}
