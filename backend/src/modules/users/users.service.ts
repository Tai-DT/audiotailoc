import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { randomUUID, randomBytes } from 'crypto';
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
            // reviews: true, // Field not available in SQLite schema
            // wishlistItems: true // Field not available in SQLite schema
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
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const skip = (params.page - 1) * params.limit;

    // Build where clause
    const where: Prisma.usersWhereInput = {};

    if (params.search) {
      where.OR = [
        { email: { contains: params.search, mode: 'insensitive' } },
        { name: { contains: params.search, mode: 'insensitive' } },
        { phone: { contains: params.search } },
      ];
    }

    if (params.role) {
      where.role = params.role;
    }

    if (params.status) {
      // For now, we'll assume all users are active
      // In the future, you might want to add an 'active' field to the User model
      if (params.status === 'active') {
        where.id = { not: null }; // All users are considered active
      } else if (params.status === 'inactive') {
        // This would need a proper inactive status field
        where.id = null; // No inactive users for now
      }
    }
    if (params.startDate || params.endDate) {
      where.createdAt = {};
      if (params.startDate) {
        where.createdAt.gte = new Date(params.startDate);
      }
      if (params.endDate) {
        where.createdAt.lte = new Date(params.endDate);
      }
    }

    // Build orderBy
    const orderBy: Prisma.usersOrderByWithRelationInput = {};
    const sortField = params.sortBy || 'createdAt';
    const sortOrder = params.sortOrder || 'desc';

    if (['name', 'email', 'role', 'createdAt'].includes(sortField)) {
      orderBy[sortField] = sortOrder;
    } else {
      orderBy.createdAt = 'desc';
    }

    // SECURITY: Only expose necessary fields for user list
    // Email and phone are PII and should only be visible to admins
    // This endpoint is already protected by AdminOrKeyGuard in controller
    const [users, total] = await Promise.all([
      this.prisma.users.findMany({
        skip,
        take: params.limit,
        where,
        select: {
          id: true,
          email: true, // Admin-only endpoint, so email is OK
          name: true,
          phone: true, // Admin-only endpoint, so phone is OK
          role: true,
          createdAt: true,
          orders: {
            select: {
              totalCents: true,
            },
          },
          _count: {
            select: {
              orders: true,
            },
          },
        },
        orderBy,
      }),
      this.prisma.users.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        pages: Math.ceil(total / params.limit),
      },
    };
  }

  async create(createUserDto: {
    email: string;
    password?: string;
    name: string;
    phone?: string;
    role?: 'USER' | 'ADMIN';
    generatePassword?: boolean;
  }) {
    // SECURITY: Use generic error message to prevent user enumeration
    // Don't reveal whether email exists or not
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      // Use generic message to prevent user enumeration attacks
      throw new BadRequestException(
        'Unable to create account. Please try again or contact support.',
      );
    }

    let password = createUserDto.password;
    let generatedPassword = false;

    // Generate password if requested or if no password provided
    if (createUserDto.generatePassword || !createUserDto.password) {
      password = this.generateRandomPassword();
      generatedPassword = true;
    }

    if (!password) {
      throw new BadRequestException('Password is required');
    }

    const hashedPassword = await this.securityService.hashPassword(password);

    const user = await this.prisma.users.create({
      data: {
        id: randomUUID(),
        email: createUserDto.email,
        password: hashedPassword,
        name: createUserDto.name,
        phone: createUserDto.phone,
        role: createUserDto.role || 'USER',
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    // Send email with password if it was generated
    if (generatedPassword) {
      try {
        await this.sendWelcomeEmail(user.email, user.name || 'User', password);
      } catch (_error) {
        this.logger.error(`Failed to send welcome email to ${user.email}:`, _error);
        // Don't fail the user creation if email fails
      }
    }

    return user;
  }

  // Backward-compatible alias
  async createUser(params: { email: string; password: string; name?: string | null }) {
    // SECURITY: Use generic error message to prevent user enumeration
    const existingUser = await this.findByEmail(params.email);
    if (existingUser) {
      // Use generic message to prevent user enumeration attacks
      throw new BadRequestException(
        'Unable to create account. Please try again or contact support.',
      );
    }

    const hashedPassword = await this.securityService.hashPassword(params.password);
    return this.prisma.users.create({
      data: {
        id: randomUUID(),
        email: params.email,
        password: hashedPassword,
        name: params.name ?? '',
        updatedAt: new Date(),
      },
    });
  }

  async update(
    id: string,
    updateUserDto: {
      name?: string;
      phone?: string;
      role?: 'USER' | 'ADMIN';
      address?: string;
      dateOfBirth?: Date | string;
      gender?: string;
      isActive?: boolean;
      avatarUrl?: string;
      emailNotifications?: boolean;
      smsNotifications?: boolean;
      promoNotifications?: boolean;
    },
    currentUser?: { role?: string; sub?: string; email?: string }, // Current authenticated user for privilege escalation prevention
  ) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // SECURITY: Prevent privilege escalation - only admins can modify roles
    // Remove role from update data if current user is not admin
    const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.email === process.env.ADMIN_EMAIL;
    const updateData = { ...updateUserDto };

    if (!isAdmin && updateData.role !== undefined) {
      // Non-admin users cannot modify roles (including their own)
      delete updateData.role;
      this.logger.warn(
        `User ${currentUser?.sub || 'unknown'} attempted to modify role for user ${id}`,
      );
    }

    // SECURITY: Prevent users from modifying isActive status (only admins can)
    if (!isAdmin && updateData.isActive !== undefined) {
      delete updateData.isActive;
      this.logger.warn(
        `User ${currentUser?.sub || 'unknown'} attempted to modify isActive for user ${id}`,
      );
    }

    return this.prisma.users.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        address: true,
        dateOfBirth: true,
        gender: true,
        isActive: true,
        avatarUrl: true,
        emailNotifications: true,
        smsNotifications: true,
        promoNotifications: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string, currentUser?: { role?: string }) {
    // Check if current user is admin
    if (!currentUser || currentUser.role !== 'ADMIN') {
      throw new UnauthorizedException('Only admin users can delete users');
    }

    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Prevent deletion of admin users
    if (user.role === 'ADMIN') {
      throw new UnauthorizedException('Cannot delete admin user');
    }

    // Delete related records first to avoid foreign key constraints
    // Delete in order of dependencies

    // Delete orders first (they reference user)
    try {
      // Get all orders for this user
      const orders = await this.prisma.orders.findMany({
        where: { userId: id },
        select: { id: true },
      });

      // Delete order items for each order
      for (const order of orders) {
        await this.prisma.order_items.deleteMany({
          where: { orderId: order.id },
        });
      }

      // Delete orders
      await this.prisma.orders.deleteMany({
        where: { userId: id },
      });
    } catch (_error) {
      this.logger.warn('Error deleting orders, continuing...');
    }

    // Delete cart items and cart
    try {
      const cart = await this.prisma.carts.findFirst({
        where: { userId: id },
      });
      if (cart) {
        await this.prisma.cart_items.deleteMany({
          where: { cartId: cart.id },
        });
        await this.prisma.carts.delete({
          where: { id: cart.id },
        });
      }
    } catch (_error) {
      this.logger.warn('Error deleting cart, continuing...');
    }

    // Finally delete the user using transaction
    await this.prisma.$transaction(async tx => {
      await tx.users.delete({
        where: { id },
      });
    });
    return { message: 'User deleted successfully' };
  }

  async getStats() {
    const [totalUsers, newUsersThisMonth, activeUsers] = await Promise.all([
      this.prisma.users.count(),
      this.prisma.users.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      this.prisma.users.count({
        where: {
          orders: {
            some: {
              createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              },
            },
          },
        },
      }),
    ]);

    return {
      totalUsers,
      newUsersThisMonth,
      activeUsers,
      conversionRate: totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(2) : 0,
    };
  }

  async getActivityStats(days: number) {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const dailyStats = await this.prisma.users.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      _count: {
        id: true,
      },
    });

    return dailyStats.map(stat => ({
      date: stat.createdAt.toISOString().split('T')[0],
      newUsers: stat._count.id,
    }));
  }

  async updatePassword(userId: string, hashedPassword: string) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.users.update({
      where: { id: userId },
      data: { password: hashedPassword },
      select: {
        id: true,
        email: true,
        name: true,
        updatedAt: true,
      },
    });
  }

  private generateRandomPassword(): string {
    // SECURITY: Use cryptographically secure random for password generation
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    const passwordLength = 12;
    let password = '';

    // Use crypto.randomBytes for secure random generation
    const random = randomBytes(passwordLength);
    for (let i = 0; i < passwordLength; i++) {
      password += chars[random[i] % chars.length];
    }
    return password;
  }

  async exportUserData(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      include: {
        orders: {
          include: {
            order_items: {
              include: {
                products: {
                  select: {
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
        carts: {
          include: {
            cart_items: {
              include: {
                products: {
                  select: {
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Remove sensitive data
    const { password: _password, ...userData } = user;

    return {
      exportDate: new Date().toISOString(),
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        role: userData.role,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      },
      orders: (userData as any).orders.map((order: any) => ({
        id: order.id,
        status: order.status,
        totalCents: order.totalCents,
        createdAt: order.createdAt,
        items: order.order_items.map((item: any) => ({
          productName: item.products?.name,
          quantity: item.quantity,
          priceCents: item.price,
        })),
      })),
      cart:
        (userData as any).carts.length > 0
          ? {
              items: (userData as any).carts[0].cart_items.map((item: any) => ({
                productName: item.products?.name,
                quantity: item.quantity,
                addedAt: item.createdAt,
              })),
            }
          : null,
      statistics: {
        totalOrders: (userData as any).orders.length,
        totalSpent:
          (userData as any).orders.reduce(
            (sum: number, order: any) => sum + (order.totalCents || 0),
            0,
          ) / 100,
      },
    };
  }

  private async sendWelcomeEmail(email: string, name: string, password: string): Promise<void> {
    const subject = 'Chào mừng bạn đến với Audio Tài Lộc';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Chào mừng ${name}!</h2>
        <p>Tài khoản của bạn đã được tạo thành công trên hệ thống Audio Tài Lộc.</p>
        <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mật khẩu:</strong> ${password}</p>
        </div>
        <p style="color: #d32f2f;"><strong>Lưu ý:</strong> Vui lòng đổi mật khẩu sau khi đăng nhập lần đầu.</p>
        <p>Trân trọng,<br>Đội ngũ Audio Tài Lộc</p>
      </div>
    `;
    const text = `
      Chào mừng ${name}!

      Tài khoản của bạn đã được tạo thành công trên hệ thống Audio Tài Lộc.

      Email: ${email}
      Mật khẩu: ${password}

      Lưu ý: Vui lòng đổi mật khẩu sau khi đăng nhập lần đầu.

      Trân trọng,
      Đội ngũ Audio Tài Lộc
    `;

    await this.mailService.send(email, subject, text, html);
  }

  async setResetToken(userId: string, token: string, expiry: Date): Promise<void> {
    await this.prisma.users.update({
      where: { id: userId },
      data: {
        resetToken: token,
        resetExpires: expiry,
      },
    });
  }

  async findByResetToken(token: string) {
    return this.prisma.users.findFirst({
      where: {
        resetToken: token,
        resetExpires: {
          gt: new Date(),
        },
      },
    });
  }

  async updatePasswordAndClearResetToken(userId: string, passwordHash: string): Promise<void> {
    await this.prisma.users.update({
      where: { id: userId },
      data: {
        password: passwordHash,
        resetToken: null,
        resetExpires: null,
      },
    });
  }
}
