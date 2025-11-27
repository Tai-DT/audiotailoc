import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/settings-update.dto';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getSettings(): Promise<Record<string, any>>;
    getSection(section: string): Promise<any>;
    updateSettings(data: UpdateSettingsDto): Promise<Record<string, any>>;
    sendTestEmail(body: {
        email: string;
        config?: any;
    }): Promise<any>;
}
