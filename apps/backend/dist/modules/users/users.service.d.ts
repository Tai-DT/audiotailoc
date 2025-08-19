import { PrismaService } from '../../prisma/prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<{
        name: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
    } | null>;
    findById(id: string): Promise<{
        name: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
    } | null>;
    createUser(params: {
        email: string;
        password: string;
        name?: string | null;
    }): Promise<{
        name: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
    }>;
}
