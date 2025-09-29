import { PrismaService } from '../../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/settings-update.dto';
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    getSettings(): unknown;
    getSection(section: string): unknown;
    updateSettings(data: UpdateSettingsDto): unknown;
}
