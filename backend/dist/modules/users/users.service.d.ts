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
        createdAt: Date;
        updatedAt: Date;
    }>;
    findById(id: string): Promise<{
        orders: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            orderNo: string;
            userId: string;
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
        id: string;
        email: string;
        password: string;
        name: string | null;
        phone: string | null;
        role: string;
        createdAt: Date;
        updatedAt: Date;
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
        id: string;
        email: string;
        password: string;
        name: string | null;
        phone: string | null;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateUserDto: {
        name?: string;
        phone?: string;
        role?: 'USER' | 'ADMIN';
    }): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string;
        role: string;
        updatedAt: Date;
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
    private sendWelcomeEmail;
}
