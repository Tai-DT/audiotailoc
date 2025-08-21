import { notFound } from 'next/navigation';

export const locales = ['vi', 'en'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'vi';

// Locale configuration
export const localeConfig = {
  vi: {
    name: 'Tiếng Việt',
    flag: '🇻🇳',
    currency: 'VND',
    currencySymbol: '₫',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: 'vi-VN',
    rtl: false,
  },
  en: {
    name: 'English',
    flag: '🇺🇸',
    currency: 'USD',
    currencySymbol: '$',
    dateFormat: 'MM/dd/yyyy',
    numberFormat: 'en-US',
    rtl: false,
  },
};

// Dictionary type
export type Dictionary = {
  // Navigation
  nav: {
    home: string;
    products: string;
    categories: string;
    about: string;
    contact: string;
    cart: string;
    account: string;
    login: string;
    register: string;
    logout: string;
    dashboard: string;
    search: string;
  };
  
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    remove: string;
    update: string;
    create: string;
    view: string;
    back: string;
    next: string;
    previous: string;
    submit: string;
    reset: string;
    clear: string;
    search: string;
    filter: string;
    sort: string;
    yes: string;
    no: string;
    ok: string;
    close: string;
    open: string;
    show: string;
    hide: string;
    more: string;
    less: string;
    all: string;
    none: string;
    select: string;
    choose: string;
    upload: string;
    download: string;
    copy: string;
    share: string;
    print: string;
    export: string;
    import: string;
  };

  // Product related
  product: {
    name: string;
    description: string;
    price: string;
    category: string;
    brand: string;
    sku: string;
    stock: string;
    inStock: string;
    outOfStock: string;
    lowStock: string;
    addToCart: string;
    addToWishlist: string;
    removeFromWishlist: string;
    buyNow: string;
    viewDetails: string;
    specifications: string;
    reviews: string;
    rating: string;
    images: string;
    features: string;
    warranty: string;
    shipping: string;
    availability: string;
    quantity: string;
    total: string;
    subtotal: string;
    discount: string;
    tax: string;
    featured: string;
    bestseller: string;
    newArrival: string;
    onSale: string;
    recommended: string;
    similar: string;
    relatedProducts: string;
    frequentlyBoughtTogether: string;
  };

  // Cart and Checkout
  cart: {
    title: string;
    empty: string;
    items: string;
    item: string;
    quantity: string;
    price: string;
    total: string;
    subtotal: string;
    shipping: string;
    tax: string;
    discount: string;
    grandTotal: string;
    proceedToCheckout: string;
    continueShopping: string;
    updateCart: string;
    removeItem: string;
    clearCart: string;
    applyCoupon: string;
    couponCode: string;
    invalidCoupon: string;
    couponApplied: string;
  };

  checkout: {
    title: string;
    shippingAddress: string;
    billingAddress: string;
    paymentMethod: string;
    orderSummary: string;
    placeOrder: string;
    processing: string;
    orderPlaced: string;
    orderNumber: string;
    thankYou: string;
    orderConfirmation: string;
    estimatedDelivery: string;
    trackOrder: string;
    downloadInvoice: string;
    continueShoppingAfterOrder: string;
  };

  // User Account
  account: {
    profile: string;
    orders: string;
    wishlist: string;
    addresses: string;
    settings: string;
    security: string;
    notifications: string;
    preferences: string;
    personalInfo: string;
    changePassword: string;
    twoFactorAuth: string;
    loginHistory: string;
    deleteAccount: string;
    emailVerification: string;
    phoneVerification: string;
  };

  // Forms
  form: {
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    currentPassword: string;
    newPassword: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    company: string;
    website: string;
    dateOfBirth: string;
    gender: string;
    male: string;
    female: string;
    other: string;
    required: string;
    optional: string;
    invalid: string;
    tooShort: string;
    tooLong: string;
    passwordMismatch: string;
    invalidEmail: string;
    invalidPhone: string;
    termsAndConditions: string;
    privacyPolicy: string;
    agreeToTerms: string;
    subscribeNewsletter: string;
  };

  // Messages
  messages: {
    welcome: string;
    goodbye: string;
    thankYou: string;
    congratulations: string;
    sorry: string;
    oops: string;
    comingSoon: string;
    underMaintenance: string;
    pageNotFound: string;
    accessDenied: string;
    sessionExpired: string;
    networkError: string;
    serverError: string;
    validationError: string;
    saveSuccess: string;
    deleteSuccess: string;
    updateSuccess: string;
    createSuccess: string;
    loginSuccess: string;
    logoutSuccess: string;
    registrationSuccess: string;
    passwordResetSent: string;
    passwordResetSuccess: string;
    emailVerificationSent: string;
    emailVerified: string;
    phoneVerified: string;
    orderPlacedSuccess: string;
    paymentSuccess: string;
    paymentFailed: string;
    shippingUpdated: string;
    orderCancelled: string;
    orderDelivered: string;
    reviewSubmitted: string;
    wishlistAdded: string;
    wishlistRemoved: string;
    cartUpdated: string;
    couponApplied: string;
    subscriptionSuccess: string;
    unsubscribeSuccess: string;
  };

  // Time and Date
  time: {
    now: string;
    today: string;
    yesterday: string;
    tomorrow: string;
    thisWeek: string;
    lastWeek: string;
    nextWeek: string;
    thisMonth: string;
    lastMonth: string;
    nextMonth: string;
    thisYear: string;
    lastYear: string;
    nextYear: string;
    seconds: string;
    minutes: string;
    hours: string;
    days: string;
    weeks: string;
    months: string;
    years: string;
    ago: string;
    from_now: string;
    january: string;
    february: string;
    march: string;
    april: string;
    may: string;
    june: string;
    july: string;
    august: string;
    september: string;
    october: string;
    november: string;
    december: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };

  // Business specific
  business: {
    companyName: string;
    tagline: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    workingHours: string;
    socialMedia: string;
    aboutUs: string;
    ourMission: string;
    ourVision: string;
    ourValues: string;
    whyChooseUs: string;
    testimonials: string;
    faq: string;
    support: string;
    contactUs: string;
    getInTouch: string;
    followUs: string;
    newsletter: string;
    blog: string;
    news: string;
    events: string;
    careers: string;
    partners: string;
    awards: string;
    certifications: string;
  };
};

