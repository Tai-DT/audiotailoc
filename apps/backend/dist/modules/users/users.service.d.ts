import { PrismaService } from '../../prisma/prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<{
        id: string;
        email: string;
        password: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    createUser(params: {
        email: string;
        password: string;
        name?: string | null;
    }): Promise<{
        id: string;
        email: string;
        password: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
