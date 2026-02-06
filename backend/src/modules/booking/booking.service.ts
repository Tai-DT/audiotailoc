import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  Optional,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ServiceBookingStatus } from '../../common/enums';
import { TelegramService } from '../notifications/telegram.service';
import * as crypto from 'crypto';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Optional() private readonly telegramService?: TelegramService,
  ) {}

  private readonly allowedTimeSlots = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ];

  private validateSchedule(date: Date, time?: string) {
    if (!time) {
      throw new BadRequestException('Giờ đặt lịch là bắt buộc');
    }

    if (!/^\d{2}:\d{2}$/.test(time)) {
      throw new BadRequestException('Giờ đặt lịch không hợp lệ');
    }

    if (!this.allowedTimeSlots.includes(time)) {
      throw new BadRequestException('Khung giờ không khả dụng');
    }

    const scheduleDate = new Date(date);
    if (Number.isNaN(scheduleDate.getTime())) {
      throw new BadRequestException('Ngày đặt lịch không hợp lệ');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const scheduledDay = new Date(scheduleDate);
    scheduledDay.setHours(0, 0, 0, 0);

    if (scheduledDay < today) {
      throw new BadRequestException('Ngày đặt lịch phải từ hôm nay trở đi');
    }

    const [hour, minute] = time.split(':').map(value => parseInt(value, 10));
    const scheduledDateTime = new Date(scheduleDate);
    scheduledDateTime.setHours(hour, minute, 0, 0);

    if (scheduledDateTime.getTime() < Date.now()) {
      throw new BadRequestException('Giờ đặt lịch phải ở tương lai');
    }
  }

  private parseScheduleDate(input: string | Date): Date {
    if (input instanceof Date) {
      return new Date(input);
    }

    if (typeof input === 'string') {
      const trimmed = input.trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        const [year, month, day] = trimmed.split('-').map(value => parseInt(value, 10));
        return new Date(year, month - 1, day);
      }

      return new Date(trimmed);
    }

    return new Date(input as unknown as string);
  }

  private async ensureSlotAvailable(
    _serviceId: string,
    date: Date,
    time: string,
    technicianId?: string | null,
    excludeBookingId?: string,
  ) {
    if (!technicianId) {
      // No technician assigned yet; allow multiple bookings for the same slot.
      return;
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const existing = await this.prisma.service_bookings.findFirst({
      where: {
        technicianId,
        scheduledTime: time,
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          notIn: [ServiceBookingStatus.CANCELLED, ServiceBookingStatus.COMPLETED],
        },
        ...(excludeBookingId ? { id: { not: excludeBookingId } } : {}),
      },
    });

    if (existing) {
      throw new BadRequestException('Khung giờ này đã được đặt. Vui lòng chọn giờ khác');
    }
  }

  private serializeCoordinates(
    coordinates?: { lat: number; lng: number } | string | null,
  ): string | null {
    if (!coordinates) return null;
    if (typeof coordinates === 'string') return coordinates;
    return JSON.stringify(coordinates);
  }

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
            images: true,
            duration: true,
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
    const scheduledDateInput = bookingData.scheduledAt || bookingData.scheduledDate;
    if (!scheduledDateInput) {
      throw new BadRequestException('Scheduled date is required');
    }
    const scheduledDate = this.parseScheduleDate(scheduledDateInput);
    this.validateSchedule(scheduledDate, bookingData.scheduledTime);
    await this.ensureSlotAvailable(
      bookingData.serviceId,
      scheduledDate,
      bookingData.scheduledTime,
      bookingData.technicianId ?? null,
    );

    // Create booking with items
    const booking = await this.prisma.service_bookings.create({
      data: {
        id: bookingData.id || crypto.randomUUID(),
        serviceId: bookingData.serviceId,
        userId: userId,
        technicianId: bookingData.technicianId || null,
        status: bookingData.status || 'PENDING',
        scheduledAt: scheduledDate,
        scheduledTime: bookingData.scheduledTime,
        notes: bookingData.notes || null,
        address: bookingData.address || null,
        coordinates: this.serializeCoordinates(bookingData.coordinates),
        goongPlaceId: bookingData.goongPlaceId || null,
        // Include customer info for record keeping (useful even for authenticated users)
        customerName: bookingData.customerName || user.name || null,
        customerPhone: bookingData.customerPhone || user.phone || null,
        customerEmail: bookingData.customerEmail || user.email || null,
        estimatedCosts: BigInt(
          bookingData.estimatedCosts || service.basePriceCents || service.price || 0,
        ) as any,
        updatedAt: new Date(),
        service_booking_items: items?.length
          ? {
              create: items.map((item: any) => ({
                id: crypto.randomUUID(),
                serviceItemId: item.itemId,
                quantity: item.quantity,
                price: BigInt(item.price || 0),
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

    await this.notifyBookingCreated(booking, service.name, false);
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
    coordinates?: { lat: number; lng: number } | string;
    goongPlaceId?: string;
  }) {
    // Verify service exists and is active
    const service = await this.prisma.services.findUnique({
      where: { id: guestBookingData.serviceId },
    });
    if (!service) {
      throw new NotFoundException('Dịch vụ không tồn tại');
    }
    if (!service.isActive) {
      throw new BadRequestException('Dịch vụ hiện không khả dụng');
    }

    // ✅ Validate scheduled date is in the future
    const scheduledDate = this.parseScheduleDate(guestBookingData.scheduledDate);
    this.validateSchedule(scheduledDate, guestBookingData.scheduledTime);

    // ✅ Validate phone number format (Vietnamese phone)
    const phoneRegex = /^(0|\+84)[3-9][0-9]{8}$/;
    if (!phoneRegex.test(guestBookingData.customerPhone.replace(/\s/g, ''))) {
      throw new BadRequestException('Số điện thoại không hợp lệ');
    }

    // ✅ Validate email format if provided
    if (guestBookingData.customerEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(guestBookingData.customerEmail)) {
        throw new BadRequestException('Email không hợp lệ');
      }
    }

    // Create guest booking
    await this.ensureSlotAvailable(
      guestBookingData.serviceId,
      scheduledDate,
      guestBookingData.scheduledTime,
      null,
    );

    const booking = await this.prisma.service_bookings.create({
      data: {
        id: crypto.randomUUID(),
        serviceId: guestBookingData.serviceId,
        userId: null, // No user for guest booking
        technicianId: null,
        status: 'PENDING',
        scheduledAt: scheduledDate,
        scheduledTime: guestBookingData.scheduledTime,
        notes: guestBookingData.notes || null,
        address: guestBookingData.customerAddress || null,
        coordinates: this.serializeCoordinates(guestBookingData.coordinates),
        goongPlaceId: guestBookingData.goongPlaceId || null,
        customerName: guestBookingData.customerName,
        customerPhone: guestBookingData.customerPhone,
        customerEmail: guestBookingData.customerEmail || null,
        estimatedCosts: (service.basePriceCents || service.price || BigInt(0)) as any,
        updatedAt: new Date(),
      },
      include: {
        services: true,
      },
    });

    await this.notifyBookingCreated(booking, service.name, true);
    return booking;
  }

  private async notifyBookingCreated(booking: any, serviceName: string, isGuest: boolean) {
    if (!this.telegramService) {
      this.logger.debug('TelegramService not available, skipping booking notification');
      return;
    }

    const scheduledDate = booking?.scheduledAt
      ? new Date(booking.scheduledAt).toLocaleDateString('vi-VN')
      : 'N/A';
    const scheduledTime = booking?.scheduledTime || 'N/A';
    const customerName = booking?.customerName || 'N/A';
    const customerPhone = booking?.customerPhone || 'N/A';
    const address = booking?.address || 'N/A';

    const message = [
      '🛠️ Đặt lịch dịch vụ mới',
      `• Dịch vụ: ${serviceName || 'N/A'}`,
      `• Mã booking: ${booking?.id || 'N/A'}`,
      `• Thời gian: ${scheduledDate} ${scheduledTime}`,
      `• Khách hàng: ${customerName}`,
      `• SĐT: ${customerPhone}`,
      `• Địa chỉ: ${address}`,
      `• Loại: ${isGuest ? 'Khách' : 'Thành viên'}`,
    ].join('\n');

    try {
      await this.telegramService.sendMessage(message);
    } catch (error) {
      this.logger.error('Failed to send booking Telegram notification', error);
    }
  }

  async update(id: string, updateBookingDto: any) {
    // Verify booking exists
    const existingBooking = await this.findOne(id);
    if (!existingBooking) {
      throw new NotFoundException('Booking not found');
    }

    const { items: _items, ...bookingData } = updateBookingDto;
    const scheduleChanged =
      bookingData.scheduledAt || bookingData.scheduledDate || bookingData.scheduledTime;

    // Prepare update data
    const updateData: any = {};

    if (bookingData.serviceId) updateData.serviceId = bookingData.serviceId;
    if (bookingData.userId !== undefined) updateData.userId = bookingData.userId;
    if (bookingData.technicianId !== undefined) updateData.technicianId = bookingData.technicianId;
    if (bookingData.status) updateData.status = bookingData.status;
    const nextScheduledAtRaw = bookingData.scheduledAt || bookingData.scheduledDate;
    const nextScheduledAt = nextScheduledAtRaw
      ? this.parseScheduleDate(nextScheduledAtRaw)
      : existingBooking.scheduledAt;
    const nextScheduledTime = bookingData.scheduledTime ?? existingBooking.scheduledTime;
    const nextTechnicianId = bookingData.technicianId ?? existingBooking.technicianId;

    if (scheduleChanged) {
      this.validateSchedule(nextScheduledAt, nextScheduledTime);
      await this.ensureSlotAvailable(
        existingBooking.serviceId,
        nextScheduledAt,
        nextScheduledTime,
        nextTechnicianId,
        id,
      );
      updateData.scheduledAt = nextScheduledAt;
      updateData.scheduledTime = nextScheduledTime;
    }
    if (bookingData.notes !== undefined) updateData.notes = bookingData.notes;
    if (bookingData.address !== undefined) updateData.address = bookingData.address;
    if (bookingData.customerName !== undefined) updateData.customerName = bookingData.customerName;
    if (bookingData.customerPhone !== undefined)
      updateData.customerPhone = bookingData.customerPhone;
    if (bookingData.customerEmail !== undefined)
      updateData.customerEmail = bookingData.customerEmail;
    if (bookingData.coordinates !== undefined) {
      updateData.coordinates = this.serializeCoordinates(bookingData.coordinates);
    }
    if (bookingData.goongPlaceId !== undefined) {
      updateData.goongPlaceId = bookingData.goongPlaceId;
    }
    if (bookingData.estimatedCosts !== undefined)
      updateData.estimatedCosts = BigInt(bookingData.estimatedCosts);
    if (bookingData.actualCosts !== undefined)
      updateData.actualCosts = BigInt(bookingData.actualCosts);
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
    try {
      // Verify booking exists
      const booking = await this.findOne(id);
      if (!booking) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }

      this.logger.log(`Attempting to delete booking: ${id}`);

      // Dependency cascades are now handled by Prisma at the database level (onDelete: Cascade)
      await this.prisma.service_bookings.delete({
        where: { id },
      });

      this.logger.log(`Successfully deleted booking: ${id}`);
      return { success: true, message: 'Booking deleted successfully' };
    } catch (error) {
      this.logger.error(`Failed to delete booking ${id}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Không thể xóa đặt lịch: ${error.message || 'Lỗi cơ sở dữ liệu'}`,
      );
    }
  }

  async updateStatus(id: string, status: string) {
    // Verify booking exists
    const booking = await this.findOne(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const currentStatus = String(
      booking.status || ServiceBookingStatus.PENDING,
    ) as ServiceBookingStatus;
    const nextStatus = status as ServiceBookingStatus;
    const allowedTransitions: Record<ServiceBookingStatus, ServiceBookingStatus[]> = {
      [ServiceBookingStatus.PENDING]: [
        ServiceBookingStatus.CONFIRMED,
        ServiceBookingStatus.ASSIGNED,
        ServiceBookingStatus.CANCELLED,
        ServiceBookingStatus.RESCHEDULED,
      ],
      [ServiceBookingStatus.CONFIRMED]: [
        ServiceBookingStatus.ASSIGNED,
        ServiceBookingStatus.IN_PROGRESS,
        ServiceBookingStatus.CANCELLED,
        ServiceBookingStatus.RESCHEDULED,
      ],
      [ServiceBookingStatus.ASSIGNED]: [
        ServiceBookingStatus.IN_PROGRESS,
        ServiceBookingStatus.CANCELLED,
        ServiceBookingStatus.RESCHEDULED,
      ],
      [ServiceBookingStatus.IN_PROGRESS]: [
        ServiceBookingStatus.COMPLETED,
        ServiceBookingStatus.CANCELLED,
      ],
      [ServiceBookingStatus.RESCHEDULED]: [
        ServiceBookingStatus.CONFIRMED,
        ServiceBookingStatus.ASSIGNED,
        ServiceBookingStatus.IN_PROGRESS,
        ServiceBookingStatus.CANCELLED,
      ],
      [ServiceBookingStatus.COMPLETED]: [],
      [ServiceBookingStatus.CANCELLED]: [],
    };

    const allowed = allowedTransitions[currentStatus] || [];
    if (!allowed.includes(nextStatus)) {
      throw new BadRequestException('Chuyển đổi trạng thái không hợp lệ');
    }

    return this.prisma.service_bookings.update({
      where: { id },
      data: {
        status: nextStatus,
        completedAt:
          nextStatus === ServiceBookingStatus.COMPLETED ? new Date() : booking.completedAt,
        updatedAt: new Date(),
      },
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
    // Verify booking exists
    const booking = await this.prisma.service_bookings.findUnique({
      where: { id: bookingId },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Whitelist allowed fields for security
    const allowedFields = ['provider', 'amountCents', 'status', 'transactionId'];
    const sanitizedData: any = {};
    for (const field of allowedFields) {
      if (paymentData[field] !== undefined) {
        sanitizedData[field] = paymentData[field];
      }
    }

    return this.prisma.service_payments.create({
      data: {
        id: crypto.randomUUID(),
        bookingId,
        provider: sanitizedData.provider || 'COD',
        status: sanitizedData.status || 'PENDING',
        amountCents: BigInt(sanitizedData.amountCents || booking.estimatedCosts || 0) as any,
        transactionId: sanitizedData.transactionId,
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
