import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { AssignTechnicianDto } from './dto/assign-technician.dto';
import { JwtGuard } from '../auth/jwt.guard';

@ApiTags('bookings')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  async findAll(@Query() _query: any) {
    return this.bookingService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get('my-bookings')
  @ApiOperation({ summary: 'Get current user bookings' })
  @ApiResponse({ status: 200, description: 'Returns user bookings' })
  async getMyBookings(@Req() req: any) {
    const userId = req.users?.sub;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.bookingService.findByUserId(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bookingService.findOne(id);
  }

  @Post()
  async create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(id, updateBookingDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.bookingService.delete(id);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateBookingStatusDto) {
    return this.bookingService.updateStatus(id, updateStatusDto.status);
  }

  @Patch(':id/assign')
  @ApiOperation({ summary: 'Assign technician to booking' })
  @ApiResponse({ status: 200, description: 'Technician assigned successfully' })
  @ApiResponse({ status: 404, description: 'Booking or technician not found' })
  async assignTechnician(
    @Param('id') id: string,
    @Body() assignDto: AssignTechnicianDto
  ) {
    return this.bookingService.assignTechnician(id, assignDto.technicianId);
  }

  @Post('payments')
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.bookingService.createPayment(createPaymentDto.bookingId || '', createPaymentDto);
  }

  @Put('payments/:paymentId/status')
  async updatePaymentStatus(
    @Param('paymentId') paymentId: string,
    @Body() updatePaymentDto: UpdatePaymentStatusDto
  ) {
    return this.bookingService.updatePaymentStatus(
      paymentId,
      updatePaymentDto.status
    );
  }
}
