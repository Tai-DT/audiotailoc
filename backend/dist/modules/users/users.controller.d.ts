import { UsersService } from './users.service';
declare class CreateUserDto {
    email: string;
    password?: string;
    name: string;
    phone?: string;
    role?: 'USER' | 'ADMIN';
    generatePassword?: boolean;
}
declare class UpdateUserDto {
    name?: string;
    phone?: string;
    role?: 'USER' | 'ADMIN';
    address?: string;
    dateOfBirth?: string;
    gender?: string;
}
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(page?: string, limit?: string, search?: string, role?: string, status?: string, startDate?: string, endDate?: string, sortBy?: string, sortOrder?: string): Promise<{
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
    updateProfile(req: any, updateUserDto: UpdateUserDto): Promise<{
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
    findOne(id: string): Promise<{
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
        address: string;
        dateOfBirth: Date;
        gender: string;
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
