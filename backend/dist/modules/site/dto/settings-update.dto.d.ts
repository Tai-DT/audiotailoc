export declare class SiteGeneralDto {
    siteName?: string;
    tagline?: string;
    logoUrl?: string;
    primaryEmail?: string;
    primaryPhone?: string;
    address?: string;
    workingHours?: string;
}
export declare class SiteAboutDto {
    title?: string;
    summary?: string;
    contentHtml?: string;
    heroImageUrl?: string;
}
export declare class SiteSocialsDto {
    facebook?: string;
    youtube?: string;
    tiktok?: string;
    instagram?: string;
    zalo?: string;
    github?: string;
}
export declare class StoreSettingsDto {
    storeName?: string;
    storeEmail?: string;
    storePhone?: string;
    storeAddress?: string;
    storeLogo?: string;
}
export declare class BusinessSettingsDto {
    taxCode?: string;
    businessLicense?: string;
    currency?: string;
    timezone?: string;
}
export declare class EmailSettingsDto {
    emailHost?: string;
    emailPort?: string;
    emailUsername?: string;
    emailPassword?: string;
    emailFrom?: string;
}
export declare class NotificationSettingsDto {
    orderNotification?: boolean;
    paymentNotification?: boolean;
    reviewNotification?: boolean;
    lowStockNotification?: boolean;
}
export declare class SecuritySettingsDto {
    twoFactorAuth?: boolean;
    sessionTimeout?: number;
    passwordExpiry?: number;
    maxLoginAttempts?: number;
}
export declare class UpdateSettingsDto {
    general?: SiteGeneralDto;
    about?: SiteAboutDto;
    socials?: SiteSocialsDto;
    store?: StoreSettingsDto;
    business?: BusinessSettingsDto;
    email?: EmailSettingsDto;
    notifications?: NotificationSettingsDto;
    security?: SecuritySettingsDto;
}
