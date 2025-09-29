import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../notifications/mail.service';
export declare class UsersService {
    private readonly prisma;
    private readonly mailService;
    private readonly logger;
    constructor(prisma: PrismaService, mailService: MailService);
    findByEmail(email: string): unknown;
    findById(id: string): unknown;
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
    }): unknown;
    create(createUserDto: {
        email: string;
        password?: string;
        name: string;
        phone?: string;
        role?: 'USER' | 'ADMIN';
        generatePassword?: boolean;
    }): unknown;
    createUser(params: {
        email: string;
        password: string;
        name?: string | null;
    }): unknown;
    update(id: string, updateUserDto: {
        name?: string;
        phone?: string;
        role?: 'USER' | 'ADMIN';
    }): unknown;
    remove(id: string, currentUser?: any): unknown;
    getStats(): unknown;
    getActivityStats(days: number): unknown;
    updatePassword(userId: string, hashedPassword: string): unknown;
    private generateRandomPassword;
    private sendWelcomeEmail;
}
