import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ServiceBookingStatus, PaymentStatus, PaymentProvider } from '../../common/enums';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  // Create new service booking
  async createBooking(data: {
    serviceId: string;
    userId?: string;
    // Customer fields are currently unused as they don't exist in schema
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    customerAddress: string;
    scheduledAt: Date;
    scheduledTime: string;
    notes?: string;
    items?: Array<{ itemId: string; quantity: number }>;
  }) {
    if (!data.userId) {
      throw new BadRequestException('userId is required');
    }
    const service = await this.prisma.service.findUnique({
      where: { id: data.serviceId },
      include: { items: true },
    });

    if (!service) {
      throw new NotFoundException('Không tìm thấy dịch vụ');
    }

    const booking = await this.prisma.$transaction(async (tx) => {
      // Create booking
      const newBooking = await tx.serviceBooking.create({
        data: {
          serviceId: data.serviceId,
          userId: data.userId as string,
          scheduledAt: data.scheduledAt,
          scheduledTime: data.scheduledTime,
          notes: data.notes,
          status: ServiceBookingStatus.PENDING,
        },
      });

      // Add booking items if provided
      let estimatedCosts = service.basePriceCents || 0;
      if (data.items && data.items.length > 0) {
        for (const item of data.items) {
          const serviceItem = service.items.find(si => si.id === item.itemId);
          if (!serviceItem) {
            throw new BadRequestException(`Không tìm thấy mục dịch vụ: ${item.itemId}`);
          }

          const lineTotal = serviceItem.price * item.quantity;
          estimatedCosts += lineTotal;
          await tx.serviceBookingItem.create({
            data: {
              bookingId: newBooking.id,
              serviceItemId: item.itemId,
              quantity: item.quantity,
              // Schema has only a single price field; store total price
              price: lineTotal,
            },
          });
        }
      }

      // Persist estimated costs
      await tx.serviceBooking.update({
        where: { id: newBooking.id },
        data: { estimatedCosts },
      });

      // Create status history
      await tx.serviceStatusHistory.create({
        data: {
          bookingId: newBooking.id,
          status: ServiceBookingStatus.PENDING,
          newStatus: ServiceBookingStatus.PENDING,
          note: 'Booking được tạo',
        },
      });

      return newBooking;
    });

    return this.getBooking(booking.id);
  }

  // Get booking details
  async getBooking(id: string) {
    const booking = await this.prisma.serviceBooking.findUnique({
      where: { id },
      include: {
        service: true,
        user: true,
        technician: true,
        items: {
          include: {
            serviceItem: true,
          },
        },
        history: { orderBy: { createdAt: 'desc' } },
        payments: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Không tìm thấy booking');
    }

    return booking;
  }

  // List bookings with filters
  async getBookings(params: {
    status?: ServiceBookingStatus;
    technicianId?: string;
    userId?: string;
    serviceId?: string;
    fromDate?: Date;
    toDate?: Date;
    page?: number;
    pageSize?: number;
  }) {
    const page = Math.max(1, params.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20));
    
    const where: any = {};
    if (params.status) where.status = params.status;
    if (params.technicianId) where.technicianId = params.technicianId;
    if (params.userId) where.userId = params.userId;
    if (params.serviceId) where.serviceId = params.serviceId;
    
    if (params.fromDate || params.toDate) {
      where.scheduledAt = {};
      if (params.fromDate) where.scheduledAt.gte = params.fromDate;
      if (params.toDate) where.scheduledAt.lte = params.toDate;
    }

    const [total, bookings] = await this.prisma.$transaction([
      this.prisma.serviceBooking.count({ where }),
      this.prisma.serviceBooking.findMany({
        where,
        include: {
          service: true,
          user: true,
          technician: true,
          items: {
            include: {
              serviceItem: true,
            },
          },
        },
        orderBy: { scheduledAt: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return { total, page, pageSize, bookings };
  }

  // Update booking status
  async updateBookingStatus(
    id: string, 
    status: ServiceBookingStatus, 
    note?: string,
    changedBy?: string
  ) {
    const _booking = await this.getBooking(id);

    const _updatedBooking = await this.prisma.$transaction(async (tx) => {
      const updateData: any = { status };
      
      if (status === ServiceBookingStatus.COMPLETED) {
        updateData.completedAt = new Date();
        // Compute actualCosts from items
        const sum = await tx.serviceBookingItem.aggregate({
          where: { bookingId: id },
          _sum: { price: true },
        });
        updateData.actualCosts = sum._sum.price || 0;
      }

      const updated = await tx.serviceBooking.update({
        where: { id },
        data: updateData,
      });

      // Add to status history
      await tx.serviceStatusHistory.create({
        data: {
          bookingId: id,
          status,
          newStatus: status,
          note,
          changedBy,
        },
      });

      return updated;
    });

    return this.getBooking(id);
  }

  // Assign technician to booking
  async assignTechnician(bookingId: string, technicianId: string, note?: string) {
    const _booking = await this.getBooking(bookingId);
    
    const technician = await this.prisma.technician.findUnique({
      where: { id: technicianId },
    });

    if (!technician) {
      throw new NotFoundException('Không tìm thấy kỹ thuật viên');
    }

    if (!technician.isActive) {
      throw new BadRequestException('Kỹ thuật viên không hoạt động');
    }

    const _updated = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.serviceBooking.update({
        where: { id: bookingId },
        data: {
          technicianId,
          status: ServiceBookingStatus.ASSIGNED,
        },
      });

      await tx.serviceStatusHistory.create({
        data: {
          bookingId,
          status: ServiceBookingStatus.ASSIGNED,
          newStatus: ServiceBookingStatus.ASSIGNED,
          note: note || `Phân công cho ${technician.name}`,
        },
      });

      return updated;
    });

    return this.getBooking(bookingId);
  }

  // Reschedule booking
  async rescheduleBooking(
    id: string, 
    newDate: Date, 
    newTime: string, 
    note?: string
  ) {
    const booking = await this.getBooking(id);

    if (booking.status === ServiceBookingStatus.COMPLETED || 
        booking.status === ServiceBookingStatus.CANCELLED) {
      throw new BadRequestException('Không thể dời lịch booking đã hoàn thành hoặc đã hủy');
    }

    const _updated = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.serviceBooking.update({
        where: { id },
        data: {
          scheduledAt: newDate,
          scheduledTime: newTime,
          status: ServiceBookingStatus.RESCHEDULED,
        },
      });

      await tx.serviceStatusHistory.create({
        data: {
          bookingId: id,
          status: ServiceBookingStatus.RESCHEDULED,
          newStatus: ServiceBookingStatus.RESCHEDULED,
          note: note || `Dời lịch sang ${newDate.toLocaleDateString()} ${newTime}`,
        },
      });

      return updated;
    });

    return this.getBooking(id);
  }

  // Cancel booking
  async cancelBooking(id: string, reason?: string) {
    const booking = await this.getBooking(id);

    if (booking.status === ServiceBookingStatus.COMPLETED) {
      throw new BadRequestException('Không thể hủy booking đã hoàn thành');
    }

    const _updated = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.serviceBooking.update({
        where: { id },
        data: {
          status: ServiceBookingStatus.CANCELLED,
        },
      });

      await tx.serviceStatusHistory.create({
        data: {
          bookingId: id,
          status: ServiceBookingStatus.CANCELLED,
          newStatus: ServiceBookingStatus.CANCELLED,
          note: reason || 'Booking bị hủy',
        },
      });

      return updated;
    });

    return this.getBooking(id);
  }

  // Payment operations

  // Get booking statistics
  async getBookingStats(params?: {
    fromDate?: Date;
    toDate?: Date;
    technicianId?: string;
  }) {
    const where: any = {};
    
    if (params?.fromDate || params?.toDate) {
      where.scheduledAt = {};
      if (params.fromDate) where.scheduledAt.gte = params.fromDate;
      if (params.toDate) where.scheduledAt.lte = params.toDate;
    }
    
    if (params?.technicianId) {
      where.technicianId = params.technicianId;
    }

    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      inProgressBookings,
      completedBookings,
      cancelledBookings,
      totalRevenue,
    ] = await Promise.all([
      this.prisma.serviceBooking.count({ where }),
      this.prisma.serviceBooking.count({ where: { ...where, status: ServiceBookingStatus.PENDING } }),
      this.prisma.serviceBooking.count({ where: { ...where, status: ServiceBookingStatus.CONFIRMED } }),
      this.prisma.serviceBooking.count({ where: { ...where, status: ServiceBookingStatus.IN_PROGRESS } }),
      this.prisma.serviceBooking.count({ where: { ...where, status: ServiceBookingStatus.COMPLETED } }),
      this.prisma.serviceBooking.count({ where: { ...where, status: ServiceBookingStatus.CANCELLED } }),
      // Sum revenue from booking items of completed bookings
      this.prisma.serviceBookingItem.aggregate({
        where: {
          booking: {
            ...where,
            status: ServiceBookingStatus.COMPLETED,
          },
        },
        _sum: { price: true },
      }),
    ]);

    return {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      inProgressBookings,
      completedBookings,
      cancelledBookings,
      totalRevenue: totalRevenue._sum.price || 0,
    };
  }

  // Create payment for booking
  async createPayment(bookingId: string, data: {
    amountCents: number;
    paymentMethod: PaymentProvider;
    transactionId?: string;
  }) {
    await this.getBooking(bookingId);

    return this.prisma.servicePayment.create({
      data: {
        bookingId,
        provider: data.paymentMethod,
        amountCents: data.amountCents,
        status: PaymentStatus.PENDING,
        transactionId: data.transactionId,
      },
    });
  }

  // Update payment status
  async updatePaymentStatus(paymentId: string, status: PaymentStatus, transactionId?: string) {
    const updateData: any = { status };
    if (transactionId) updateData.transactionId = transactionId;
    if (status === PaymentStatus.SUCCEEDED || status === PaymentStatus.COMPLETED) {
      updateData.paidAt = new Date();
    }

    return this.prisma.servicePayment.update({
      where: { id: paymentId },
      data: updateData,
    });
  }
}
