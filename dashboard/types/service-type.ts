export interface ServiceType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceTypeDto {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  categoryId: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateServiceTypeDto extends Partial<CreateServiceTypeDto> {}
