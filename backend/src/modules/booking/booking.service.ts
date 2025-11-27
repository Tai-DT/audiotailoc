import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TelegramService } from '../notifications/telegram.service';
import { TechniciansService } from '../technicians/technicians.service';

@Injectable()
export class BookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegram: TelegramService,
    private readonly techniciansService: TechniciansService,
  ) {}

  /**
   * Validate status transition based on allowed workflow
   */
  private validateStatusTransition(oldStatus: string, newStatus: string): void {
    const allowedTransitions: Record<string, string[]> = {
      PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['ASSIGNED', 'CANCELLED'],
      ASSIGNED: ['IN_PROGRESS', 'CANCELLED'],
      IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
      COMPLETED: [], // No transitions allowed from COMPLETED
      CANCELLED: [], // No transitions allowed from CANCELLED
      RESCHEDULED: ['PENDING', 'CONFIRMED', 'CANCELLED'],
    };

    const allowed = allowedTransitions[oldStatus] || [];
    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${oldStatus} to ${newStatus}. Allowed transitions: ${allowed.join(', ') || 'none'}`,
      );
    }
  }

  async findAll(query: any = {}) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = query.status;
    const search = query.search;

    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { users: { name: { contains: search, mode: 'insensitive' } } },
        { users: { email: { contains: search, mode: 'insensitive' } } },
        { users: { phone: { contains: search, mode: 'insensitive' } } },
        { services: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [bookings, total] = await Promise.all([
      this.prisma.service_bookings.findMany({
        where,
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
        skip,
        take: limit,
      }),
      this.prisma.service_bookings.count({ where }),
    ]);

    return {
      bookings,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
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
      for (const item of items) {
        const serviceItem = await this.prisma.service_items.findUnique({
          where: { id: item.itemId },
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
          role: 'USER',
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      if (availableUser) {
        userId = availableUser.id;
      } else {
        // If no regular user found, use admin user as fallback
        const adminUser = await this.prisma.users.findFirst({
          where: {
            role: 'ADMIN',
          },
        });

        if (!adminUser) {
          throw new NotFoundException('No user available for booking');
        }
        userId = adminUser.id;
      }
    }

    // Verify technician exists and is available if provided
    if (bookingData.technicianId) {
      const technician = await this.techniciansService.getTechnician(bookingData.technicianId);
      if (!technician.isActive) {
        throw new BadRequestException('Technician is not active');
      }

      // Check availability
      if (bookingData.scheduledAt && bookingData.scheduledTime) {
        const isAvailable = await this.checkTechnicianAvailability(
          bookingData.technicianId,
          new Date(bookingData.scheduledAt),
          bookingData.scheduledTime,
        );
        if (!isAvailable) {
          throw new BadRequestException('Technician is not available at this time');
        }
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
        address: bookingData.address || null,
        coordinates: bookingData.coordinates || null,
        goongPlaceId: bookingData.goongPlaceId || null,
        updatedAt: new Date(),
        service_booking_items: items?.length
          ? {
              create: items.map((item: any) => ({
                id: require('crypto').randomUUID(),
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

    // Send Telegram notification
    try {
      await this.telegram.sendBookingNotification({
        id: booking.id,
        customerName: booking.users?.name || 'N/A',
        customerEmail: booking.users?.email || 'N/A',
        customerPhone: booking.users?.phone,
        serviceName: booking.services?.name || 'N/A',
        scheduledTime: booking.scheduledAt || booking.scheduledTime,
        technicianName: booking.technicians?.name,
        estimatedCost: booking.estimatedCosts,
        status: booking.status,
      });
    } catch (error) {
      console.error('Failed to send booking notification:', error);
    }

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
    if (bookingData.address !== undefined) updateData.address = bookingData.address;
    if (bookingData.coordinates !== undefined) updateData.coordinates = bookingData.coordinates;
    if (bookingData.goongPlaceId !== undefined) updateData.goongPlaceId = bookingData.goongPlaceId;
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

  async updateStatus(id: string, status: string, changedBy?: string) {
    // Verify booking exists
    const booking = await this.findOne(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Validate status transition
    this.validateStatusTransition(booking.status, status);

    const updated = await this.prisma.service_bookings.update({
      where: { id },
      data: { status, updatedAt: new Date() },
      include: {
        services: true,
        technicians: true,
        users: true,
      },
    });

    // Send status update notification
    try {
      await this.telegram.sendBookingStatusUpdate(
        {
          id: updated.id,
          customerName: updated.users?.name || 'N/A',
          serviceName: updated.services?.name || 'N/A',
        },
        booking.status, // old status
        status, // new status
      );
    } catch (error) {
      console.error('Failed to send booking status update:', error);
    }

    return updated;
  }

  async cancelBooking(id: string, reason: string, cancelledBy?: string) {
    // Verify booking exists
    const booking = await this.findOne(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check if booking can be cancelled
    if (booking.status === 'COMPLETED') {
      throw new BadRequestException('Cannot cancel a completed booking');
    }

    if (booking.status === 'CANCELLED') {
      throw new BadRequestException('Booking is already cancelled');
    }

    // Update booking to cancelled status with reason
    const updated = await this.prisma.service_bookings.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        notes: booking.notes
          ? `${booking.notes}\n\n[CANCELLED] ${reason}`
          : `[CANCELLED] ${reason}`,
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

    // Send cancellation notification
    try {
      await this.telegram.sendBookingStatusUpdate(
        {
          id: updated.id,
          customerName: updated.users?.name || 'N/A',
          serviceName: updated.services?.name || 'N/A',
        },
        booking.status,
        'CANCELLED',
      );
    } catch (error) {
      console.error('Failed to send booking cancellation notification:', error);
    }

    return updated;
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

  private async checkTechnicianAvailability(
    technicianId: string,
    date: Date,
    time: string,
  ): Promise<boolean> {
    const availability = await this.techniciansService.getTechnicianAvailability(
      technicianId,
      date,
    );

    if (!availability.isAvailable) {
      return false;
    }

    // Check if time slot is within schedule
    if (availability.schedule) {
      if (time < availability.schedule.startTime || time > availability.schedule.endTime) {
        return false;
      }
    }

    // Check for overlapping bookings
    // Assuming 1 hour duration for now, or we should check duration from service
    // For simplicity, check if any booking starts at the same time
    const conflict = availability.bookings.some(booking => booking.scheduledTime === time);

    return !conflict;
  }
}
