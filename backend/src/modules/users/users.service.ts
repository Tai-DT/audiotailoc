import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ 
      where: { id },
      include: {
        orders: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            orders: true,
            reviews: true,
            wishlistItems: true
          }
        }
      }
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }

  async findAll(params: { page: number; limit: number }) {
    const skip = (params.page - 1) * params.limit;
    
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: params.limit,
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              orders: true,
              reviews: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.user.count()
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

  async create(createUserDto: { email: string; password: string; name: string; phone?: string; role?: 'USER' | 'ADMIN' }) {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
    
    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        name: createUserDto.name,
        phone: createUserDto.phone,
        role: createUserDto.role || 'USER'
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
  }

  // Backward-compatible alias
  async createUser(params: { email: string; password: string; name?: string | null }) {
    return this.prisma.user.create({ data: { email: params.email, password: params.password, name: params.name ?? '' } });
  }

  async update(id: string, updateUserDto: { name?: string; phone?: string; role?: 'USER' | 'ADMIN' }) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
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

  async remove(id: string) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }

  async getStats() {
    const [totalUsers, newUsersThisMonth, activeUsers] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      this.prisma.user.count({
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
    
    const dailyStats = await this.prisma.user.groupBy({
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
}









