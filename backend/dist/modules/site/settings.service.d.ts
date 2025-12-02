import { PrismaService } from '../../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/settings-update.dto';
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    getSettings(): Promise<Record<string, any>>;
    getSection(section: string): Promise<any>;
    updateSettings(data: UpdateSettingsDto): Promise<Record<string, any>>;
}
