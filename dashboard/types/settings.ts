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

export interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress?: string;
  storeLogo?: string;
}

export interface BusinessSettings {
  taxCode?: string;
  businessLicense?: string;
  currency?: string;
  timezone?: string;
}

export interface EmailSettings {
  emailHost?: string;
  emailPort?: string;
  emailUsername?: string;
  emailPassword?: string;
  emailFrom?: string;
}

export interface NotificationSettings {
  orderNotification?: boolean;
  paymentNotification?: boolean;
  reviewNotification?: boolean;
  lowStockNotification?: boolean;
}

export interface SecuritySettings {
  twoFactorAuth?: boolean;
  sessionTimeout?: number;
  passwordExpiry?: number;
  maxLoginAttempts?: number;
}

export interface SiteSettings {
  general?: SiteGeneral;
  about?: SiteAbout;
  socials?: SiteSocials;
  store?: StoreSettings;
  business?: BusinessSettings;
  email?: EmailSettings;
  notifications?: NotificationSettings;
  security?: SecuritySettings;
}

export interface UpdateSettingsDto {
  general?: Partial<SiteGeneral>;
  about?: Partial<SiteAbout>;
  socials?: Partial<SiteSocials>;
  store?: Partial<StoreSettings>;
  business?: Partial<BusinessSettings>;
  email?: Partial<EmailSettings>;
  notifications?: Partial<NotificationSettings>;
  security?: Partial<SecuritySettings>;
}
