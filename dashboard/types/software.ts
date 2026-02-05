export interface SoftwareProductRef {
  id: string;
  slug?: string;
  name?: string;
  priceCents?: number;
  imageUrl?: string;
}

export interface Software {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category: string;
  platform: string;
  version?: string;
  priceCents: number;
  isPaidRequired: boolean;
  downloadUrl?: string | null;
  websiteUrl?: string | null;
  imageUrl?: string | null;
  features?: string | null;
  productId?: string | null;
  isActive: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  product?: SoftwareProductRef | null;
}

export type SoftwareFormData = {
  name: string;
  slug?: string;
  description?: string;
  category: string;
  platform: string;
  version?: string;
  priceCents?: number;
  isPaidRequired?: boolean;
  downloadUrl?: string;
  websiteUrl?: string;
  imageUrl?: string;
  features?: string;
  productId?: string;
  isActive?: boolean;
};
