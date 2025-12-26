import { UsersService } from './users.service';
declare class CreateUserDto {
    email: string;
    password?: string;
    name: string;
    phone?: string;
    role?: 'USER' | 'ADMIN';
    generatePassword?: boolean;
    address?: string;
    dateOfBirth?: string;
    gender?: string;
    isActive?: boolean;
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    promoNotifications?: boolean;
}
declare class UpdateUserDto {
    name?: string;
    phone?: string;
    role?: 'USER' | 'ADMIN';
    address?: string;
    dateOfBirth?: string;
    gender?: string;
    isActive?: boolean;
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    promoNotifications?: boolean;
}
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(page?: string, limit?: string, search?: string, role?: string, status?: string, startDate?: string, endDate?: string, sortBy?: string, sortOrder?: string): Promise<{
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
    getProfile(req: any): Promise<{
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
    exportUserData(req: any): Promise<{
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
    findOne(id: string, req: any): Promise<{
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
    create(createUserDto: CreateUserDto): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string;
        role: string;
        createdAt: Date;
    }>;
    update(id: string, updateUserDto: UpdateUserDto, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
    getStats(): Promise<{
        totalUsers: number;
        newUsersThisMonth: number;
        activeUsers: number;
        conversionRate: string | number;
    }>;
    getActivityStats(days?: string): Promise<{
        date: string;
        newUsers: number;
    }[]>;
}
export {};
