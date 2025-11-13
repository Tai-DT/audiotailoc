import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.service_bookings.findMany({
      include: {
        services: true,
        technicians: true,
        users: true,
        service_booking_items: {
          include: {
            service_items: true,
          },
        },
        service_payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const booking = await this.prisma.service_bookings.findUnique({
      where: { id },
      include: {
        services: true,
        technicians: true,
        users: true,
        service_booking_items: {
          include: {
            service_items: true,
          },
        },
        service_payments: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async create(createBookingDto: any) {
    const { items, ...bookingData } = createBookingDto;

    // Validate required fields
    if (!bookingData.serviceId) {
      throw new NotFoundException('Service ID is required');
    }

    // Verify service exists
    const service = await this.prisma.services.findUnique({
      where: { id: bookingData.serviceId }
    });
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // ✅ Verify service is active and available
    if (!service.isActive) {
      throw new NotFoundException('Service is not available');
    }

    // ✅ Validate booking items exist if provided
    if (items?.length) {
      for (const item of items) {
        const serviceItem = await this.prisma.service_items.findUnique({
          where: { id: item.itemId }
        });
        if (!serviceItem) {
          throw new NotFoundException(`Service item not found: ${item.itemId}`);
        }
      }
    }

    // Find a valid user ID if not provided
    let userId = bookingData.userId;
    if (!userId) {
      // Find the first available user (prefer non-admin users)
      const availableUser = await this.prisma.users.findFirst({
        where: {
          role: 'USER'
        },
        orderBy: {
          createdAt: 'asc'
        }
      });

      if (availableUser) {
        userId = availableUser.id;
      } else {
        // If no regular user found, use admin user as fallback
        const adminUser = await this.prisma.users.findFirst({
          where: {
            role: 'ADMIN'
          }
        });
        
        if (!adminUser) {
          throw new NotFoundException('No user available for booking');
        }
        userId = adminUser.id;
      }
    }

    // Verify technician exists if provided
    if (bookingData.technicianId) {
      const technician = await this.prisma.technicians.findUnique({
        where: { id: bookingData.technicianId }
      });
      if (!technician) {
        throw new NotFoundException('Technician not found');
      }
    }

    // Create booking with items
    const booking = await this.prisma.service_bookings.create({
      data: {
        id: bookingData.id || require('crypto').randomUUID(),
        serviceId: bookingData.serviceId,
        userId: userId,
        technicianId: bookingData.technicianId || null,
        status: bookingData.status || 'PENDING',
        scheduledAt: new Date(bookingData.scheduledAt),
        scheduledTime: bookingData.scheduledTime,
        notes: bookingData.notes || null,
        estimatedCosts: bookingData.estimatedCosts || 0,
        updatedAt: new Date(),
        service_booking_items: items?.length ? {
          create: items.map((item: any) => ({
            id: require('crypto').randomUUID(),
            serviceItemId: item.itemId,
            quantity: item.quantity,
            price: item.price || 0,
            updatedAt: new Date(),
          })),
        } : undefined,
      },
      include: {
        services: true,
        technicians: true,
        users: true,
        service_booking_items: {
          include: {
            service_items: true,
          },
        },
      },
    });

    return booking;
  }

  async update(id: string, updateBookingDto: any) {
    // Verify booking exists
    const existingBooking = await this.findOne(id);
    if (!existingBooking) {
      throw new NotFoundException('Booking not found');
    }

    const { items: _items, ...bookingData } = updateBookingDto;

    // Prepare update data
    const updateData: any = {};

    if (bookingData.serviceId) updateData.serviceId = bookingData.serviceId;
    if (bookingData.userId !== undefined) updateData.userId = bookingData.userId;
    if (bookingData.technicianId !== undefined) updateData.technicianId = bookingData.technicianId;
    if (bookingData.status) updateData.status = bookingData.status;
    if (bookingData.scheduledAt) updateData.scheduledAt = new Date(bookingData.scheduledAt);
    if (bookingData.scheduledTime) updateData.scheduledTime = bookingData.scheduledTime;
    if (bookingData.notes !== undefined) updateData.notes = bookingData.notes;
    if (bookingData.estimatedCosts !== undefined) updateData.estimatedCosts = bookingData.estimatedCosts;
    if (bookingData.actualCosts !== undefined) updateData.actualCosts = bookingData.actualCosts;
    updateData.updatedAt = new Date();

    // Update booking
    const booking = await this.prisma.service_bookings.update({
      where: { id },
      data: updateData,
      include: {
        services: true,
        technicians: true,
        users: true,
        service_booking_items: {
          include: {
            service_items: true,
          },
        },
      },
    });

    return booking;
  }

  async delete(id: string) {
    // Verify booking exists
    const booking = await this.findOne(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Delete related items first
    await this.prisma.service_booking_items.deleteMany({
      where: { bookingId: id },
    });

    // Delete related payments
    await this.prisma.service_payments.deleteMany({
      where: { bookingId: id },
    });

    // Delete the booking
    await this.prisma.service_bookings.delete({
      where: { id },
    });

    return { success: true, message: 'Booking deleted successfully' };
  }

  async updateStatus(id: string, status: string) {
    // Verify booking exists
    const booking = await this.findOne(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return this.prisma.service_bookings.update({
      where: { id },
      data: { status, updatedAt: new Date() },
      include: {
        services: true,
        technicians: true,
        users: true,
      },
    });
  }

  async assignTechnician(id: string, technicianId: string) {
    // Verify booking exists
    const booking = await this.findOne(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Verify technician exists
    const technician = await this.prisma.technicians.findUnique({
      where: { id: technicianId },
    });
    if (!technician) {
      throw new NotFoundException('Technician not found');
    }

    // Verify technician is active
    if (!technician.isActive) {
      throw new NotFoundException('Technician is not active');
    }

    // Update booking with technician
    return this.prisma.service_bookings.update({
      where: { id },
      data: {
        technicianId,
        updatedAt: new Date(),
      },
      include: {
        services: true,
        technicians: true,
        users: true,
        service_booking_items: {
          include: {
            service_items: true,
          },
        },
      },
    });
  }

  async createPayment(bookingId: string, paymentData: any) {
    return this.prisma.service_payments.create({
      data: {
        bookingId,
        ...paymentData,
      },
    });
  }

  async updatePaymentStatus(id: string, status: string) {
    return this.prisma.service_payments.update({
      where: { id },
      data: { status },
    });
  }
}
