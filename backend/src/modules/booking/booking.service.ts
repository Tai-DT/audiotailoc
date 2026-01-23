import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as crypto from 'crypto';

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

  async findByUserId(userId: string) {
    return this.prisma.service_bookings.findMany({
      where: { userId },
      include: {
        services: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        technicians: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        service_booking_items: {
          include: {
            service_items: {
              select: {
                name: true,
              },
            },
          },
        },
        service_payments: {
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(createBookingDto: any) {
    const { items, ...bookingData } = createBookingDto;

    // Validate required fields
    if (!bookingData.serviceId) {
      throw new NotFoundException('Service ID is required');
    }

    // Verify service exists
    const service = await this.prisma.services.findUnique({
      where: { id: bookingData.serviceId },
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
      const itemIds = items.map(item => item.itemId);
      const serviceItems = await this.prisma.service_items.findMany({
        where: {
          id: { in: itemIds },
        },
      });
      const foundItemIds = serviceItems.map(item => item.id);

      if (foundItemIds.length !== itemIds.length) {
        const missingItemIds = itemIds.filter(id => !foundItemIds.includes(id));
        throw new NotFoundException(`Service items not found: ${missingItemIds.join(', ')}`);
      }
    }

    // Verify userId is provided
    const userId = bookingData.userId;
    if (!userId) {
      throw new BadRequestException('User ID is required for booking');
    }

    // Verify user exists
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify technician exists if provided
    if (bookingData.technicianId) {
      const technician = await this.prisma.technicians.findUnique({
        where: { id: bookingData.technicianId },
      });
      if (!technician) {
        throw new NotFoundException('Technician not found');
      }
    }

    // Handle both scheduledAt and scheduledDate (frontend uses scheduledDate)
    const scheduledDate = bookingData.scheduledAt || bookingData.scheduledDate;
    if (!scheduledDate) {
      throw new BadRequestException('Scheduled date is required');
    }

    // Create booking with items
    const booking = await this.prisma.service_bookings.create({
      data: {
        id: bookingData.id || crypto.randomUUID(),
        serviceId: bookingData.serviceId,
        userId: userId,
        technicianId: bookingData.technicianId || null,
        status: bookingData.status || 'PENDING',
        scheduledAt: new Date(scheduledDate),
        scheduledTime: bookingData.scheduledTime,
        notes: bookingData.notes || null,
        address: bookingData.address || null,
        // Include customer info for record keeping (useful even for authenticated users)
        customerName: bookingData.customerName || user.name || null,
        customerPhone: bookingData.customerPhone || user.phone || null,
        customerEmail: bookingData.customerEmail || user.email || null,
        estimatedCosts: bookingData.estimatedCosts || service.price || 0,
        updatedAt: new Date(),
        service_booking_items: items?.length
          ? {
              create: items.map((item: any) => ({
                id: crypto.randomUUID(),
                serviceItemId: item.itemId,
                quantity: item.quantity,
                price: item.price || 0,
                updatedAt: new Date(),
              })),
            }
          : undefined,
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

  // Guest booking - no authentication required
  async createGuestBooking(guestBookingData: {
    serviceId: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    customerAddress?: string;
    scheduledDate: string;
    scheduledTime: string;
    notes?: string;
  }) {
    // Verify service exists and is active
    const service = await this.prisma.services.findUnique({
      where: { id: guestBookingData.serviceId },
    });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    if (!service.isActive) {
      throw new NotFoundException('Service is not available');
    }

    // Create guest booking
    const booking = await this.prisma.service_bookings.create({
      data: {
        id: crypto.randomUUID(),
        serviceId: guestBookingData.serviceId,
        userId: null, // No user for guest booking
        technicianId: null,
        status: 'PENDING',
        scheduledAt: new Date(guestBookingData.scheduledDate),
        scheduledTime: guestBookingData.scheduledTime,
        notes: guestBookingData.notes || null,
        address: guestBookingData.customerAddress || null,
        customerName: guestBookingData.customerName,
        customerPhone: guestBookingData.customerPhone,
        customerEmail: guestBookingData.customerEmail || null,
        estimatedCosts: service.price || 0,
        updatedAt: new Date(),
      },
      include: {
        services: true,
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
    if (bookingData.estimatedCosts !== undefined)
      updateData.estimatedCosts = bookingData.estimatedCosts;
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
