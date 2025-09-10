export interface Banner {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  imageUrl: string;
  mobileImageUrl?: string | null;
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
  mobileImageUrl?: string;
  linkUrl?: string;
  buttonLabel?: string;
  page: string;
  locale?: string;
  position: number;
  isActive: boolean;
  startAt?: string;
  endAt?: string;
}

export interface UpdateBannerDto extends Partial<CreateBannerDto> {}

export type BannerPage = 'home' | 'about' | 'services' | 'products' | 'contact';
