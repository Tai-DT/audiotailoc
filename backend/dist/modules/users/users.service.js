"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
const mail_service_1 = require("../notifications/mail.service");
const security_service_1 = require("../security/security.service");
let UsersService = UsersService_1 = class UsersService {
    constructor(prisma, mailService, securityService) {
        this.prisma = prisma;
        this.mailService = mailService;
        this.securityService = securityService;
        this.logger = new common_1.Logger(UsersService_1.name);
    }
    async findByEmail(email) {
        return this.prisma.users.findUnique({ where: { email } });
    }
    async findById(id) {
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
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findAll(params) {
        const skip = (params.page - 1) * params.limit;
        const where = {};
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
            if (params.status === 'active') {
                where.id = { not: null };
            }
            else if (params.status === 'inactive') {
                where.id = null;
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
        const orderBy = {};
        const sortField = params.sortBy || 'createdAt';
        const sortOrder = params.sortOrder || 'desc';
        if (['name', 'email', 'role', 'createdAt'].includes(sortField)) {
            orderBy[sortField] = sortOrder;
        }
        else {
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
    async create(createUserDto) {
        const existingUser = await this.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new common_1.BadRequestException('Unable to create account. Please try again or contact support.');
        }
        let password = createUserDto.password;
        let generatedPassword = false;
        if (createUserDto.generatePassword || !createUserDto.password) {
            password = this.generateRandomPassword();
            generatedPassword = true;
        }
        if (!password) {
            throw new common_1.BadRequestException('Password is required');
        }
        const hashedPassword = await this.securityService.hashPassword(password);
        const user = await this.prisma.users.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
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
        if (generatedPassword) {
            try {
                await this.sendWelcomeEmail(user.email, user.name || 'User', password);
            }
            catch (_error) {
                this.logger.error(`Failed to send welcome email to ${user.email}:`, _error);
            }
        }
        return user;
    }
    async createUser(params) {
        const existingUser = await this.findByEmail(params.email);
        if (existingUser) {
            throw new common_1.BadRequestException('Unable to create account. Please try again or contact support.');
        }
        const hashedPassword = await this.securityService.hashPassword(params.password);
        return this.prisma.users.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
                email: params.email,
                password: hashedPassword,
                name: params.name ?? '',
                updatedAt: new Date(),
            },
        });
    }
    async update(id, updateUserDto, currentUser) {
        const user = await this.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.email === process.env.ADMIN_EMAIL;
        const updateData = { ...updateUserDto };
        if (!isAdmin && updateData.role !== undefined) {
            delete updateData.role;
            this.logger.warn(`User ${currentUser?.sub || 'unknown'} attempted to modify role for user ${id}`);
        }
        if (!isAdmin && updateData.isActive !== undefined) {
            delete updateData.isActive;
            this.logger.warn(`User ${currentUser?.sub || 'unknown'} attempted to modify isActive for user ${id}`);
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
    async remove(id, currentUser) {
        if (!currentUser || currentUser.role !== 'ADMIN') {
            throw new common_1.UnauthorizedException('Only admin users can delete users');
        }
        const user = await this.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.role === 'ADMIN') {
            throw new common_1.UnauthorizedException('Cannot delete admin user');
        }
        try {
            const orders = await this.prisma.orders.findMany({
                where: { userId: id },
                select: { id: true },
            });
            for (const order of orders) {
                await this.prisma.order_items.deleteMany({
                    where: { orderId: order.id },
                });
            }
            await this.prisma.orders.deleteMany({
                where: { userId: id },
            });
        }
        catch (_error) {
            console.log('Error deleting orders, continuing...');
        }
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
        }
        catch (_error) {
            console.log('Error deleting cart, continuing...');
        }
        await this.prisma.$transaction(async (tx) => {
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
    async getActivityStats(days) {
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
    async updatePassword(userId, hashedPassword) {
        const user = await this.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
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
    generateRandomPassword() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        const passwordLength = 12;
        let password = '';
        const random = (0, crypto_1.randomBytes)(passwordLength);
        for (let i = 0; i < passwordLength; i++) {
            password += chars[random[i] % chars.length];
        }
        return password;
    }
    async exportUserData(userId) {
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
            throw new common_1.NotFoundException('User not found');
        }
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
            orders: userData.orders.map((order) => ({
                id: order.id,
                status: order.status,
                totalCents: order.totalCents,
                createdAt: order.createdAt,
                items: order.order_items.map((item) => ({
                    productName: item.products?.name,
                    quantity: item.quantity,
                    priceCents: item.price,
                })),
            })),
            cart: userData.carts.length > 0
                ? {
                    items: userData.carts[0].cart_items.map((item) => ({
                        productName: item.products?.name,
                        quantity: item.quantity,
                        addedAt: item.createdAt,
                    })),
                }
                : null,
            statistics: {
                totalOrders: userData.orders.length,
                totalSpent: userData.orders.reduce((sum, order) => sum + (order.totalCents || 0), 0) / 100,
            },
        };
    }
    async sendWelcomeEmail(email, name, password) {
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
    async setResetToken(userId, token, expiry) {
        await this.prisma.users.update({
            where: { id: userId },
            data: {
                resetToken: token,
                resetExpires: expiry,
            },
        });
    }
    async findByResetToken(token) {
        return this.prisma.users.findFirst({
            where: {
                resetToken: token,
                resetExpires: {
                    gt: new Date(),
                },
            },
        });
    }
    async updatePasswordAndClearResetToken(userId, passwordHash) {
        await this.prisma.users.update({
            where: { id: userId },
            data: {
                password: passwordHash,
                resetToken: null,
                resetExpires: null,
            },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService,
        security_service_1.SecurityService])
], UsersService);
//# sourceMappingURL=users.service.js.map