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
  ForbiddenException,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreateGuestBookingDto } from './dto/create-guest-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { AssignTechnicianDto } from './dto/assign-technician.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('bookings')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  @UseGuards(JwtGuard, AdminGuard)
  async findAll(@Query() _query: any) {
    return this.bookingService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get('my-bookings')
  @ApiOperation({ summary: 'Get current user bookings' })
  @ApiResponse({ status: 200, description: 'Returns user bookings' })
  async getMyBookings(@Req() req: any) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.bookingService.findByUserId(userId);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async findOne(@Param('id') id: string, @Req() req: any) {
    const booking = await this.bookingService.findOne(id);

    // SECURITY: Prevent IDOR - users can only view their own bookings unless they're admin
    const authenticatedUserId = req.user?.sub || req.user?.id;
    const isAdmin = req.user?.role === 'ADMIN' || req.user?.email === process.env.ADMIN_EMAIL;

    // Check if booking belongs to authenticated user
    const bookingUserId = (booking as any)?.userId || (booking as any)?.users?.id;
    if (!isAdmin && bookingUserId && bookingUserId !== authenticatedUserId) {
      throw new ForbiddenException('You can only view your own bookings');
    }

    return booking;
  }

  @Post()
  @UseGuards(JwtGuard)
  async create(@Body() createBookingDto: CreateBookingDto, @Req() req: any) {
    const authenticatedUserId = req.user?.sub || req.user?.id;

    // SECURITY: Ensure booking is created for the authenticated user
    const isAdmin = req.user?.role === 'ADMIN' || req.user?.email === process.env.ADMIN_EMAIL;

    if (createBookingDto.userId && !isAdmin && createBookingDto.userId !== authenticatedUserId) {
      throw new ForbiddenException('You can only create bookings for yourself');
    }

    // Force authenticated user's ID if not admin
    if (!isAdmin) {
      createBookingDto.userId = authenticatedUserId;
    }

    return this.bookingService.create(createBookingDto);
  }

  @Post('guest')
  @ApiOperation({ summary: 'Create a booking as a guest (no authentication required)' })
  @ApiResponse({ status: 201, description: 'Guest booking created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async createGuestBooking(@Body() guestBookingDto: CreateGuestBookingDto) {
    return this.bookingService.createGuestBooking(guestBookingDto);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  async update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @Req() req: any,
  ) {
    // SECURITY: Prevent IDOR - verify ownership before update
    const booking = await this.bookingService.findOne(id);
    const authenticatedUserId = req.user?.sub || req.user?.id;
    const isAdmin = req.user?.role === 'ADMIN' || req.user?.email === process.env.ADMIN_EMAIL;

    const bookingUserId = (booking as any)?.userId || (booking as any)?.users?.id;
    if (!isAdmin && bookingUserId && bookingUserId !== authenticatedUserId) {
      throw new ForbiddenException('You can only update your own bookings');
    }

    // Prevent users from modifying userId to another user's ID
    if (updateBookingDto.userId && !isAdmin && updateBookingDto.userId !== authenticatedUserId) {
      throw new ForbiddenException('You cannot assign bookings to other users');
    }

    return this.bookingService.update(id, updateBookingDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async delete(@Param('id') id: string, @Req() req: any) {
    // SECURITY: Prevent IDOR - verify ownership before delete
    const booking = await this.bookingService.findOne(id);
    const authenticatedUserId = req.user?.sub || req.user?.id;
    const isAdmin = req.user?.role === 'ADMIN' || req.user?.email === process.env.ADMIN_EMAIL;

    const bookingUserId = (booking as any)?.userId || (booking as any)?.users?.id;
    if (!isAdmin && bookingUserId && bookingUserId !== authenticatedUserId) {
      throw new ForbiddenException('You can only delete your own bookings');
    }

    return this.bookingService.delete(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateBookingStatusDto,
    @Req() req: any,
  ) {
    // SECURITY: Prevent IDOR - verify ownership before status update
    const booking = await this.bookingService.findOne(id);
    const authenticatedUserId = req.user?.sub || req.user?.id;
    const isAdmin = req.user?.role === 'ADMIN' || req.user?.email === process.env.ADMIN_EMAIL;

    const bookingUserId = (booking as any)?.userId || (booking as any)?.users?.id;
    if (!isAdmin && bookingUserId && bookingUserId !== authenticatedUserId) {
      throw new ForbiddenException('You can only update status of your own bookings');
    }

    return this.bookingService.updateStatus(id, updateStatusDto.status);
  }

  @Patch(':id/assign')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiOperation({ summary: 'Assign technician to booking' })
  @ApiResponse({ status: 200, description: 'Technician assigned successfully' })
  @ApiResponse({ status: 404, description: 'Booking or technician not found' })
  async assignTechnician(@Param('id') id: string, @Body() assignDto: AssignTechnicianDto) {
    return this.bookingService.assignTechnician(id, assignDto.technicianId);
  }

  @Post('payments')
  @UseGuards(JwtGuard)
  async createPayment(@Body() createPaymentDto: CreatePaymentDto, @Req() req: any) {
    // SECURITY: Verify booking ownership
    const booking = await this.bookingService.findOne(createPaymentDto.bookingId || '');
    const authenticatedUserId = req.user?.sub || req.user?.id;
    const isAdmin = req.user?.role === 'ADMIN' || req.user?.email === process.env.ADMIN_EMAIL;

    const bookingUserId = (booking as any)?.userId || (booking as any)?.users?.id;
    if (!isAdmin && bookingUserId && bookingUserId !== authenticatedUserId) {
      throw new ForbiddenException('You can only create payments for your own bookings');
    }

    return this.bookingService.createPayment(createPaymentDto.bookingId || '', createPaymentDto);
  }

  @Put('payments/:paymentId/status')
  @UseGuards(JwtGuard, AdminGuard)
  async updatePaymentStatus(
    @Param('paymentId') paymentId: string,
    @Body() updatePaymentDto: UpdatePaymentStatusDto,
  ) {
    return this.bookingService.updatePaymentStatus(paymentId, updatePaymentDto.status);
  }
}
