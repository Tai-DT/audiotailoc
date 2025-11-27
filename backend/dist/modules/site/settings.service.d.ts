import { PrismaService } from '../../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/settings-update.dto';
import { MailService } from '../notifications/mail.service';
export declare class SettingsService {
    private prisma;
    private mailService;
    constructor(prisma: PrismaService, mailService: MailService);
    sendTestEmail(to: string, config?: {
        host: string;
        port: number;
        user: string;
        pass: string;
        from?: string;
    }): any;
    getSettings(): Promise<Record<string, any>>;
    getSection(section: string): Promise<any>;
    updateSettings(data: UpdateSettingsDto): Promise<Record<string, any>>;
}
