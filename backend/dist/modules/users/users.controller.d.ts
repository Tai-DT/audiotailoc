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
}
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(page?: string, limit?: string, search?: string, role?: string, status?: string, startDate?: string, endDate?: string, sortBy?: string, sortOrder?: string): unknown;
    getProfile(req: any): unknown;
    findOne(id: string): unknown;
    create(createUserDto: CreateUserDto): unknown;
    update(id: string, updateUserDto: UpdateUserDto): unknown;
    remove(id: string, req: any): unknown;
    getStats(): unknown;
    getActivityStats(days?: string): unknown;
}
export {};
