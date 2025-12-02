export interface SiteGeneral {
  siteName: string;
  tagline: string;
  logoUrl?: string;
  primaryEmail: string;
  primaryPhone: string;
  address?: string;
  workingHours?: string;
}

export interface SiteAbout {
  title: string;
  summary: string;
  contentHtml: string;
  heroImageUrl?: string;
}

export interface SiteSocials {
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  instagram?: string;
  zalo?: string;
  github?: string;
}

export interface SiteSettings {
  general?: SiteGeneral;
  about?: SiteAbout;
  socials?: SiteSocials;
}

export interface UpdateSettingsDto {
  general?: Partial<SiteGeneral>;
  about?: Partial<SiteAbout>;
  socials?: Partial<SiteSocials>;
}
