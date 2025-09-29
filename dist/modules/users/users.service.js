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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = __importStar(require("bcryptjs"));
const crypto_1 = require("crypto");
let UsersService = UsersService_1 = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
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
                    orderBy: { createdAt: 'desc' }
                },
                _count: {
                    select: {
                        orders: true,
                    }
                }
            }
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
                { phone: { contains: params.search } }
            ];
        }
        if (params.role) {
            where.role = params.role;
        }
        if (params.status) {
            if (params.status === 'active') {
                where.role = { not: 'DISABLED' };
            }
            else if (params.status === 'inactive') {
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
    async create(createUserDto) {
        const existingUser = await this.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new common_1.BadRequestException('Email already exists');
        }
        let password = createUserDto.password;
        let generatedPassword = false;
        if (createUserDto.generatePassword || !password) {
            password = this.generateRandomPassword();
            generatedPassword = true;
        }
        if (!generatedPassword && password) {
            this.validatePassword(password);
        }
        if (!password) {
            throw new common_1.BadRequestException('Password is required');
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
        return user;
    }
    async createUser(params) {
        const existingUser = await this.findByEmail(params.email);
        if (existingUser) {
            throw new common_1.BadRequestException('Email already exists');
        }
        if (!params.password) {
            throw new common_1.BadRequestException('Password is required for createUser');
        }
        this.validatePassword(params.password);
        const hashedPassword = await bcrypt.hash(params.password, 12);
        return this.prisma.users.create({
            data: { email: params.email, password: hashedPassword, name: params.name ?? "" },
        });
    }
    async update(id, updateUserDto) {
        const user = await this.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
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
                select: { id: true }
            });
            for (const order of orders) {
                await this.prisma.order_items.deleteMany({
                    where: { orderId: order.id }
                });
            }
            await this.prisma.orders.deleteMany({
                where: { userId: id }
            });
        }
        catch (error) {
            console.log('Error deleting orders, continuing...');
        }
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
        }
        catch (error) {
            console.log('Error deleting cart, continuing...');
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.users.delete({
                where: { id }
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
    async getActivityStats(days) {
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
                updatedAt: true
            }
        });
    }
    generateRandomPassword() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:,.<>?';
        const bytes = (0, crypto_1.randomBytes)(16);
        const passwordChars = [];
        for (let i = 0; i < 12; i++) {
            const idx = bytes[i] % chars.length;
            passwordChars.push(chars.charAt(idx));
        }
        return passwordChars.join('');
    }
    validatePassword(password) {
        const minLength = 8;
        if (password.length < minLength) {
            throw new common_1.BadRequestException(`Password must be at least ${minLength} characters long`);
        }
        const blacklist = new Set(['password', '123456', '12345678', 'qwerty', 'admin', 'letmein', '111111', 'iloveyou']);
        if (blacklist.has(password.toLowerCase().trim())) {
            throw new common_1.BadRequestException('Provided password is too common or insecure');
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map