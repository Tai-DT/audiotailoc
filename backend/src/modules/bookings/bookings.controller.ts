import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Prisma } from '@prisma/client';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('stats')
  getStats() {
    return this.bookingsService.getStats();
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('serviceTypeId') serviceTypeId?: string,
    @Query('technicianId') technicianId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const take = limit ? parseInt(limit) : 20;
    const skip = page ? (parseInt(page) - 1) * take : 0;

    const where: Prisma.service_bookingsWhereInput = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (serviceTypeId) {
      where.services = { typeId: serviceTypeId };
    }

    if (technicianId) {
      where.technicianId = technicianId;
    }

    if (startDate || endDate) {
      where.scheduledAt = {};
      if (startDate) where.scheduledAt.gte = new Date(startDate);
      if (endDate) where.scheduledAt.lte = new Date(endDate);
    }

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        {
          users: {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }

    return this.bookingsService.findAll({
      skip,
      take,
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Post()
  create(@Body() createBookingDto: Prisma.service_bookingsCreateInput) {
    return this.bookingsService.create(createBookingDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: Prisma.service_bookingsUpdateInput) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string; notes?: string }) {
    return this.bookingsService.updateStatus(id, body.status, body.notes);
  }

  @Patch(':id/assign')
  assignTechnician(@Param('id') id: string, @Body() body: { technicianId: string }) {
    return this.bookingsService.assignTechnician(id, body.technicianId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }
}
