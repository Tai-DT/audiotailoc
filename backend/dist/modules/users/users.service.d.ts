import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../notifications/mail.service';
import { SecurityService } from '../security/security.service';
export declare class UsersService {
    private readonly prisma;
    private readonly mailService;
    private readonly securityService;
    private readonly logger;
    constructor(prisma: PrismaService, mailService: MailService, securityService: SecurityService);
    findByEmail(email: string): Promise<{
        password: string;
        id: string;
        email: string;
        name: string | null;
        phone: string | null;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        avatarUrl: string | null;
        address: string | null;
        dateOfBirth: Date | null;
        gender: string | null;
        isActive: boolean;
        emailNotifications: boolean;
        smsNotifications: boolean;
        promoNotifications: boolean;
        resetExpires: Date | null;
        resetToken: string | null;
    }>;
    findById(id: string): Promise<{
        orders: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            orderNo: string;
            userId: string | null;
            subtotalCents: number;
            discountCents: number;
            shippingCents: number;
            totalCents: number;
            shippingAddress: string | null;
            shippingCoordinates: string | null;
            promotionCode: string | null;
        }[];
        _count: {
            orders: number;
        };
    } & {
        password: string;
        id: string;
        email: string;
        name: string | null;
        phone: string | null;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        avatarUrl: string | null;
        address: string | null;
        dateOfBirth: Date | null;
        gender: string | null;
        isActive: boolean;
        emailNotifications: boolean;
        smsNotifications: boolean;
        promoNotifications: boolean;
        resetExpires: Date | null;
        resetToken: string | null;
    }>;
    findAll(params: {
        page: number;
        limit: number;
        search?: string;
        role?: string;
        status?: string;
        startDate?: string;
        endDate?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        users: {
            orders: {
                totalCents: number;
            }[];
            id: string;
            email: string;
            name: string;
            phone: string;
            role: string;
            createdAt: Date;
            _count: {
                orders: number;
            };
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    create(createUserDto: {
        email: string;
        password?: string;
        name: string;
        phone?: string;
        role?: 'USER' | 'ADMIN';
        generatePassword?: boolean;
    }): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string;
        role: string;
        createdAt: Date;
    }>;
    createUser(params: {
        email: string;
        password: string;
        name?: string | null;
    }): Promise<{
        password: string;
        id: string;
        email: string;
        name: string | null;
        phone: string | null;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        avatarUrl: string | null;
        address: string | null;
        dateOfBirth: Date | null;
        gender: string | null;
        isActive: boolean;
        emailNotifications: boolean;
        smsNotifications: boolean;
        promoNotifications: boolean;
        resetExpires: Date | null;
        resetToken: string | null;
    }>;
    update(id: string, updateUserDto: {
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
    }, currentUser?: any): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string;
        role: string;
        updatedAt: Date;
        avatarUrl: string;
        address: string;
        dateOfBirth: Date;
        gender: string;
        isActive: boolean;
        emailNotifications: boolean;
        smsNotifications: boolean;
        promoNotifications: boolean;
    }>;
    remove(id: string, currentUser?: any): Promise<{
        message: string;
    }>;
    getStats(): Promise<{
        totalUsers: number;
        newUsersThisMonth: number;
        activeUsers: number;
        conversionRate: string | number;
    }>;
    getActivityStats(days: number): Promise<{
        date: string;
        newUsers: number;
    }[]>;
    updatePassword(userId: string, hashedPassword: string): Promise<{
        id: string;
        email: string;
        name: string;
        updatedAt: Date;
    }>;
    private generateRandomPassword;
    exportUserData(userId: string): Promise<{
        exportDate: string;
        user: {
            id: string;
            email: string;
            name: string;
            phone: string;
            role: string;
            createdAt: Date;
            updatedAt: Date;
        };
        orders: any;
        cart: {
            items: any;
        };
        statistics: {
            totalOrders: any;
            totalSpent: number;
        };
    }>;
    private sendWelcomeEmail;
    setResetToken(userId: string, token: string, expiry: Date): Promise<void>;
    findByResetToken(token: string): Promise<{
        password: string;
        id: string;
        email: string;
        name: string | null;
        phone: string | null;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        avatarUrl: string | null;
        address: string | null;
        dateOfBirth: Date | null;
        gender: string | null;
        isActive: boolean;
        emailNotifications: boolean;
        smsNotifications: boolean;
        promoNotifications: boolean;
        resetExpires: Date | null;
        resetToken: string | null;
    }>;
    updatePasswordAndClearResetToken(userId: string, passwordHash: string): Promise<void>;
}