// Get dictionary for a locale
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  try {
    const dictionary = await import(`../dictionaries/${locale}.json`);
    return dictionary.default;
  } catch (error) {
    // Fallback to default locale if dictionary not found
    if (locale !== defaultLocale) {
      return getDictionary(defaultLocale);
    }
    throw new Error(`Dictionary not found for locale: ${locale}`);
  }
}

// Validate locale
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

// Get locale from request
export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/');
  const potentialLocale = segments[1];
  
  if (isValidLocale(potentialLocale)) {
    return potentialLocale;
  }
  
  return defaultLocale;
}

// Remove locale from pathname
export function removeLocaleFromPathname(pathname: string, locale: Locale): string {
  if (pathname.startsWith(`/${locale}`)) {
    return pathname.slice(`/${locale}`.length) || '/';
  }
  return pathname;
}

// Add locale to pathname
export function addLocaleToPathname(pathname: string, locale: Locale): string {
  if (locale === defaultLocale) {
    return pathname;
  }
  return `/${locale}${pathname === '/' ? '' : pathname}`;
}

// Format currency
export function formatCurrency(
  amount: number,
  locale: Locale,
  currency?: string
): string {
  const config = localeConfig[locale];
  const currencyCode = currency || config.currency;
  
  try {
    return new Intl.NumberFormat(config.numberFormat, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: currencyCode === 'VND' ? 0 : 2,
    }).format(amount);
  } catch (error) {
    // Fallback formatting
    const symbol = currency === 'USD' ? '$' : '₫';
    const formattedAmount = new Intl.NumberFormat(config.numberFormat).format(amount);
    return currencyCode === 'VND' ? `${formattedAmount}${symbol}` : `${symbol}${formattedAmount}`;
  }
}

// Format number
export function formatNumber(number: number, locale: Locale): string {
  const config = localeConfig[locale];
  return new Intl.NumberFormat(config.numberFormat).format(number);
}

// Format date
export function formatDate(date: Date, locale: Locale, options?: Intl.DateTimeFormatOptions): string {
  const config = localeConfig[locale];
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return new Intl.DateTimeFormat(config.numberFormat, { ...defaultOptions, ...options }).format(date);
}

// Format relative time
export function formatRelativeTime(date: Date, locale: Locale): string {
  const config = localeConfig[locale];
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const rtf = new Intl.RelativeTimeFormat(config.numberFormat, { numeric: 'auto' });
  
  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
  }
}

// Get browser locale
export function getBrowserLocale(): Locale {
  if (typeof window === 'undefined') {
    return defaultLocale;
  }
  
  const browserLang = navigator.language.split('-')[0];
  return isValidLocale(browserLang) ? browserLang : defaultLocale;
}

// Pluralization helper
export function pluralize(
  count: number,
  singular: string,
  plural: string,
  locale: Locale = defaultLocale
): string {
  if (locale === 'vi') {
    // Vietnamese doesn't have plural forms
    return singular;
  }
  
  return count === 1 ? singular : plural;
}

// Text direction helper
export function getTextDirection(locale: Locale): 'ltr' | 'rtl' {
  return localeConfig[locale].rtl ? 'rtl' : 'ltr';
}

// Locale-aware sorting
export function createCollator(locale: Locale): Intl.Collator {
  const config = localeConfig[locale];
  return new Intl.Collator(config.numberFormat, {
    sensitivity: 'base',
    numeric: true,
  });
}

// Translation helper with interpolation
export function t(
  key: string,
  dictionary: Dictionary,
  params?: Record<string, string | number>
): string {
  const keys = key.split('.');
  let value: any = dictionary;
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  if (typeof value !== 'string') {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }
  
  if (!params) {
    return value;
  }
  
  // Simple interpolation
  return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
    return params[paramKey]?.toString() || match;
  });
}

// Middleware helper for locale detection
export function detectLocale(request: Request): Locale {
  // Try to get locale from URL
  const url = new URL(request.url);
  const pathname = url.pathname;
  const localeFromPath = getLocaleFromPathname(pathname);
  
  if (localeFromPath !== defaultLocale) {
    return localeFromPath;
  }
  
  // Try to get locale from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLanguages = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim().split('-')[0]);
    
    for (const lang of preferredLanguages) {
      if (isValidLocale(lang)) {
        return lang;
      }
    }
  }
  
  return defaultLocale;
}
