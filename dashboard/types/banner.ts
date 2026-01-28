export interface Banner {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  imageUrl: string;
  darkImageUrl?: string | null;
  mobileImageUrl?: string | null;
  darkMobileImageUrl?: string | null;
  images?: string[]; // Array support for multiple images
  darkImages?: string[]; // Array support for multiple dark images
  mobileImages?: string[]; // Array support for multiple mobile images
  darkMobileImages?: string[]; // Array support for multiple dark mobile images
  linkUrl?: string | null;
  buttonLabel?: string | null;
  page: string;
  locale?: string | null;
  position: number;
  isActive: boolean;
  startAt?: string | null;
  endAt?: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BannerListResponse {
  items: Banner[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateBannerDto {
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  darkImageUrl?: string;
  mobileImageUrl?: string;
  darkMobileImageUrl?: string;
  images?: string[]; // Array support for multiple images
  darkImages?: string[]; // Array support for multiple dark images
  mobileImages?: string[]; // Array support for multiple mobile images
  darkMobileImages?: string[]; // Array support for multiple dark mobile images
  linkUrl?: string;
  buttonLabel?: string;
  page: string;
  locale?: string;
  position: number;
  isActive: boolean;
  startAt?: string;
  endAt?: string;
}

export type UpdateBannerDto = Partial<CreateBannerDto>

export type BannerPage = 'home' | 'about' | 'services' | 'products' | 'contact';
