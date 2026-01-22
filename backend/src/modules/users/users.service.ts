import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../notifications/mail.service';
import { SecurityService } from '../security/security.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly securityService: SecurityService,
  ) {}

  async findByEmail(email: string) {
    return this.prisma.users.findUnique({ where: { email } });
  }

  async findById(id: string) {
    const user = await this.prisma.users.findUnique({
      where: { id },
      include: {
        orders: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findAll(params: {
    page: number;
    limit: number;
    search?: string;
    role?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, params.limit || 20);
    const skip = (page - 1) * limit;

    const where: Prisma.usersWhereInput = {};

    if (params.search) {
      where.OR = [
        { email: { contains: params.search, mode: 'insensitive' } },
        { name: { contains: params.search, mode: 'insensitive' } },
        { phone: { contains: params.search } },
      ];
    }

    if (params.role) where.role = params.role;

    if (params.status) {
      if (params.status === 'active') where.isActive = true;
      else if (params.status === 'inactive') where.isActive = false;
    }

    const [users, total] = await this.prisma.$transaction([
      this.prisma.users.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.users.count({ where }),
    ]);

    return {
      users: users.map(u => {
        const { password: _password, ...rest } = u;
        return rest;
      }),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(dto: any) {
    const existing = await this.findByEmail(dto.email);
    if (existing) throw new BadRequestException('Email already exists');

    const hashedPassword = await this.securityService.hashPassword(dto.password || 'TaiLoc@123');

    return this.prisma.users.create({
      data: {
        id: randomUUID(),
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        phone: dto.phone,
        role: dto.role || 'USER',
        isActive: true,
        updatedAt: new Date(),
      },
      select: { id: true, email: true, name: true, role: true },
    });
  }

  async update(id: string, dto: any, isAdminAction: boolean = false) {
    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const updateData: any = { ...dto };

    // SECURITY: Prevent non-admin from changing role or isActive status
    if (!isAdminAction) {
      delete updateData.role;
      delete updateData.isActive;
    }

    if (updateData.password) {
      updateData.password = await this.securityService.hashPassword(updateData.password);
    }

    const updatedUser = await this.prisma.users.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });

    const { password: _password, ...result } = updatedUser;
    return result;
  }

  async delete(id: string) {
    const orderCount = await this.prisma.orders.count({
      where: { userId: id },
    });

    if (orderCount > 0) {
      await this.prisma.users.update({
        where: { id },
        data: { isActive: false, updatedAt: new Date() },
      });
      return {
        success: true,
        message: 'User deactivated due to order history',
      };
    }

    await this.prisma.users.delete({ where: { id } });
    return { success: true, message: 'User deleted permanently' };
  }

  // --- PASSWORD & RESET LOGIC ---

  async findByResetToken(token: string) {
    if (!token) return null;
    return this.prisma.users.findFirst({
      where: {
        resetToken: token,
        resetExpires: { gt: new Date() },
      },
    });
  }

  async setResetToken(userId: string, token: string, expires: Date) {
    return this.prisma.users.update({
      where: { id: userId },
      data: {
        resetToken: token,
        resetExpires: expires,
      },
    });
  }

  async updatePasswordAndClearResetToken(userId: string, hashedPassword: string) {
    return this.prisma.users.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetExpires: null,
        updatedAt: new Date(),
      },
    });
  }

  async updatePassword(userId: string, hashedPassword: string) {
    return this.prisma.users.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });
  }
}
