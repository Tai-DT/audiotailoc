"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const bcrypt = __importStar(require("bcryptjs"));
let UsersService = UsersService_1 = class UsersService {
    constructor(prisma, mailService) {
        this.prisma = prisma;
        this.mailService = mailService;
        this.logger = new common_1.Logger(UsersService_1.name);
    }
    async findByEmail(email) {
        return this.prisma.users.findUnique({ where: { email } });
    }
    async findById(id) {
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
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findByIdForAuth(id) {
        return this.prisma.users.findUnique({ where: { id } });
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
    async create(createUserDto) {
        const existingUser = await this.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new common_1.BadRequestException('Email already exists');
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
        const hashedPassword = await bcrypt.hash(password, 12);
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
            throw new common_1.BadRequestException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(params.password, 12);
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
    async update(id, updateUserDto) {
        const user = await this.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const data = { ...updateUserDto };
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
    async setResetToken(userId, hashedToken, expiresAt) {
        await this.prisma.users.update({
            where: { id: userId },
            data: {
                resetToken: hashedToken,
                resetExpires: expiresAt,
            },
        });
    }
    async findByResetToken(hashedToken) {
        return this.prisma.users.findFirst({
            where: {
                resetToken: hashedToken,
                resetExpires: { gt: new Date() },
            },
        });
    }
    async completePasswordReset(userId, hashedPassword) {
        return this.prisma.users.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetExpires: null,
            },
        });
    }
    generateRandomPassword() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService])
], UsersService);
//# sourceMappingURL=users.service.js.map