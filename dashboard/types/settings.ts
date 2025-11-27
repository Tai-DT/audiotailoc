export interface SiteGeneral {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  storeLogo: string;
}

export interface SiteBusiness {
  taxCode: string;
  businessLicense: string;
  currency: string;
  timezone: string;
}

export interface SiteEmail {
  emailHost: string;
  emailPort: string;
  emailUsername: string;
  emailPassword: string;
  emailFrom: string;
}

export interface SiteNotifications {
  orderNotification: boolean;
  paymentNotification: boolean;
  reviewNotification: boolean;
  lowStockNotification: boolean;
}

export interface SiteSecurity {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordExpiry: number;
  maxLoginAttempts: number;
}

export interface SiteSettingsState extends SiteGeneral, SiteBusiness, SiteEmail, SiteNotifications, SiteSecurity { }

export interface SiteSettingsResponse {
  general?: Partial<SiteGeneral>;
  business?: Partial<SiteBusiness>;
  email?: Partial<SiteEmail>;
  notifications?: Partial<SiteNotifications>;
  security?: Partial<SiteSecurity>;
}

export interface UpdateSettingsDto {
  general?: Partial<SiteGeneral>;
  business?: Partial<SiteBusiness>;
  email?: Partial<SiteEmail>;
  notifications?: Partial<SiteNotifications>;
  security?: Partial<SiteSecurity>;
}
