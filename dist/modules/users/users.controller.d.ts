import { UsersService } from './users.service';
declare class CreateUserDto {
    email: string;
    password?: string;
    name: string;
    phone?: string;
    role?: 'USER' | 'ADMIN' | 'DISABLED';
    generatePassword?: boolean;
}
declare class UpdateUserDto {
    name?: string;
    phone?: string;
    role?: 'USER' | 'ADMIN' | 'DISABLED';
}
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(page?: string, limit?: string, search?: string, role?: string, status?: string, startDate?: string, endDate?: string, sortBy?: string, sortOrder?: string): Promise<{
        users: {
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
            userId: string;
            subtotalCents: number;
            discountCents: number;
            shippingCents: number;
            totalCents: number;
            shippingAddress: string;
            shippingCoordinates: string;
            promotionCode: string;
        }[];
        _count: {
            orders: number;
        };
    } & {
        id: string;
        email: string;
        password: string;
        name: string;
        phone: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findOne(id: string): Promise<{
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
            shippingAddress: string;
            shippingCoordinates: string;
            promotionCode: string;
        }[];
        _count: {
            orders: number;
        };
    } & {
        id: string;
        email: string;
        password: string;
        name: string;
        phone: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(createUserDto: CreateUserDto): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string;
        role: string;
        createdAt: Date;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string;
        role: string;
        updatedAt: Date;
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
