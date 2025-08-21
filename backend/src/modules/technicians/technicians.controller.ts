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
import { TechniciansService } from './technicians.service';
import { ServiceCategory } from '@prisma/client';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('technicians')
// @UseGuards(JwtAuthGuard)
export class TechniciansController {
  constructor(private readonly techniciansService: TechniciansService) {}

  @Post()
  async createTechnician(@Body() createTechnicianDto: {
    name: string;
    phone: string;
    email?: string;
    specialties: ServiceCategory[];
  }) {
    return this.techniciansService.createTechnician(createTechnicianDto);
  }

  @Get()
  async getTechnicians(@Query() query: {
    isActive?: string;
    specialty?: ServiceCategory;
    page?: string;
    pageSize?: string;
  }) {
    return this.techniciansService.getTechnicians({
      isActive: query.isActive === 'true',
      specialty: query.specialty,
      page: query.page ? parseInt(query.page) : undefined,
      pageSize: query.pageSize ? parseInt(query.pageSize) : undefined,
    });
  }

  @Get('available')
  async getAvailableTechnicians(@Query() query: {
    date: string;
    time: string;
    specialty?: ServiceCategory;
    duration?: string;
  }) {
    return this.techniciansService.getAvailableTechnicians({
      date: new Date(query.date),
      time: query.time,
      specialty: query.specialty,
      duration: query.duration ? parseInt(query.duration) : undefined,
    });
  }

  @Get('stats')
  async getTechnicianStats() {
    return this.techniciansService.getTechnicianStats();
  }

  @Get(':id')
  async getTechnician(@Param('id') id: string) {
    return this.techniciansService.getTechnician(id);
  }

  @Get(':id/workload')
  async getTechnicianWorkload(
    @Param('id') id: string,
    @Query() query: {
      fromDate?: string;
      toDate?: string;
    }
  ) {
    return this.techniciansService.getTechnicianWorkload(id, {
      fromDate: query.fromDate ? new Date(query.fromDate) : undefined,
      toDate: query.toDate ? new Date(query.toDate) : undefined,
    });
  }

  @Put(':id')
  async updateTechnician(
    @Param('id') id: string,
    @Body() updateTechnicianDto: {
      name?: string;
      phone?: string;
      email?: string;
      specialties?: ServiceCategory[];
      isActive?: boolean;
    }
  ) {
    return this.techniciansService.updateTechnician(id, updateTechnicianDto);
  }

  @Delete(':id')
  async deleteTechnician(@Param('id') id: string) {
    return this.techniciansService.deleteTechnician(id);
  }

  @Put(':id/schedule')
  async setTechnicianSchedule(
    @Param('id') id: string,
    @Body() scheduleDto: {
      schedules: Array<{
        dayOfWeek: number;
        startTime: string;
        endTime: string;
        isAvailable: boolean;
      }>;
    }
  ) {
    return this.techniciansService.setTechnicianSchedule(id, scheduleDto.schedules);
  }
}
