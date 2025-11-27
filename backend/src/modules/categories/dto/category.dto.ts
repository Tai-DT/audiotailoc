export class CreateCategoryDto {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
}

export class UpdateCategoryDto {
  name?: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
}
