import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../notifications/mail.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) { }

  async findByEmail(email: string) {
    return this.prisma.users.findUnique({ where: { email } });
  }

  async findById(id: string) {
    const user = await this.prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
        address: true,
        dateOfBirth: true,
        gender: true,
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

  async findByIdForAuth(id: string) {
    return this.prisma.users.findUnique({ where: { id } });
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
    const where: any = {};

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
    const orderBy: any = {};
    const sortField = params.sortBy || 'createdAt';
    const sortOrder = params.sortOrder || 'desc';

    if (['name', 'email', 'role', 'createdAt'].includes(sortField)) {
      orderBy[sortField] = sortOrder;
    } else {
      orderBy.createdAt = 'desc';
    }

    const [users, total] = await Promise.all([
      this.prisma.users.findMany({
        skip,
        take: params.limit,
        where,
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          avatarUrl: true,
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
      items: users,
      total,
      page: params.page,
      limit: params.limit,
      pages: Math.ceil(total / params.limit),
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
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
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

    const hashedPassword = await bcrypt.hash(password, 12);

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
    const existingUser = await this.findByEmail(params.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(params.password, 12);
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
      dateOfBirth?: string;
      gender?: string;
    },
  ) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const data: any = { ...updateUserDto };
    if (data.dateOfBirth) {
      data.dateOfBirth = new Date(data.dateOfBirth);
    }

    return this.prisma.users.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        address: true,
        dateOfBirth: true,
        gender: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string, currentUser?: any) {
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
      console.log('Error deleting orders, continuing...');
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
      console.log('Error deleting cart, continuing...');
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

  async setResetToken(userId: string, hashedToken: string, expiresAt: Date) {
    await this.prisma.users.update({
      where: { id: userId },
      data: {
        resetToken: hashedToken,
        resetExpires: expiresAt,
      },
    });
  }

  async findByResetToken(hashedToken: string) {
    return this.prisma.users.findFirst({
      where: {
        resetToken: hashedToken,
        resetExpires: { gt: new Date() },
      },
    });
  }

  async completePasswordReset(userId: string, hashedPassword: string) {
    return this.prisma.users.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetExpires: null,
      },
    });
  }

  private generateRandomPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
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
    const { password: _, ...userData } = user;

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
}
