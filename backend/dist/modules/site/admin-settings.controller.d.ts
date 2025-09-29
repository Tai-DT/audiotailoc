import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/settings-update.dto';
export declare class AdminSettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getSettings(): unknown;
    updateSettings(data: UpdateSettingsDto): unknown;
}
