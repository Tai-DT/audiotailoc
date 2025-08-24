import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
// import { ServiceBookingStatus, PaymentProvider, PaymentStatus } from '@prisma/client'; // Not available in SQLite schema
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bookings')
// @UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async createBooking(@Body() createBookingDto: {
    serviceId: string;
    userId?: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    customerAddress: string;
    scheduledDate: string; // ISO date string
    scheduledTime: string;
    notes?: string;
    items?: Array<{ itemId: string; quantity: number }>;
  }) {
    return this.bookingService.createBooking({
      ...createBookingDto,
      scheduledDate: new Date(createBookingDto.scheduledDate),
    });
  }

  @Get()
  async getBookings(@Query() query: {
    status?: ServiceBookingStatus;
    technicianId?: string;
    userId?: string;
    serviceId?: string;
    fromDate?: string;
    toDate?: string;
    page?: string;
    pageSize?: string;
  }) {
    return this.bookingService.getBookings({
      status: query.status,
      technicianId: query.technicianId,
      userId: query.userId,
      serviceId: query.serviceId,
      fromDate: query.fromDate ? new Date(query.fromDate) : undefined,
      toDate: query.toDate ? new Date(query.toDate) : undefined,
      page: query.page ? parseInt(query.page) : undefined,
      pageSize: query.pageSize ? parseInt(query.pageSize) : undefined,
    });
  }

  @Get('stats')
  async getBookingStats(@Query() query: {
    fromDate?: string;
    toDate?: string;
    technicianId?: string;
  }) {
    return this.bookingService.getBookingStats({
      fromDate: query.fromDate ? new Date(query.fromDate) : undefined,
      toDate: query.toDate ? new Date(query.toDate) : undefined,
      technicianId: query.technicianId,
    });
  }

  @Get(':id')
  async getBooking(@Param('id') id: string) {
    return this.bookingService.getBooking(id);
  }

  @Put(':id/status')
  async updateBookingStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: {
      status: ServiceBookingStatus;
      note?: string;
      changedBy?: string;
      actualCosts?: number;
    }
  ) {
    return this.bookingService.updateBookingStatus(
      id,
      updateStatusDto.status,
      updateStatusDto.note,
      updateStatusDto.changedBy,
      updateStatusDto.actualCosts
    );
  }

  @Put(':id/assign')
  async assignTechnician(
    @Param('id') id: string,
    @Body() assignDto: {
      technicianId: string;
      note?: string;
    }
  ) {
    return this.bookingService.assignTechnician(id, assignDto.technicianId, assignDto.note);
  }

  @Put(':id/reschedule')
  async rescheduleBooking(
    @Param('id') id: string,
    @Body() rescheduleDto: {
      newDate: string;
      newTime: string;
      note?: string;
    }
  ) {
    return this.bookingService.rescheduleBooking(
      id,
      new Date(rescheduleDto.newDate),
      rescheduleDto.newTime,
      rescheduleDto.note
    );
  }

  @Put(':id/cancel')
  async cancelBooking(
    @Param('id') id: string,
    @Body() cancelDto: {
      reason?: string;
    }
  ) {
    return this.bookingService.cancelBooking(id, cancelDto.reason);
  }

  // Payment endpoints
  @Post(':id/payments')
  async createPayment(
    @Param('id') bookingId: string,
    @Body() createPaymentDto: {
      amountCents: number;
      paymentMethod: PaymentProvider;
      transactionId?: string;
    }
  ) {
    return this.bookingService.createPayment(bookingId, createPaymentDto);
  }

  @Put('payments/:paymentId/status')
  async updatePaymentStatus(
    @Param('paymentId') paymentId: string,
    @Body() updatePaymentDto: {
      status: PaymentStatus;
      transactionId?: string;
    }
  ) {
    return this.bookingService.updatePaymentStatus(
      paymentId,
      updatePaymentDto.status,
      updatePaymentDto.transactionId
    );
  }
}
