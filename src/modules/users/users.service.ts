import { Injectable, NotFoundException, BadRequestException, UnauthorizedException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) { }

  async findByEmail(email: string) {
    return this.prisma.users.findUnique({ where: { email } });
  }

  async findById(id: string) {
    const user = await this.prisma.users.findUnique({
      where: { id },
      include: {
        orders: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            orders: true,
            // reviews: true, // Field not available in SQLite schema
            // wishlistItems: true // Field not available in SQLite schema
          }
        }
      }
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
    const where: any = {};

    if (params.search) {
      where.OR = [
        { email: { contains: params.search, mode: 'insensitive' } },
        { name: { contains: params.search, mode: 'insensitive' } },
        { phone: { contains: params.search } }
      ];
    }

    if (params.role) {
      where.role = params.role;
    }

    if (params.status) {
      if (params.status === 'active') {
        where.role = { not: 'DISABLED' };
      } else if (params.status === 'inactive') {
        where.role = 'DISABLED';
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
          createdAt: true,
          _count: {
            select: {
              orders: true
            }
          }
        },
        orderBy
      }),
      this.prisma.users.count({ where })
    ]);

    return {
      users,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        pages: Math.ceil(total / params.limit)
      }
    };
  }

  async create(createUserDto: { email: string; password?: string; name: string; phone?: string; role?: 'USER' | 'ADMIN' | 'DISABLED'; generatePassword?: boolean }) {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Do not initialize password to an empty string (security risk).
    // Use undefined when no password provided so we can explicitly detect missing passwords.
    let password: string | undefined = createUserDto.password;
    let generatedPassword = false;

    // Generate password if requested or if no password provided
    if (createUserDto.generatePassword || !password) {
      password = this.generateRandomPassword();
      generatedPassword = true;
    }

    // If the caller supplied a password (not one we generated), validate its strength.
    if (!generatedPassword && password) {
      this.validatePassword(password);
    }

    if (!password) {
      throw new BadRequestException('Password is required');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.prisma.users.create({
      data: {
        id: crypto.randomUUID(),
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
        createdAt: true
      }
    });

    // Note: do NOT return the plain password here. Controller should handle sending credentials securely.
    return user;
  }

  // Backward-compatible alias
  async createUser(params: { email: string; password: string; name?: string | null }) {
    const existingUser = await this.findByEmail(params.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Require a non-empty password for this alias to avoid creating accounts with missing credentials.
    if (!params.password) {
      throw new BadRequestException('Password is required for createUser');
    }

    // Validate provided password to avoid accepting common/weak hardcoded passwords.
    this.validatePassword(params.password);

    const hashedPassword = await bcrypt.hash(params.password, 12);
    return this.prisma.users.create({
      data: { email: params.email, password: hashedPassword, name: params.name ?? "" } as any,
    });  }

  async update(id: string, updateUserDto: { name?: string; phone?: string; role?: 'USER' | 'ADMIN' | 'DISABLED' }) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.users.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        updatedAt: true
      }
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
        select: { id: true }
      });

      // Delete order items for each order
      for (const order of orders) {
        await this.prisma.order_items.deleteMany({
          where: { orderId: order.id }
        });
      }

      // Delete orders
      await this.prisma.orders.deleteMany({
        where: { userId: id }
      });
    } catch (error) {
      console.log('Error deleting orders, continuing...');
    }

    // Delete cart items and cart
    try {
      const cart = await this.prisma.carts.findFirst({
        where: { userId: id }
      });
      if (cart) {
        await this.prisma.cart_items.deleteMany({
          where: { cartId: cart.id }
        });
        await this.prisma.carts.delete({
          where: { id: cart.id }
        });
      }
    } catch (error) {
      console.log('Error deleting cart, continuing...');
    }

    // Finally delete the user using transaction
    await this.prisma.$transaction(async (tx) => {
      await tx.users.delete({
        where: { id }
      });
    }); return { message: 'User deleted successfully' };
  }

  async getStats() {
    const [totalUsers, newUsersThisMonth, activeUsers] = await Promise.all([
      this.prisma.users.count(),
      this.prisma.users.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      this.prisma.users.count({
        where: {
          orders: {
            some: {
              createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              }
            }
          }
        }
      })
    ]);

    return {
      totalUsers,
      newUsersThisMonth,
      activeUsers,
      conversionRate: totalUsers > 0 ? (activeUsers / totalUsers * 100).toFixed(2) : 0
    };
  }

  async getActivityStats(days: number) {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const dailyStats = await this.prisma.users.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: startDate
        }
      },
      _count: {
        id: true
      }
    });

    return dailyStats.map(stat => ({
      date: stat.createdAt.toISOString().split('T')[0],
      newUsers: stat._count.id
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
        updatedAt: true
      }
    });
  }

  private generateRandomPassword(): string {
    // Secure random password generation using crypto.randomBytes
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:,.<>?';
    const bytes = randomBytes(16); // 16 bytes -> 128 bits of randomness
    const passwordChars = [];
    for (let i = 0; i < 12; i++) {
      // Map each byte to a char index in a uniform way
      const idx = bytes[i] % chars.length;
      passwordChars.push(chars.charAt(idx));
    }
    return passwordChars.join('');
  }

  // New helper: validate password strength / reject common hardcoded passwords
  private validatePassword(password: string) {
    const minLength = 8;
    if (password.length < minLength) {
      throw new BadRequestException(`Password must be at least ${minLength} characters long`);
    }

    // Minimal blacklist of common insecure passwords (case-insensitive)
    const blacklist = new Set(['password', '123456', '12345678', 'qwerty', 'admin', 'letmein', '111111', 'iloveyou']);
    if (blacklist.has(password.toLowerCase().trim())) {
      throw new BadRequestException('Provided password is too common or insecure');
    }

    // Optionally add more checks (digits, letters, special chars) if desired.
  }

}





