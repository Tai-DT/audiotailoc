import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../notifications/mail.service';
export declare class UsersService {
    private readonly prisma;
    private readonly mailService;
    private readonly logger;
    constructor(prisma: PrismaService, mailService: MailService);
    findByEmail(email: string): Promise<{
        id: string;
        email: string;
        password: string;
        name: string | null;
        phone: string | null;
        role: string;
        avatarUrl: string | null;
        resetToken: string | null;
        resetExpires: Date | null;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        dateOfBirth: Date | null;
        gender: string | null;
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
            shippingName: string | null;
            shippingPhone: string | null;
            shippingCoordinates: string | null;
            shippingNotes: string | null;
            promotionCode: string | null;
            isDeleted: boolean;
            deletedAt: Date | null;
        }[];
        id: string;
        email: string;
        name: string;
        phone: string;
        role: string;
        avatarUrl: string;
        createdAt: Date;
        updatedAt: Date;
        address: string;
        dateOfBirth: Date;
        gender: string;
        _count: {
            orders: number;
        };
    }>;
    findByIdForAuth(id: string): Promise<{
        id: string;
        email: string;
        password: string;
        name: string | null;
        phone: string | null;
        role: string;
        avatarUrl: string | null;
        resetToken: string | null;
        resetExpires: Date | null;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        dateOfBirth: Date | null;
        gender: string | null;
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
        items: {
            orders: {
                totalCents: number;
            }[];
            id: string;
            email: string;
            name: string;
            phone: string;
            role: string;
            avatarUrl: string;
            createdAt: Date;
            _count: {
                orders: number;
            };
        }[];
        total: number;
        page: number;
        limit: number;
        pages: number;
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
        id: string;
        email: string;
        password: string;
        name: string | null;
        phone: string | null;
        role: string;
        avatarUrl: string | null;
        resetToken: string | null;
        resetExpires: Date | null;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        dateOfBirth: Date | null;
        gender: string | null;
    }>;
    update(id: string, updateUserDto: {
        name?: string;
        phone?: string;
        role?: 'USER' | 'ADMIN';
        address?: string;
        dateOfBirth?: string;
        gender?: string;
    }): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string;
        role: string;
        updatedAt: Date;
        address: string;
        dateOfBirth: Date;
        gender: string;
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
    setResetToken(userId: string, hashedToken: string, expiresAt: Date): Promise<void>;
    findByResetToken(hashedToken: string): Promise<{
        id: string;
        email: string;
        password: string;
        name: string | null;
        phone: string | null;
        role: string;
        avatarUrl: string | null;
        resetToken: string | null;
        resetExpires: Date | null;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        dateOfBirth: Date | null;
        gender: string | null;
    }>;
    completePasswordReset(userId: string, hashedPassword: string): Promise<{
        id: string;
        email: string;
        password: string;
        name: string | null;
        phone: string | null;
        role: string;
        avatarUrl: string | null;
        resetToken: string | null;
        resetExpires: Date | null;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        dateOfBirth: Date | null;
        gender: string | null;
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
}
