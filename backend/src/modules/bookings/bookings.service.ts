import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.service_bookingsWhereUniqueInput;
    where?: Prisma.service_bookingsWhereInput;
    orderBy?: Prisma.service_bookingsOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    const [items, total] = await Promise.all([
      this.prisma.service_bookings.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          services: {
            select: {
              id: true,
              name: true,
              service_types: {
                select: {
                  name: true,
                },
              },
            },
          },
          technicians: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.service_bookings.count({ where }),
    ]);

    return {
      bookings: items,
      total,
      page: skip ? Math.floor(skip / (take || 20)) + 1 : 1,
      pageSize: take || 20,
    };
  }

  async findOne(id: string) {
    const booking = await this.prisma.service_bookings.findUnique({
      where: { id },
      include: {
        users: true,
        services: {
          include: {
            service_types: true,
          },
        },
        technicians: true,
        service_booking_items: true,
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async create(data: Prisma.service_bookingsCreateInput) {
    return this.prisma.service_bookings.create({
      data,
      include: {
        users: true,
        services: true,
        technicians: true,
      },
    });
  }

  async update(id: string, data: Prisma.service_bookingsUpdateInput) {
    try {
      return await this.prisma.service_bookings.update({
        where: { id },
        data,
        include: {
          users: true,
          services: true,
          technicians: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
  }

  async updateStatus(id: string, status: string, notes?: string) {
    try {
      return await this.prisma.service_bookings.update({
        where: { id },
        data: {
          status,
          notes: notes ? notes : undefined,
          service_status_history: {
            create: {
              id: crypto.randomUUID(),
              status: 'UNKNOWN', // Ideally we fetch previous status, but for simplicity
              newStatus: status,
              note: notes,
            },
          },
        },
      });
    } catch (error) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
  }

  async assignTechnician(id: string, technicianId: string) {
    try {
      return await this.prisma.service_bookings.update({
        where: { id },
        data: {
          technicianId,
        },
        include: {
          technicians: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.service_bookings.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
  }

  async getStats() {
    const [total, pending, confirmed, inProgress, completed, cancelled] = await Promise.all([
      this.prisma.service_bookings.count(),
      this.prisma.service_bookings.count({ where: { status: 'PENDING' } }),
      this.prisma.service_bookings.count({ where: { status: 'CONFIRMED' } }),
      this.prisma.service_bookings.count({ where: { status: 'IN_PROGRESS' } }),
      this.prisma.service_bookings.count({ where: { status: 'COMPLETED' } }),
      this.prisma.service_bookings.count({ where: { status: 'CANCELLED' } }),
    ]);

    return {
      total,
      pending,
      confirmed,
      inProgress,
      completed,
      cancelled,
    };
  }
}
