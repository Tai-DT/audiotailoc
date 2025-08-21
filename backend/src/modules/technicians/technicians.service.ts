import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ServiceCategory } from '@prisma/client';

@Injectable()
export class TechniciansService {
  constructor(private readonly prisma: PrismaService) {}

  // Create new technician
  async createTechnician(data: {
    name: string;
    phone: string;
    email?: string;
    specialties: ServiceCategory[];
  }) {
    // Check if phone already exists
    const existingTechnician = await this.prisma.technician.findFirst({
      where: { phone: data.phone },
    });

    if (existingTechnician) {
      throw new BadRequestException('Số điện thoại đã được sử dụng');
    }

    return this.prisma.technician.create({
      data,
      include: {
        schedule: true,
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });
  }

  // Get all technicians
  async getTechnicians(params: {
    isActive?: boolean;
    specialty?: ServiceCategory;
    page?: number;
    pageSize?: number;
  }) {
    const page = Math.max(1, params.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20));
    
    const where: any = {};
    if (params.isActive !== undefined) where.isActive = params.isActive;
    if (params.specialty) {
      where.specialties = {
        has: params.specialty,
      };
    }

    const [total, technicians] = await this.prisma.$transaction([
      this.prisma.technician.count({ where }),
      this.prisma.technician.findMany({
        where,
        include: {
          schedule: true,
          _count: {
            select: {
              bookings: true,
            },
          },
        },
        orderBy: { name: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return { total, page, pageSize, technicians };
  }

  // Get technician by ID
  async getTechnician(id: string) {
    const technician = await this.prisma.technician.findUnique({
      where: { id },
      include: {
        schedule: {
          orderBy: { dayOfWeek: 'asc' },
        },
        bookings: {
          orderBy: { scheduledDate: 'desc' },
          take: 10,
          include: {
            service: true,
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    if (!technician) {
      throw new NotFoundException('Không tìm thấy kỹ thuật viên');
    }

    return technician;
  }

  // Update technician
  async updateTechnician(id: string, data: Partial<{
    name: string;
    phone: string;
    email: string;
    specialties: ServiceCategory[];
    isActive: boolean;
  }>) {
    const technician = await this.getTechnician(id);

    // Check if phone already exists (excluding current technician)
    if (data.phone && data.phone !== technician.phone) {
      const existingTechnician = await this.prisma.technician.findFirst({
        where: { 
          phone: data.phone,
          id: { not: id },
        },
      });

      if (existingTechnician) {
        throw new BadRequestException('Số điện thoại đã được sử dụng');
      }
    }

    return this.prisma.technician.update({
      where: { id },
      data,
      include: {
        schedule: true,
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });
  }

  // Delete technician
  async deleteTechnician(id: string) {
    const technician = await this.getTechnician(id);

    // Check if technician has any pending or in-progress bookings
    const activeBookings = await this.prisma.serviceBooking.count({
      where: {
        technicianId: id,
        status: {
          in: ['PENDING', 'CONFIRMED', 'ASSIGNED', 'IN_PROGRESS'],
        },
      },
    });

    if (activeBookings > 0) {
      throw new BadRequestException('Không thể xóa kỹ thuật viên có booking đang thực hiện');
    }

    return this.prisma.technician.delete({
      where: { id },
    });
  }

  // Schedule Management
  async setTechnicianSchedule(technicianId: string, schedules: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }>) {
    const technician = await this.getTechnician(technicianId);

    return this.prisma.$transaction(async (tx) => {
      // Delete existing schedules
      await tx.technicianSchedule.deleteMany({
        where: { technicianId },
      });

      // Create new schedules
      const createdSchedules = await Promise.all(
        schedules.map(schedule =>
          tx.technicianSchedule.create({
            data: {
              technicianId,
              ...schedule,
            },
          })
        )
      );

      return createdSchedules;
    });
  }

  // Get available technicians for a specific date and time
  async getAvailableTechnicians(params: {
    date: Date;
    time: string;
    specialty?: ServiceCategory;
    duration?: number; // in minutes
  }) {
    const dayOfWeek = params.date.getDay();
    const duration = params.duration || 60;
    
    // Calculate end time
    const [hours, minutes] = params.time.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + duration;
    const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`;

    const where: any = {
      isActive: true,
      schedule: {
        some: {
          dayOfWeek,
          isAvailable: true,
          startTime: { lte: params.time },
          endTime: { gte: endTime },
        },
      },
    };

    if (params.specialty) {
      where.specialties = {
        has: params.specialty,
      };
    }

    // Check for existing bookings that might conflict
    const technicians = await this.prisma.technician.findMany({
      where,
      include: {
        schedule: {
          where: { dayOfWeek },
        },
        bookings: {
          where: {
            scheduledDate: {
              gte: new Date(params.date.getFullYear(), params.date.getMonth(), params.date.getDate()),
              lt: new Date(params.date.getFullYear(), params.date.getMonth(), params.date.getDate() + 1),
            },
            status: {
              notIn: ['CANCELLED', 'COMPLETED'],
            },
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    // Filter out technicians with conflicting bookings
    const availableTechnicians = technicians.filter(technician => {
      return !technician.bookings.some(booking => {
        const bookingStart = booking.scheduledTime;
        const bookingEndMinutes = startMinutes + (duration || 60);
        const bookingEnd = `${Math.floor(bookingEndMinutes / 60).toString().padStart(2, '0')}:${(bookingEndMinutes % 60).toString().padStart(2, '0')}`;
        
        // Check for time overlap
        return !(params.time >= bookingEnd || endTime <= bookingStart);
      });
    });

    return availableTechnicians;
  }

  // Get technician workload
  async getTechnicianWorkload(technicianId: string, params: {
    fromDate?: Date;
    toDate?: Date;
  }) {
    const where: any = { technicianId };
    
    if (params.fromDate || params.toDate) {
      where.scheduledDate = {};
      if (params.fromDate) where.scheduledDate.gte = params.fromDate;
      if (params.toDate) where.scheduledDate.lte = params.toDate;
    }

    const [
      totalBookings,
      completedBookings,
      pendingBookings,
      totalRevenue,
    ] = await Promise.all([
      this.prisma.serviceBooking.count({ where }),
      this.prisma.serviceBooking.count({ 
        where: { ...where, status: 'COMPLETED' } 
      }),
      this.prisma.serviceBooking.count({ 
        where: { 
          ...where, 
          status: { in: ['PENDING', 'CONFIRMED', 'ASSIGNED', 'IN_PROGRESS'] } 
        } 
      }),
      this.prisma.serviceBooking.aggregate({
        where: { ...where, status: 'COMPLETED' },
        _sum: { actualCosts: true },
      }),
    ]);

    return {
      totalBookings,
      completedBookings,
      pendingBookings,
      completionRate: totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0,
      totalRevenue: totalRevenue._sum.actualCosts || 0,
    };
  }

  // Get technician statistics
  async getTechnicianStats() {
    const [
      totalTechnicians,
      activeTechnicians,
      totalBookings,
      completedBookings,
    ] = await Promise.all([
      this.prisma.technician.count(),
      this.prisma.technician.count({ where: { isActive: true } }),
      this.prisma.serviceBooking.count(),
      this.prisma.serviceBooking.count({ where: { status: 'COMPLETED' } }),
    ]);

    // Get top performers
    const topPerformers = await this.prisma.technician.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            bookings: {
              where: { status: 'COMPLETED' },
            },
          },
        },
      },
      orderBy: {
        bookings: {
          _count: 'desc',
        },
      },
      take: 5,
    });

    return {
      totalTechnicians,
      activeTechnicians,
      totalBookings,
      completedBookings,
      topPerformers,
    };
  }
}
