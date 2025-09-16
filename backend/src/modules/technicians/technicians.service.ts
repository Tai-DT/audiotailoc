import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ServiceCategory, ServiceBookingStatus } from '../../common/enums';

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
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || '',
        specialties: JSON.stringify(data.specialties || []),
      },
      include: {
        schedules: true,
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
      // specialties stored as JSON string; use substring contains
      where.specialties = { contains: params.specialty };
    }

    const [total, technicians] = await this.prisma.$transaction([
      this.prisma.technician.count({ where }),
      this.prisma.technician.findMany({
        where,
        include: {
          schedules: true,
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
        schedules: {
          orderBy: { date: 'asc' },
        },
        bookings: {
          orderBy: { scheduledAt: 'desc' },
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

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.specialties !== undefined) updateData.specialties = JSON.stringify(data.specialties || []);
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    return this.prisma.technician.update({
      where: { id },
      data: updateData,
      include: {
        schedules: true,
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
    const _technician = await this.getTechnician(id);

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
    date: Date;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }>) {
    const _technician = await this.getTechnician(technicianId);

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
              date: schedule.date,
              startTime: schedule.startTime,
              endTime: schedule.endTime,
              isAvailable: schedule.isAvailable,
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
    const duration = params.duration || 60;
    const [hours, minutes] = params.time.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + duration;
    const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`;

    const where: any = {
      isActive: true,
      schedules: {
        some: {
          date: {
            gte: new Date(params.date.getFullYear(), params.date.getMonth(), params.date.getDate()),
            lt: new Date(params.date.getFullYear(), params.date.getMonth(), params.date.getDate() + 1),
          },
          isAvailable: true,
          startTime: { lte: params.time },
          endTime: { gte: endTime },
        },
      },
    };

    if (params.specialty) {
      where.specialties = { contains: params.specialty };
    }

    const technicians = await this.prisma.technician.findMany({
      where,
      include: {
        schedules: {
          where: {
            date: {
              gte: new Date(params.date.getFullYear(), params.date.getMonth(), params.date.getDate()),
              lt: new Date(params.date.getFullYear(), params.date.getMonth(), params.date.getDate() + 1),
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return technicians;
  }

  // Get technician workload
  async getTechnicianWorkload(technicianId: string, params: {
    fromDate?: Date;
    toDate?: Date;
  }) {
    const where: any = { technicianId };
    
    if (params.fromDate || params.toDate) {
      where.scheduledAt = {};
      if (params.fromDate) where.scheduledAt.gte = params.fromDate;
      if (params.toDate) where.scheduledAt.lte = params.toDate;
    }

    const [
      totalBookings,
      completedBookings,
      pendingBookings,
      totalRevenue,
    ] = await Promise.all([
      this.prisma.serviceBooking.count({ where }),
      this.prisma.serviceBooking.count({ 
        where: { ...where, status: ServiceBookingStatus.COMPLETED } 
      }),
      this.prisma.serviceBooking.count({ 
        where: { 
          ...where, 
          status: { in: [
            ServiceBookingStatus.PENDING,
            ServiceBookingStatus.CONFIRMED,
            ServiceBookingStatus.ASSIGNED,
            ServiceBookingStatus.IN_PROGRESS,
          ] } 
        } 
      }),
      this.prisma.serviceBookingItem.aggregate({
        where: {
          booking: { ...where, status: ServiceBookingStatus.COMPLETED },
        },
        _sum: { price: true },
      }),
    ]);

    return {
      totalBookings,
      completedBookings,
      pendingBookings,
      completionRate: totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0,
      totalRevenue: (totalRevenue._sum as any).price || 0,
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
    const topPerformersRaw = await this.prisma.technician.findMany({
      where: { isActive: true },
      include: {
        bookings: {
          where: { status: ServiceBookingStatus.COMPLETED },
          select: { id: true },
        },
      },
    });
    const topPerformers = (topPerformersRaw as any[])
      .sort((a, b) => (b.bookings?.length || 0) - (a.bookings?.length || 0))
      .slice(0, 5);

    return {
      totalTechnicians,
      activeTechnicians,
      totalBookings,
      completedBookings,
      topPerformers,
    };
  }
}
