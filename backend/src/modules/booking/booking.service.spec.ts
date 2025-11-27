import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { PrismaService } from '../../prisma/prisma.service';
import { TelegramService } from '../notifications/telegram.service';
import { TechniciansService } from '../technicians/technicians.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('BookingService', () => {
  let service: BookingService;
  let prisma: PrismaService;
  let telegram: TelegramService;
  let technicians: TechniciansService;

  const mockBooking = {
    id: 'booking-123',
    serviceId: 'service-123',
    userId: 'user-123',
    technicianId: null,
    status: 'PENDING',
    scheduledAt: new Date('2025-12-01T10:00:00Z'),
    scheduledTime: '10:00',
    notes: null,
    estimatedCosts: 100000,
    actualCosts: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    services: { id: 'service-123', name: 'Installation Service' },
    technicians: null,
    users: { id: 'user-123', name: 'John Doe', email: 'john@example.com', phone: '0123456789' },
    service_booking_items: [],
    service_payments: [],
  };

  const mockPrismaService = {
    service_bookings: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    service_booking_items: {
      deleteMany: jest.fn(),
    },
    service_payments: {
      deleteMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    technicians: {
      findUnique: jest.fn(),
    },
  };

  const mockTelegramService = {
    sendBookingNotification: jest.fn(),
    sendBookingStatusUpdate: jest.fn(),
  };

  const mockTechniciansService = {
    getTechnician: jest.fn(),
    getTechnicianAvailability: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: TelegramService, useValue: mockTelegramService },
        { provide: TechniciansService, useValue: mockTechniciansService },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    prisma = module.get<PrismaService>(PrismaService);
    telegram = module.get<TelegramService>(TelegramService);
    technicians = module.get<TechniciansService>(TechniciansService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateStatus', () => {
    it('should update status from PENDING to CONFIRMED', async () => {
      mockPrismaService.service_bookings.findUnique.mockResolvedValue(mockBooking);
      mockPrismaService.service_bookings.update.mockResolvedValue({
        ...mockBooking,
        status: 'CONFIRMED',
      });

      const result = await service.updateStatus('booking-123', 'CONFIRMED');

      expect(result.status).toBe('CONFIRMED');
      expect(mockTelegramService.sendBookingStatusUpdate).toHaveBeenCalled();
    });

    it('should reject invalid status transition from COMPLETED to PENDING', async () => {
      mockPrismaService.service_bookings.findUnique.mockResolvedValue({
        ...mockBooking,
        status: 'COMPLETED',
      });

      await expect(service.updateStatus('booking-123', 'PENDING')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should allow PENDING to CANCELLED transition', async () => {
      mockPrismaService.service_bookings.findUnique.mockResolvedValue(mockBooking);
      mockPrismaService.service_bookings.update.mockResolvedValue({
        ...mockBooking,
        status: 'CANCELLED',
      });

      const result = await service.updateStatus('booking-123', 'CANCELLED');

      expect(result.status).toBe('CANCELLED');
    });

    it('should throw NotFoundException if booking does not exist', async () => {
      mockPrismaService.service_bookings.findUnique.mockResolvedValue(null);

      await expect(service.updateStatus('booking-999', 'CONFIRMED')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('cancelBooking', () => {
    it('should cancel a booking with reason', async () => {
      mockPrismaService.service_bookings.findUnique.mockResolvedValue(mockBooking);
      mockPrismaService.service_bookings.update.mockResolvedValue({
        ...mockBooking,
        status: 'CANCELLED',
        notes: '[CANCELLED] Customer requested',
      });

      const result = await service.cancelBooking('booking-123', 'Customer requested');

      expect(result.status).toBe('CANCELLED');
      expect(result.notes).toContain('[CANCELLED] Customer requested');
      expect(mockTelegramService.sendBookingStatusUpdate).toHaveBeenCalled();
    });

    it('should reject cancelling a completed booking', async () => {
      mockPrismaService.service_bookings.findUnique.mockResolvedValue({
        ...mockBooking,
        status: 'COMPLETED',
      });

      await expect(service.cancelBooking('booking-123', 'Too late')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should reject cancelling an already cancelled booking', async () => {
      mockPrismaService.service_bookings.findUnique.mockResolvedValue({
        ...mockBooking,
        status: 'CANCELLED',
      });

      await expect(service.cancelBooking('booking-123', 'Duplicate')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('assignTechnician', () => {
    it('should assign a technician to a booking', async () => {
      const mockTechnician = { id: 'tech-123', name: 'Jane Tech', isActive: true };
      mockPrismaService.service_bookings.findUnique.mockResolvedValue(mockBooking);
      mockPrismaService.technicians.findUnique.mockResolvedValue(mockTechnician);
      mockPrismaService.service_bookings.update.mockResolvedValue({
        ...mockBooking,
        technicianId: 'tech-123',
        technicians: mockTechnician,
      });

      const result = await service.assignTechnician('booking-123', 'tech-123');

      expect(result.technicianId).toBe('tech-123');
    });

    it('should reject assigning inactive technician', async () => {
      const mockTechnician = { id: 'tech-123', name: 'Jane Tech', isActive: false };
      mockPrismaService.service_bookings.findUnique.mockResolvedValue(mockBooking);
      mockPrismaService.technicians.findUnique.mockResolvedValue(mockTechnician);

      await expect(service.assignTechnician('booking-123', 'tech-123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a booking by id', async () => {
      mockPrismaService.service_bookings.findUnique.mockResolvedValue(mockBooking);

      const result = await service.findOne('booking-123');

      expect(result).toEqual(mockBooking);
    });

    it('should throw NotFoundException if booking not found', async () => {
      mockPrismaService.service_bookings.findUnique.mockResolvedValue(null);

      await expect(service.findOne('booking-999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a booking and its related items', async () => {
      mockPrismaService.service_bookings.findUnique.mockResolvedValue(mockBooking);
      mockPrismaService.service_booking_items.deleteMany.mockResolvedValue({ count: 0 });
      mockPrismaService.service_payments.deleteMany.mockResolvedValue({ count: 0 });
      mockPrismaService.service_bookings.delete.mockResolvedValue(mockBooking);

      const result = await service.delete('booking-123');

      expect(result.success).toBe(true);
      expect(mockPrismaService.service_booking_items.deleteMany).toHaveBeenCalledWith({
        where: { bookingId: 'booking-123' },
      });
      expect(mockPrismaService.service_payments.deleteMany).toHaveBeenCalledWith({
        where: { bookingId: 'booking-123' },
      });
    });
  });
});
