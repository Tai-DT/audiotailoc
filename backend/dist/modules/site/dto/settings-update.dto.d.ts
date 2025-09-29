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
export declare class UpdateSettingsDto {
    general?: SiteGeneralDto;
    about?: SiteAboutDto;
    socials?: SiteSocialsDto;
}
