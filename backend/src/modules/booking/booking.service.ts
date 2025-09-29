import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.serviceBooking.findMany({
      include: {
        service: true,
        technician: true,
        user: true,
        items: {
          include: {
            serviceItem: true,
          },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const booking = await this.prisma.serviceBooking.findUnique({
      where: { id },
      include: {
        service: true,
        technician: true,
        user: true,
        items: {
          include: {
            serviceItem: true,
          },
        },
        payments: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.serviceBooking.update({
      where: { id },
      data: { status },
      include: {
        service: true,
        technician: true,
        user: true,
      },
    });
  }

  async createPayment(bookingId: string, paymentData: any) {
    return this.prisma.servicePayment.create({
      data: {
        bookingId,
        ...paymentData,
      },
    });
  }

  async updatePaymentStatus(id: string, status: string) {
    return this.prisma.servicePayment.update({
      where: { id },
      data: { status },
    });
  }
}
