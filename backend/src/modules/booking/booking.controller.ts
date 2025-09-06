import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { ServiceBookingStatus } from '../../common/enums';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('bookings')
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
    scheduledAt: string; // ISO date string
    scheduledTime: string;
    notes?: string;
    items?: Array<{ itemId: string; quantity: number }>;
  }) {
    return this.bookingService.createBooking({
      ...createBookingDto,
      scheduledAt: new Date(createBookingDto.scheduledAt),
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
  @ApiOperation({ summary: 'Update booking status' })
  @ApiResponse({ status: 200, description: 'Booking updated' })
  async updateBookingStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateBookingStatusDto
  ) {
    return this.bookingService.updateBookingStatus(
      id,
      updateStatusDto.status,
      updateStatusDto.note,
      updateStatusDto.changedBy
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
  @ApiOperation({ summary: 'Create a booking payment' })
  @ApiResponse({ status: 201, description: 'Payment created' })
  @Post(':id/payments')
  async createPayment(
    @Param('id') bookingId: string,
    @Body() createPaymentDto: CreatePaymentDto
  ) {
    return this.bookingService.createPayment(bookingId, createPaymentDto);
  }

  @ApiOperation({ summary: 'Update payment status' })
  @ApiResponse({ status: 200, description: 'Payment updated' })
  @Put('payments/:paymentId/status')
  async updatePaymentStatus(
    @Param('paymentId') paymentId: string,
    @Body() updatePaymentDto: UpdatePaymentStatusDto
  ) {
    return this.bookingService.updatePaymentStatus(
      paymentId,
      updatePaymentDto.status,
      updatePaymentDto.transactionId
    );
  }
}
