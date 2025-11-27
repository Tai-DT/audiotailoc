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
export declare class SiteBusinessDto {
    taxCode?: string;
    businessLicense?: string;
    currency?: string;
    timezone?: string;
}
export declare class SiteEmailDto {
    emailHost?: string;
    emailPort?: string;
    emailUsername?: string;
    emailPassword?: string;
    emailFrom?: string;
}
export declare class SiteNotificationsDto {
    orderNotification?: boolean;
    paymentNotification?: boolean;
    reviewNotification?: boolean;
    lowStockNotification?: boolean;
}
export declare class SiteSecurityDto {
    twoFactorAuth?: boolean;
    sessionTimeout?: number;
    passwordExpiry?: number;
    maxLoginAttempts?: number;
}
export declare class UpdateSettingsDto {
    general?: SiteGeneralDto;
    about?: SiteAboutDto;
    socials?: SiteSocialsDto;
    business?: SiteBusinessDto;
    email?: SiteEmailDto;
    notifications?: SiteNotificationsDto;
    security?: SiteSecurityDto;
}
