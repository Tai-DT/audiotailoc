// Audio Equipment Specifications
export interface AudioEquipmentSpecs {
  brand?: string;
  model?: string;
  powerOutput?: string;
  frequencyResponse?: string;
  connectivity?: string[];
  warrantyMonths?: number;
  weightKg?: number;
  dimensions?: string;
}

// Service Category
export interface ServiceCategory {
  id: string;
  name: string;
  value: string;
  label: string;
  color?: string;
  icon?: string;
  description?: string;
}

// Service Type
export interface ServiceType {
  id: string;
  name: string;
  value: string;
  label: string;
  color?: string;
  icon?: string;
  description?: string;
  categoryId?: string; // Reference to parent category
}

// Service Package Options
export interface ServicePackage {
  id: string;
  name: string;
  description?: string;
  priceModifier: number; // Percentage or fixed amount
  durationModifier?: number; // In minutes
}

// Service Model
export interface Service {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl?: string; // Add imageUrl property
  shortDescription?: string;
  priceType?: string; // FIXED, RANGE, NEGOTIABLE, CONTACT
  basePriceCents: number;
  price: number;
  minPrice?: number;
  maxPrice?: number;
  minPriceDisplay?: number;
  maxPriceDisplay?: number;
  duration: number; // In minutes
  categoryId: string;
  typeId: string;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  
  // Audio specific fields
  equipmentSpecs?: AudioEquipmentSpecs;
  requirements?: string[];
  includedServices?: string[];
  features?: string[];
  
  // SEO Fields
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  canonicalUrl?: string;
  
  // Metadata
  viewCount: number;
  rating?: number;
  reviewCount: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  
  // Relations
  serviceCategory?: ServiceCategory;
  serviceType?: ServiceType;
  packages?: ServicePackage[];
  
  _count?: {
    bookings: number;
    reviews: number;
  };
}

// Service Form Data
export interface ServiceFormData {
  // Basic Info
  name: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  
  // Pricing & Duration
  priceType?: string; // FIXED, RANGE, NEGOTIABLE, CONTACT
  basePriceCents: number;
  price: number;
  minPrice?: number;
  maxPrice?: number;
  duration: number; // In minutes
  
  // Categorization
  categoryId: string;
  typeId: string;
  
  // Media
  images: string[];
  
  // Audio Equipment Details
  equipmentSpecs?: {
    brand?: string;
    model?: string;
    powerOutput?: string;
    frequencyResponse?: string;
    connectivity?: string[];
    warrantyMonths?: number;
    weightKg?: number;
    dimensions?: string;
  };
  
  // Service Details
  requirements?: string[];
  includedServices?: string[];
  features?: string[];
  
  // Status
  isActive?: boolean;
  isFeatured?: boolean;
  
  // SEO Fields
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  canonicalUrl?: string;
}
