import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ServiceBookingStatus, PaymentStatus, PaymentProvider } from '@prisma/client';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  // Create new service booking
  async createBooking(data: {
    serviceId: string;
    userId?: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    customerAddress: string;
    scheduledDate: Date;
    scheduledTime: string;
    notes?: string;
    items?: Array<{ itemId: string; quantity: number }>;
  }) {
    const service = await this.prisma.service.findUnique({
      where: { id: data.serviceId },
      include: { items: true },
    });

    if (!service) {
      throw new NotFoundException('Không tìm thấy dịch vụ');
    }

    const bookingNo = `SV${Date.now()}`;
    let estimatedCosts = service.basePriceCents;

    const booking = await this.prisma.$transaction(async (tx) => {
      // Create booking
      const newBooking = await tx.serviceBooking.create({
        data: {
          bookingNo,
          serviceId: data.serviceId,
          userId: data.userId,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerEmail: data.customerEmail,
          customerAddress: data.customerAddress,
          scheduledDate: data.scheduledDate,
          scheduledTime: data.scheduledTime,
          notes: data.notes,
          estimatedCosts,
          status: ServiceBookingStatus.PENDING,
        },
      });

      // Add booking items if provided
      if (data.items && data.items.length > 0) {
        for (const item of data.items) {
          const serviceItem = service.items.find(si => si.id === item.itemId);
          if (!serviceItem) {
            throw new BadRequestException(`Không tìm thấy mục dịch vụ: ${item.itemId}`);
          }

          const totalPrice = serviceItem.priceCents * item.quantity;
          estimatedCosts += totalPrice;

          await tx.serviceBookingItem.create({
            data: {
              bookingId: newBooking.id,
              itemId: item.itemId,
              quantity: item.quantity,
              unitPrice: serviceItem.priceCents,
              totalPrice,
            },
          });
        }

        // Update estimated costs
        await tx.serviceBooking.update({
          where: { id: newBooking.id },
          data: { estimatedCosts },
        });
      }

      // Create status history
      await tx.serviceStatusHistory.create({
        data: {
          bookingId: newBooking.id,
          status: ServiceBookingStatus.PENDING,
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
            item: true,
          },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
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
      where.scheduledDate = {};
      if (params.fromDate) where.scheduledDate.gte = params.fromDate;
      if (params.toDate) where.scheduledDate.lte = params.toDate;
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
              item: true,
            },
          },
        },
        orderBy: { scheduledDate: 'asc' },
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
    changedBy?: string,
    actualCosts?: number
  ) {
    const booking = await this.getBooking(id);

    const updatedBooking = await this.prisma.$transaction(async (tx) => {
      const updateData: any = { status };
      
      if (status === ServiceBookingStatus.COMPLETED) {
        updateData.completedAt = new Date();
        if (actualCosts !== undefined) {
          updateData.actualCosts = actualCosts;
        }
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
    const booking = await this.getBooking(bookingId);
    
    const technician = await this.prisma.technician.findUnique({
      where: { id: technicianId },
    });

    if (!technician) {
      throw new NotFoundException('Không tìm thấy kỹ thuật viên');
    }

    if (!technician.isActive) {
      throw new BadRequestException('Kỹ thuật viên không hoạt động');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
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

    const updated = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.serviceBooking.update({
        where: { id },
        data: {
          scheduledDate: newDate,
          scheduledTime: newTime,
          status: ServiceBookingStatus.RESCHEDULED,
        },
      });

      await tx.serviceStatusHistory.create({
        data: {
          bookingId: id,
          status: ServiceBookingStatus.RESCHEDULED,
          note: note || `Dời lịch từ ${booking.scheduledDate.toLocaleDateString()} ${booking.scheduledTime} sang ${newDate.toLocaleDateString()} ${newTime}`,
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

    const updated = await this.prisma.$transaction(async (tx) => {
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
          note: reason || 'Booking bị hủy',
        },
      });

      return updated;
    });

    return this.getBooking(id);
  }

  // Create payment for booking
  async createPayment(bookingId: string, data: {
    amountCents: number;
    paymentMethod: PaymentProvider;
    transactionId?: string;
  }) {
    const booking = await this.getBooking(bookingId);

    return this.prisma.servicePayment.create({
      data: {
        bookingId,
        amountCents: data.amountCents,
        paymentMethod: data.paymentMethod,
        status: PaymentStatus.PENDING,
        transactionId: data.transactionId,
      },
    });
  }

  // Update payment status
  async updatePaymentStatus(paymentId: string, status: PaymentStatus, transactionId?: string) {
    const updateData: any = { status };
    
    if (status === PaymentStatus.SUCCEEDED) {
      updateData.paidAt = new Date();
    }
    
    if (transactionId) {
      updateData.transactionId = transactionId;
    }

    return this.prisma.servicePayment.update({
      where: { id: paymentId },
      data: updateData,
    });
  }

  // Get booking statistics
  async getBookingStats(params?: {
    fromDate?: Date;
    toDate?: Date;
    technicianId?: string;
  }) {
    const where: any = {};
    
    if (params?.fromDate || params?.toDate) {
      where.scheduledDate = {};
      if (params.fromDate) where.scheduledDate.gte = params.fromDate;
      if (params.toDate) where.scheduledDate.lte = params.toDate;
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
      this.prisma.serviceBooking.aggregate({
        where: { ...where, status: ServiceBookingStatus.COMPLETED },
        _sum: { actualCosts: true },
      }),
    ]);

    return {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      inProgressBookings,
      completedBookings,
      cancelledBookings,
      totalRevenue: totalRevenue._sum.actualCosts || 0,
    };
  }
}
